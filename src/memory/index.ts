/**
 * Typed bridge to the canonical `memory/` folder.
 *
 * Everything a composition needs to stay on-system — the default voice, the
 * preset tokens, the three delivery formats and the no-render rule — is
 * re-exported here. Import from `src/memory` instead of hard-coding values.
 */
import { staticFile } from "remotion";
import memoryIndex from "../../memory/index.json";
import designTokens from "../../memory/design/tokens.json";
import housePreset from "../../memory/presets/house/style.json";
import walmartPreset from "../../memory/presets/walmart/style.json";
import voiceMemory from "../../memory/voice/default.json";

export type VoiceId = "SD_VOICE_03";

export type Emotion =
  | "identity"
  | "calm"
  | "curiosity"
  | "suspense"
  | "excitement"
  | "seriousness"
  | "concern"
  | "confidence"
  | "reflection"
  | "dramatic"
  | "friendly";

export type VideoFormatId = "vertical" | "horizontal" | "cover";

export const MEMORY = memoryIndex;

export const DEFAULT_VOICE = voiceMemory.default as VoiceId;
export const ALTERNATE_VOICE = voiceMemory.alternate as VoiceId;

export const VOICES = voiceMemory.voices;
export const EMOTIONS = voiceMemory.emotions as Emotion[];
export const DEFAULT_EMOTION: Emotion = "identity";

export const PRESETS = {
  house: housePreset,
  walmart: walmartPreset,
} as const;

export type PresetId = keyof typeof PRESETS;

export const DEFAULT_PRESET: PresetId = "house";

export const FORMATS = {
  vertical: { width: 1080, height: 1920, fps: 30 } as const,
  horizontal: { width: 1920, height: 1080, fps: 30 } as const,
  cover: { width: 1080, height: 1350, fps: 30, durationInFrames: 1 } as const,
} as const;

export const HOUSE_TOKENS = designTokens;

/** The memory is explicit: no MP4, no 4K, browser preview only. */
export const RENDERING = {
  browserPreviewOnly: true,
  renderMp4: false,
  render4k: false,
} as const;

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[—–]/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Resolve a permanent voice ID, name, combined form or unique prefix.
 * Throws instead of silently selecting another identity.
 */
export const resolveVoice = (query: string = DEFAULT_VOICE) => {
  const q = normalize(query);
  if (!q) throw new Error("Voice query is empty. Use SD_VOICE_03.");

  const exactId = VOICES.find((voice) => normalize(voice.id) === q);
  if (exactId) return exactId;

  const exactName = VOICES.find((voice) => normalize(voice.name) === q);
  if (exactName) return exactName;

  const exactCombined = VOICES.find(
    (voice) => normalize(`${voice.id} ${voice.name}`) === q,
  );
  if (exactCombined) return exactCombined;

  const prefixMatches = VOICES.filter(
    (voice) =>
      normalize(voice.id).startsWith(q) || normalize(voice.name).startsWith(q),
  );
  if (prefixMatches.length === 1) return prefixMatches[0];
  if (prefixMatches.length > 1) {
    throw new Error(
      `Voice query "${query}" is ambiguous. Use the permanent ID: ` +
        prefixMatches.map((voice) => voice.id).join(", "),
    );
  }

  throw new Error(
    `Voice "${query}" is not in the library. Available: ` +
      VOICES.map((voice) => `${voice.id} — ${voice.name}`).join(", ") +
      ". No substitute voice was used.",
  );
};

/**
 * Resolve a voice + emotion to a `staticFile()` URL.
 * Throws if the voice or emotion is not part of the curated library.
 */
export const getVoiceAssetPath = (
  query: string = DEFAULT_VOICE,
  emotion: Emotion = DEFAULT_EMOTION,
): string => {
  const voice = resolveVoice(query);
  if (!EMOTIONS.includes(emotion)) {
    throw new Error(
      `Unknown emotion "${emotion}". Valid: ${EMOTIONS.join(", ")}.`,
    );
  }
  if (emotion !== "identity" && !voice.emotions.includes(emotion)) {
    throw new Error(
      `Voice ${voice.id} has no "${emotion}" asset. Do not substitute another voice.`,
    );
  }
  return staticFile(voice.publicPathPattern.replace("{emotion}", emotion));
};

/** Convenience for UI/debug lists. */
export const listVoices = () =>
  VOICES.map((voice) => ({
    id: voice.id,
    name: voice.name,
    role: voice.role,
    engineVoice: voice.engineVoice,
    accent: voice.accent,
    emotions: voice.emotions,
  }));
