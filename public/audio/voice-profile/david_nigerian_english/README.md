# David Nigerian English — Cinematic Documentary Voice

This folder is the permanent speaker reference for the Simpledeav voice system.
The voice is **David's own recorded narration**, not a generic Nigerian TTS
voice. The original recording is never edited in place.

| File | Purpose |
| --- | --- |
| `reference.wav` | Original 48 kHz mono recording (63.96 s). Never overwrite. |
| `reference-clean.wav` | DC/room cleaned and loudness-normalised 48 kHz master. |
| `reference-16s.wav` | 16 s / 24 kHz prompt used by the cloning engines. |
| `reference-heldout.wav` | 22 s from the end, held out from cloning and used only for similarity checks. |
| `reference.txt` | Local Whisper transcript of the reference. |
| `profile.json` | Machine-readable profile, delivery chain and licensing notes. |

## Consent and use

The speaker recorded this sample and explicitly consents to local voice cloning
and to commercial narration in the owner's monetised social videos. Do not use
this profile to impersonate David in a context he has not approved. Disclose
synthetic narration where platform rules require it.

## Rebuilding the derived files

```bash
voice/.venv/bin/python voice/scripts/prepare_reference.py
```

## Profile summary

- Male Nigerian English, warm, confident, conversational documentary delivery.
- Default preset: `business_explanation`.
- Default engine: `chatterbox_onnx` (MIT).
- Commercial fallbacks: `pocket_tts` (CC BY 4.0), `openvoice_v2` (MIT + Edge en-NG base).
- Evaluation only: `xtts_v2` (CPML, non-commercial).
