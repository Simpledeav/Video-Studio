"""Chatterbox TTS through ONNX Runtime (MIT).

Chatterbox is a 0.5B zero-shot English TTS model with voice cloning and an
exaggeration control. This module runs the ONNX export on CPU without PyTorch,
which is what makes it usable on an Intel Mac where the current PyTorch macOS
x86_64 wheels stop at 2.2.2.

Model: https://huggingface.co/onnx-community/chatterbox-ONNX
Upstream: https://github.com/resemble-ai/chatterbox (MIT)
"""
from __future__ import annotations

import hashlib
import os
from pathlib import Path

import numpy as np
import soundfile as sf

from ..audio import AudioError, write_wav
from ..text import chunk_text
from .base import (
    EngineCapabilities,
    EngineSynthesis,
    SynthesisSettings,
    VoiceProfile,
)

_PROJECT_ROOT = Path(__file__).resolve().parents[2]
_MODEL_ROOT = Path(os.environ.get("VOICE_MODEL_ROOT", _PROJECT_ROOT / "models"))
_CACHE_ROOT = Path(os.environ.get("VOICE_CACHE_DIR", _PROJECT_ROOT / "voice" / "cache"))

START_SPEECH_TOKEN = 6561
STOP_SPEECH_TOKEN = 6562
S3GEN_SR = 24000
NUM_HIDDEN_LAYERS = 30
NUM_KV_HEADS = 16
HEAD_DIM = 64

_SESSIONS: dict[str, object] = {}
_TOKENIZER = None
_MODEL_SIGNATURE: tuple[str, ...] | None = None


class ChatterboxONNXEngine:
    id = "chatterbox_onnx"
    display_name = "Chatterbox 0.5B (ONNX int4, CPU)"
    capabilities = EngineCapabilities(
        emotion=True,
        speed=False,
        exaggeration=True,
        reference_audio=True,
        reference_text=False,
        word_timings=False,
        seed=True,
        sample_rate=S3GEN_SR,
        commercial_use=True,
        license_name="MIT (code and model weights)",
        license_url="https://github.com/resemble-ai/chatterbox",
        weights_license="MIT",
        notes=(
            "Zero-shot voice cloning with an exaggeration control. Speed is not "
            "native; the service applies a small atempo correction for delivery "
            "presets, capped at +/-6%. CFG weight is not exposed by this ONNX graph."
        ),
    )

    def _model_dir(self) -> Path:
        return Path(os.environ.get("CHATTERBOX_MODEL_DIR", _MODEL_ROOT / "chatterbox"))

    def _load(self):
        global _TOKENIZER, _MODEL_SIGNATURE
        import onnxruntime as ort
        from transformers import AutoTokenizer

        directory = self._model_dir()
        files = {
            "encoder": directory / "onnx" / "speech_encoder.onnx",
            "embed": directory / "onnx" / "embed_tokens.onnx",
            "lm": directory / "onnx" / "language_model_q4.onnx",
            "decoder": directory / "onnx" / "conditional_decoder.onnx",
        }
        missing = [str(path) for path in files.values() if not path.is_file()]
        if missing:
            raise AudioError(
                "Chatterbox ONNX files are missing:\n  "
                + "\n  ".join(missing)
                + "\nRun voice/install.sh to download the model."
            )
        signature = tuple(str(path) for path in files.values())
        if _SESSIONS and _MODEL_SIGNATURE == signature:
            return _SESSIONS, _TOKENIZER

        options = ort.SessionOptions()
        options.intra_op_num_threads = max(2, min(4, os.cpu_count() or 2))
        options.inter_op_num_threads = 1
        options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        providers = ["CPUExecutionProvider"]
        sessions = {
            "encoder": ort.InferenceSession(str(files["encoder"]), sess_options=options, providers=providers),
            "embed": ort.InferenceSession(str(files["embed"]), sess_options=options, providers=providers),
            "lm": ort.InferenceSession(str(files["lm"]), sess_options=options, providers=providers),
            "decoder": ort.InferenceSession(str(files["decoder"]), sess_options=options, providers=providers),
        }
        tokenizer = AutoTokenizer.from_pretrained(str(directory))
        if tokenizer.eos_token_id is None:
            tokenizer.eos_token_id = STOP_SPEECH_TOKEN
        _SESSIONS.clear()
        _SESSIONS.update(sessions)
        _TOKENIZER = tokenizer
        _MODEL_SIGNATURE = signature
        return _SESSIONS, _TOKENIZER

    def synthesize(
        self,
        text: str,
        profile: VoiceProfile,
        settings: SynthesisSettings,
        output_wav: Path,
    ) -> EngineSynthesis:
        sessions, tokenizer = self._load()
        reference = profile.effective_reference
        if not reference.is_file():
            raise AudioError(f"Voice reference not found: {reference}")

        conditioning = _reference_conditioning(reference, sessions)
        chunks = chunk_text(text, max_words=34)
        if not chunks:
            raise AudioError("Cannot synthesize empty text.")

        pieces: list[np.ndarray] = []
        pause_seconds = 0.12
        for index, chunk in enumerate(chunks):
            audio = _synthesize_chunk(
                chunk,
                tokenizer,
                sessions,
                conditioning,
                exaggeration=float(settings.exaggeration),
                temperature=float(settings.temperature),
                top_p=float(settings.top_p),
                min_p=0.05,
                repetition_penalty=float(settings.repetition_penalty),
                seed=int(settings.seed) + index * 7919,
            )
            if audio.size == 0:
                raise AudioError(f"Chatterbox returned no audio for chunk: {chunk[:80]!r}")
            pieces.append(_edge_fade(audio, S3GEN_SR))
            if index + 1 < len(chunks):
                pieces.append(np.zeros(int(pause_seconds * S3GEN_SR), dtype=np.float32))

        combined = np.concatenate(pieces) if pieces else np.zeros(1, dtype=np.float32)
        write_wav(output_wav, combined, S3GEN_SR, subtype="PCM_16")
        return EngineSynthesis(
            wav_path=output_wav,
            sample_rate=S3GEN_SR,
            duration_seconds=len(combined) / S3GEN_SR,
            settings={
                "engine": self.id,
                "model": "chatterbox-ONNX-q4",
                "reference": str(reference),
                "chunks": len(chunks),
                "exaggeration": settings.exaggeration,
                "temperature": settings.temperature,
                "topP": settings.top_p,
                "repetitionPenalty": settings.repetition_penalty,
                "seed": settings.seed,
            },
            warnings=[
                "Chatterbox has no native speed control; the service applies a small tempo correction for presets (max +/-6%).",
                "The ONNX graph exposes exaggeration but not CFG weight; cfgWeight in presets is recorded but not applied by this engine.",
                "Perth watermarking is not applied by this local pipeline. Disclose synthetic narration in published videos.",
            ],
        )


def _reference_conditioning(reference: Path, sessions: dict[str, object]) -> dict[str, np.ndarray]:
    digest = hashlib.sha256(reference.read_bytes()).hexdigest()[:16]
    cache_dir = _CACHE_ROOT / "chatterbox"
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_path = cache_dir / f"ref-{digest}.npz"
    if cache_path.is_file():
        with np.load(cache_path) as data:
            return {key: data[key] for key in data.files}

    samples, sample_rate = sf.read(str(reference), dtype="float32", always_2d=False)
    if samples.ndim > 1:
        samples = samples[:, 0]
    if sample_rate != S3GEN_SR:
        import librosa

        samples = librosa.resample(samples, orig_sr=sample_rate, target_sr=S3GEN_SR)
    # Keep a clean 12-18 second prompt. Longer prompts do not help the encoder
    # and slow every generation down.
    max_samples = int(18 * S3GEN_SR)
    if samples.size > max_samples:
        start = min(int(1.0 * S3GEN_SR), max(0, samples.size - max_samples))
        samples = samples[start : start + max_samples]
    peak = float(np.max(np.abs(samples))) if samples.size else 0.0
    if peak > 0:
        samples = samples / max(peak, 0.95) * 0.95

    encoder = sessions["encoder"]
    audio_values = np.ascontiguousarray(samples[np.newaxis, :], dtype=np.float32)
    outputs = encoder.run(None, {"audio_values": audio_values})
    if len(outputs) < 4:
        raise AudioError("Chatterbox speech encoder returned an unexpected number of outputs.")
    cond_emb, prompt_token, ref_x_vector, prompt_feat = outputs[:4]
    payload = {
        "cond_emb": np.asarray(cond_emb, dtype=np.float32),
        "prompt_token": np.asarray(prompt_token, dtype=np.int64),
        "ref_x_vector": np.asarray(ref_x_vector, dtype=np.float32),
        "prompt_feat": np.asarray(prompt_feat, dtype=np.float32),
    }
    np.savez(cache_path, **payload)
    return payload


def _synthesize_chunk(
    text: str,
    tokenizer,
    sessions: dict[str, object],
    conditioning: dict[str, np.ndarray],
    *,
    exaggeration: float,
    temperature: float,
    top_p: float,
    min_p: float,
    repetition_penalty: float,
    seed: int,
) -> np.ndarray:
    encoded = tokenizer(text, return_tensors="np")
    input_ids = np.asarray(encoded["input_ids"], dtype=np.int64)
    if input_ids.size == 0:
        return np.zeros(0, dtype=np.float32)
    position_ids = np.where(
        input_ids >= START_SPEECH_TOKEN,
        0,
        np.arange(input_ids.shape[1])[np.newaxis, :] - 1,
    ).astype(np.int64)

    embed_session = sessions["embed"]
    lm_session = sessions["lm"]
    decoder_session = sessions["decoder"]
    cond_emb = conditioning["cond_emb"]
    prompt_token = conditioning["prompt_token"]
    ref_x_vector = conditioning["ref_x_vector"]
    prompt_feat = conditioning["prompt_feat"]

    words = max(1, len(text.split()))
    max_new_tokens = int(min(1000, max(96, words * 9.8 + 48)))
    rng = np.random.default_rng(seed)

    generate_tokens = np.array([[START_SPEECH_TOKEN]], dtype=np.int64)
    attention_mask = None
    past_key_values = None

    for step in range(max_new_tokens):
        if step == 0:
            embeddings = embed_session.run(
                None,
                {
                    "input_ids": input_ids,
                    "position_ids": position_ids,
                    "exaggeration": np.array([exaggeration], dtype=np.float32),
                },
            )[0]
            embeddings = np.ascontiguousarray(embeddings, dtype=np.float32)
            inputs_embeds = np.concatenate((cond_emb, embeddings), axis=1)
            batch_size, seq_len, _ = inputs_embeds.shape
            past_key_values = {
                f"past_key_values.{layer}.{kv}": np.zeros(
                    [batch_size, NUM_KV_HEADS, 0, HEAD_DIM], dtype=np.float32
                )
                for layer in range(NUM_HIDDEN_LAYERS)
                for kv in ("key", "value")
            }
            attention_mask = np.ones((batch_size, seq_len), dtype=np.int64)
        else:
            inputs_embeds = embed_session.run(
                None,
                {
                    "input_ids": generate_tokens[:, -1:],
                    "position_ids": np.full((1, 1), step, dtype=np.int64),
                    "exaggeration": np.array([exaggeration], dtype=np.float32),
                },
            )[0]
            inputs_embeds = np.ascontiguousarray(inputs_embeds, dtype=np.float32)

        feeds = {
            "inputs_embeds": inputs_embeds,
            "attention_mask": attention_mask,
            **past_key_values,
        }
        outputs = lm_session.run(None, feeds)
        logits = np.asarray(outputs[0], dtype=np.float32)[:, -1, :]
        present = outputs[1:]

        scores = _apply_repetition_penalty(logits, generate_tokens, repetition_penalty)
        next_token = _sample(scores, rng, temperature=temperature, top_p=top_p, min_p=min_p)
        generate_tokens = np.concatenate(
            (generate_tokens, np.array([[next_token]], dtype=np.int64)), axis=1
        )
        if next_token == STOP_SPEECH_TOKEN:
            break

        if step == 0:
            attention_mask = np.concatenate(
                [attention_mask, np.ones((attention_mask.shape[0], 1), dtype=np.int64)], axis=1
            )
        else:
            attention_mask = np.concatenate(
                [attention_mask, np.ones((attention_mask.shape[0], 1), dtype=np.int64)], axis=1
            )
        for index, key in enumerate(past_key_values):
            past_key_values[key] = present[index]

    generated = generate_tokens[:, 1:]
    if generated.size and generated[0, -1] == STOP_SPEECH_TOKEN:
        generated = generated[:, :-1]
    speech_tokens = np.concatenate((prompt_token, generated), axis=1).astype(np.int64)
    wav = decoder_session.run(
        None,
        {
            "speech_tokens": speech_tokens,
            "speaker_embeddings": conditioning["ref_x_vector"],
            "speaker_features": conditioning["prompt_feat"],
        },
    )[0]
    wav = np.asarray(wav, dtype=np.float32).squeeze()
    return np.ascontiguousarray(wav)


def _apply_repetition_penalty(
    logits: np.ndarray, generated: np.ndarray, penalty: float
) -> np.ndarray:
    if penalty <= 1.0 or generated.size == 0:
        return logits
    scores = logits.copy()
    for token in np.unique(generated):
        index = int(token)
        if 0 <= index < scores.shape[-1]:
            value = scores[0, index]
            scores[0, index] = value * penalty if value < 0 else value / penalty
    return scores


def _sample(
    logits: np.ndarray,
    rng: np.random.Generator,
    *,
    temperature: float,
    top_p: float,
    min_p: float,
) -> int:
    scores = logits[0].astype(np.float64) / max(0.05, temperature)
    scores -= np.max(scores)
    probabilities = np.exp(scores)
    probabilities /= np.sum(probabilities)

    if min_p > 0:
        threshold = np.max(probabilities) * min_p
        probabilities[probabilities < threshold] = 0.0
    if 0 < top_p < 1:
        sorted_indices = np.argsort(probabilities)[::-1]
        cumulative = np.cumsum(probabilities[sorted_indices])
        cutoff = cumulative > top_p
        if np.any(cutoff):
            keep = sorted_indices[: int(np.argmax(cutoff)) + 1]
            mask = np.zeros_like(probabilities)
            mask[keep] = probabilities[keep]
            probabilities = mask
    total = probabilities.sum()
    if not np.isfinite(total) or total <= 0:
        return int(np.argmax(logits[0]))
    probabilities /= total
    return int(rng.choice(probabilities.size, p=probabilities))


def _edge_fade(samples: np.ndarray, sample_rate: int, milliseconds: float = 8.0) -> np.ndarray:
    count = min(samples.size // 2, max(1, int(sample_rate * milliseconds / 1000)))
    if count <= 0:
        return samples
    window = np.linspace(0.0, 1.0, count, dtype=np.float32)
    output = samples.copy()
    output[:count] *= window
    output[-count:] *= window[::-1]
    return output
