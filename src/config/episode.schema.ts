import { BRAND, type SignatureTreatment } from "./brand";
import { isPaletteId, PALETTE_IDS, type PaletteId } from "./theme";

export const CHARACTER_ACTIONS = [
  "idle",
  "walk",
  "sit",
  "type",
  "point",
  "lookAtScreen",
  "surprise",
  "think",
  "celebrate",
  "turn",
  "sleep",
  "reconsider",
  "sitType",
  "sitPause",
  "sitReact",
] as const;

export type CharacterAction = (typeof CHARACTER_ACTIONS)[number];

export const SCENE_LAYOUTS = [
  "city",
  "office",
  "agentGrid",
  "chart",
  "threshold",
  "catch",
  "closing",
  "console",
  "documentary",
] as const;

export type SceneLayout = (typeof SCENE_LAYOUTS)[number];

export const CONSOLE_MODES = [
  "activation",
  "mission",
  "dashboard",
  "risk",
  "pause",
  "objective",
  "operations",
] as const;

export type ConsoleMode = (typeof CONSOLE_MODES)[number];

export const DOCUMENTARY_MODES = [
  "hook",
  "crisis",
  "complexity",
  "turning",
  "strategy",
  "comeback",
  "lesson",
] as const;

export type DocumentaryMode = (typeof DOCUMENTARY_MODES)[number];

export const TEXT_PRESETS = [
  "wordByWord",
  "staggeredPhrase",
  "maskedUp",
  "charReveal",
  "scaleSettle",
  "splitLine",
  "kineticEmphasis",
  "finalReveal",
] as const;

export type TextPreset = (typeof TEXT_PRESETS)[number];

export const CAMERA_MOTIONS = [
  "static",
  "pushIn",
  "pullOut",
  "panLeft",
  "panRight",
  "drift",
] as const;

export type CameraMotionType = (typeof CAMERA_MOTIONS)[number];

export const TRANSITIONS = ["cut", "fade", "wipe", "bloom"] as const;
export type TransitionType = (typeof TRANSITIONS)[number];

export const CHARACTER_EXPRESSIONS = [
  "neutral",
  "focused",
  "surprised",
  "thoughtful",
  "smile",
  "concerned",
  "closed",
] as const;

export type CharacterExpression = (typeof CHARACTER_EXPRESSIONS)[number];

export type HeadlineConfig = {
  kicker?: string;
  text: string;
  accentWords?: string[];
  preset: TextPreset;
  /** Seconds relative to the start of this scene. */
  startSeconds: number;
  /** Seconds relative to the start of this scene. */
  endSeconds?: number;
  size?: "hero" | "display" | "statement";
  align?: "left" | "center";
  /** Optional semantic accent for risk/success beats. */
  accentTone?: "accent" | "positive" | "warning";
  maxWidth?: number;
  placement?: "top" | "middle" | "lower";
};

export type BackgroundConfig = {
  imagePath?: string;
  videoPath?: string;
  imageObjectPosition?: string;
  videoObjectPosition?: string;
  imageOpacity?: number;
  grade?: "night" | "dawn" | "noir" | "warm" | "neutral";
  parallax?: number;
};

export type CharacterConfig = {
  action: CharacterAction;
  x: number;
  y: number;
  scale: number;
  facing: "front" | "left" | "right";
  expression?: CharacterExpression;
};

export type CameraConfig = {
  motion: CameraMotionType;
  intensity: number;
};

export type SceneVisualConfig = {
  kind: "none" | "tasks" | "agents" | "chart" | "signals" | "decision" | "console" | "documentary";
  title?: string;
  labels?: string[];
  /** Used by the console layout to switch its laptop storyboard. */
  consoleMode?: ConsoleMode;
  /** Used by the documentary composition to switch scene treatment. */
  documentaryMode?: DocumentaryMode;
  /** Optional scene-relative reveal times for scripted interface cards. */
  revealSeconds?: number[];
  metricStart?: number;
  metricEnd?: number;
  metricPrefix?: string;
  metricSuffix?: string;
  goodLabel?: string;
  badLabel?: string;
};

export type Scene = {
  id: string;
  startSeconds: number;
  durationSeconds: number;
  layout: SceneLayout;
  background: BackgroundConfig;
  headlines: HeadlineConfig[];
  character: CharacterConfig;
  camera: CameraConfig;
  transitionIn: TransitionType;
  visual?: SceneVisualConfig;
};

export type SubtitleCue = {
  start: number;
  end: number;
  text: string;
};

export type NarrationConfig = {
  text: string;
  voice: string;
  voiceAudioPath: string;
  subtitlePath: string;
  wordTimingsPath: string;
  audioDurationSeconds: number;
  subtitles: SubtitleCue[];
};

export type MusicVolumePoint = {
  timeSeconds: number;
  volume: number;
};

export type MusicConfig = {
  path: string;
  volume: number;
  fadeInSeconds: number;
  fadeOutSeconds: number;
  duckUnderNarration: boolean;
  /** Optional frame-accurate music automation for story beats. */
  volumeAutomation?: MusicVolumePoint[];
};

export type SoundEffectConfig = {
  id: string;
  path: string;
  startSeconds: number;
  durationSeconds: number;
  volume: number;
  fadeInSeconds: number;
  fadeOutSeconds: number;
};

export type AssetManifestEntry = {
  path: string;
  kind: "audio" | "image" | "video" | "font" | "avatar" | "subtitle" | "data";
  sourceUrl: string;
  creator: string;
  license: string;
  notes: string;
};

export type EpisodeBrandConfig = {
  enabled: boolean;
  signatureEnabled: boolean;
  avatarEnabled: boolean;
  treatment: SignatureTreatment;
  revealDurationSeconds: number;
  startSeconds: number;
};

export type Episode = {
  schemaVersion: string;
  episodeId: string;
  title: string;
  topic: string;
  durationSeconds: number;
  fps: number;
  themeId: PaletteId;
  /** Optional episode-wide typography system. */
  fontFamily?: "manrope" | "poppins";
  narration: NarrationConfig;
  music: MusicConfig;
  soundEffects: SoundEffectConfig[];
  scenes: Scene[];
  brand: EpisodeBrandConfig;
  assets: AssetManifestEntry[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const includes = <T extends readonly string[]>(values: T, value: unknown): value is T[number] =>
  typeof value === "string" && (values as readonly string[]).includes(value);

const checkLocalPath = (value: unknown, label: string, errors: string[]) => {
  if (!isNonEmptyString(value)) {
    errors.push(`${label} is required.`);
    return;
  }
  if (!value.startsWith("/")) {
    errors.push(`${label} must be a local public path beginning with "/" (got "${value}").`);
  }
  if (/^https?:\/\//i.test(value)) {
    errors.push(`${label} must be downloaded locally, not loaded from the network.`);
  }
};

export const collectEpisodeErrors = (input: unknown): string[] => {
  const errors: string[] = [];
  if (!isRecord(input)) {
    return ["Episode must be a JSON object."];
  }

  if (!isNonEmptyString(input.schemaVersion)) errors.push("schemaVersion is required.");
  if (!isNonEmptyString(input.episodeId)) errors.push("episodeId is required.");
  if (!isNonEmptyString(input.title)) errors.push("title is required.");
  if (!isNonEmptyString(input.topic)) errors.push("topic is required.");
  if (!isFiniteNumber(input.durationSeconds)) {
    errors.push("durationSeconds is required.");
  } else if (input.durationSeconds < 60 || input.durationSeconds > 90) {
    errors.push("durationSeconds must be between 60 and 90.");
  }
  if (input.fps !== 30) errors.push("fps must be 30 for this template.");
  if (!isNonEmptyString(input.themeId) || !isPaletteId(input.themeId)) {
    errors.push(`themeId must be one of: ${PALETTE_IDS.join(", ")}.`);
  }
  if (
    input.fontFamily !== undefined &&
    !["manrope", "poppins"].includes(String(input.fontFamily))
  ) {
    errors.push('fontFamily must be "manrope" or "poppins".');
  }

  if (!isRecord(input.narration)) {
    errors.push("narration is required.");
  } else {
    const narration = input.narration;
    if (!isNonEmptyString(narration.text)) errors.push("narration.text is required.");
    if (!isNonEmptyString(narration.voice)) errors.push("narration.voice is required.");
    checkLocalPath(narration.voiceAudioPath, "narration.voiceAudioPath", errors);
    checkLocalPath(narration.subtitlePath, "narration.subtitlePath", errors);
    checkLocalPath(narration.wordTimingsPath, "narration.wordTimingsPath", errors);
    if (!isFiniteNumber(narration.audioDurationSeconds) || narration.audioDurationSeconds <= 0) {
      errors.push("narration.audioDurationSeconds must be positive.");
    }
    if (!Array.isArray(narration.subtitles) || narration.subtitles.length === 0) {
      errors.push("narration.subtitles must contain at least one timed cue.");
    } else {
      let previousEnd = -1;
      narration.subtitles.forEach((cue, index) => {
        if (!isRecord(cue)) {
          errors.push(`narration.subtitles[${index}] must be an object.`);
          return;
        }
        if (!isFiniteNumber(cue.start) || !isFiniteNumber(cue.end) || !isNonEmptyString(cue.text)) {
          errors.push(`narration.subtitles[${index}] needs numeric start/end and text.`);
          return;
        }
        if (cue.end <= cue.start) errors.push(`narration.subtitles[${index}] ends before it starts.`);
        if (cue.start < previousEnd - 0.001) {
          errors.push(`narration.subtitles[${index}] overlaps the previous cue.`);
        }
        if (isFiniteNumber(narration.audioDurationSeconds) && cue.end > narration.audioDurationSeconds + 0.05) {
          errors.push(`narration.subtitles[${index}] ends after the narration audio.`);
        }
        previousEnd = cue.end;
      });
    }
  }

  if (!isRecord(input.music)) {
    errors.push("music is required.");
  } else {
    checkLocalPath(input.music.path, "music.path", errors);
    if (!isFiniteNumber(input.music.volume)) errors.push("music.volume must be a number.");
    if (!isFiniteNumber(input.music.fadeInSeconds)) errors.push("music.fadeInSeconds must be a number.");
    if (!isFiniteNumber(input.music.fadeOutSeconds)) errors.push("music.fadeOutSeconds must be a number.");
    if (typeof input.music.duckUnderNarration !== "boolean") {
      errors.push("music.duckUnderNarration must be boolean.");
    }
  }

  if (!Array.isArray(input.soundEffects)) {
    errors.push("soundEffects must be an array.");
  } else {
    input.soundEffects.forEach((effect, index) => {
      if (!isRecord(effect)) {
        errors.push(`soundEffects[${index}] must be an object.`);
        return;
      }
      if (!isNonEmptyString(effect.id)) errors.push(`soundEffects[${index}].id is required.`);
      checkLocalPath(effect.path, `soundEffects[${index}].path`, errors);
      if (!isFiniteNumber(effect.startSeconds) || effect.startSeconds < 0) {
        errors.push(`soundEffects[${index}].startSeconds must be >= 0.`);
      }
      if (!isFiniteNumber(effect.durationSeconds) || effect.durationSeconds <= 0) {
        errors.push(`soundEffects[${index}].durationSeconds must be positive.`);
      }
      if (!isFiniteNumber(effect.volume)) errors.push(`soundEffects[${index}].volume must be a number.`);
    });
  }

  if (!Array.isArray(input.scenes) || input.scenes.length === 0) {
    errors.push("scenes must contain at least one scene.");
  } else {
    let previousEnd = 0;
    input.scenes.forEach((scene, index) => {
      if (!isRecord(scene)) {
        errors.push(`scenes[${index}] must be an object.`);
        return;
      }
      if (!isNonEmptyString(scene.id)) errors.push(`scenes[${index}].id is required.`);
      if (!includes(SCENE_LAYOUTS, scene.layout)) {
        errors.push(`scenes[${index}].layout is invalid.`);
      }
      if (!includes(TRANSITIONS, scene.transitionIn)) {
        errors.push(`scenes[${index}].transitionIn is invalid.`);
      }
      if (!isFiniteNumber(scene.startSeconds) || !isFiniteNumber(scene.durationSeconds)) {
        errors.push(`scenes[${index}] needs numeric startSeconds and durationSeconds.`);
        return;
      }
      if (scene.durationSeconds <= 0) errors.push(`scenes[${index}].durationSeconds must be positive.`);
      if (Math.abs(scene.startSeconds - previousEnd) > 0.02) {
        errors.push(
          `scenes[${index}] starts at ${scene.startSeconds}s but the previous scene ends at ${previousEnd}s. Scenes must be contiguous.`,
        );
      }
      if (isFiniteNumber(input.durationSeconds)) {
        const end = scene.startSeconds + scene.durationSeconds;
        if (end > input.durationSeconds + 0.02) {
          errors.push(`scenes[${index}] ends at ${end}s, after the composition duration.`);
        }
      }
      previousEnd = scene.startSeconds + scene.durationSeconds;

      if (!isRecord(scene.background)) {
        errors.push(`scenes[${index}].background is required.`);
      } else {
        if (scene.background.imagePath !== undefined) {
          checkLocalPath(scene.background.imagePath, `scenes[${index}].background.imagePath`, errors);
        }
        if (scene.background.videoPath !== undefined) {
          checkLocalPath(scene.background.videoPath, `scenes[${index}].background.videoPath`, errors);
        }
        if (
          scene.background.imageOpacity !== undefined &&
          (!isFiniteNumber(scene.background.imageOpacity) ||
            scene.background.imageOpacity < 0 ||
            scene.background.imageOpacity > 1)
        ) {
          errors.push(`scenes[${index}].background.imageOpacity must be 0-1.`);
        }
      }

      if (!isRecord(scene.character)) {
        errors.push(`scenes[${index}].character is required.`);
      } else {
        if (!includes(CHARACTER_ACTIONS, scene.character.action)) {
          errors.push(`scenes[${index}].character.action is invalid.`);
        }
        if (
          !isFiniteNumber(scene.character.x) ||
          !isFiniteNumber(scene.character.y) ||
          !isFiniteNumber(scene.character.scale)
        ) {
          errors.push(`scenes[${index}].character needs numeric x, y and scale.`);
        }
        if (!["front", "left", "right"].includes(String(scene.character.facing))) {
          errors.push(`scenes[${index}].character.facing is invalid.`);
        }
        if (
          scene.character.expression !== undefined &&
          !includes(CHARACTER_EXPRESSIONS, scene.character.expression)
        ) {
          errors.push(`scenes[${index}].character.expression is invalid.`);
        }
      }

      if (!isRecord(scene.camera)) {
        errors.push(`scenes[${index}].camera is required.`);
      } else {
        if (!includes(CAMERA_MOTIONS, scene.camera.motion)) {
          errors.push(`scenes[${index}].camera.motion is invalid.`);
        }
        if (!isFiniteNumber(scene.camera.intensity)) {
          errors.push(`scenes[${index}].camera.intensity must be a number.`);
        }
      }

      const sceneDuration = isFiniteNumber(scene.durationSeconds) ? scene.durationSeconds : 0;
      if (!Array.isArray(scene.headlines) || scene.headlines.length === 0) {
        errors.push(`scenes[${index}].headlines must contain at least one headline.`);
      } else {
        scene.headlines.forEach((headline, headlineIndex) => {
          if (!isRecord(headline)) {
            errors.push(`scenes[${index}].headlines[${headlineIndex}] must be an object.`);
            return;
          }
          if (!isNonEmptyString(headline.text)) {
            errors.push(`scenes[${index}].headlines[${headlineIndex}].text is required.`);
          }
          if (!includes(TEXT_PRESETS, headline.preset)) {
            errors.push(`scenes[${index}].headlines[${headlineIndex}].preset is invalid.`);
          }
          if (!isFiniteNumber(headline.startSeconds) || headline.startSeconds < 0) {
            errors.push(`scenes[${index}].headlines[${headlineIndex}].startSeconds must be >= 0.`);
          } else if (headline.startSeconds > sceneDuration) {
            errors.push(`scenes[${index}].headlines[${headlineIndex}] starts after its scene.`);
          }
          if (headline.endSeconds !== undefined) {
            if (!isFiniteNumber(headline.endSeconds) || headline.endSeconds <= Number(headline.startSeconds)) {
              errors.push(`scenes[${index}].headlines[${headlineIndex}].endSeconds is invalid.`);
            }
          }
          if (headline.accentWords !== undefined && !Array.isArray(headline.accentWords)) {
            errors.push(`scenes[${index}].headlines[${headlineIndex}].accentWords must be an array.`);
          }
          if (
            headline.placement !== undefined &&
            !["top", "middle", "lower"].includes(String(headline.placement))
          ) {
            errors.push(`scenes[${index}].headlines[${headlineIndex}].placement is invalid.`);
          }
        });
      }

      if (scene.visual !== undefined && !isRecord(scene.visual)) {
        errors.push(`scenes[${index}].visual must be an object when present.`);
      }
    });

    if (isFiniteNumber(input.durationSeconds) && Math.abs(previousEnd - input.durationSeconds) > 0.05) {
      errors.push(
        `Scenes cover ${previousEnd.toFixed(2)}s but durationSeconds is ${input.durationSeconds}s.`,
      );
    }
  }

  if (!isRecord(input.brand)) {
    errors.push("brand is required.");
  } else {
    if (typeof input.brand.enabled !== "boolean") errors.push("brand.enabled must be boolean.");
    if (typeof input.brand.signatureEnabled !== "boolean") {
      errors.push("brand.signatureEnabled must be boolean.");
    }
    if (typeof input.brand.avatarEnabled !== "boolean") {
      errors.push("brand.avatarEnabled must be boolean.");
    }
    if (!["monogram", "avatar", "hybrid", "social"].includes(String(input.brand.treatment))) {
      errors.push("brand.treatment is invalid.");
    }
    if (!isFiniteNumber(input.brand.revealDurationSeconds) || input.brand.revealDurationSeconds <= 0) {
      errors.push("brand.revealDurationSeconds must be positive.");
    }
    if (!isFiniteNumber(input.brand.startSeconds) || input.brand.startSeconds < 0) {
      errors.push("brand.startSeconds must be >= 0.");
    }
    if (
      isFiniteNumber(input.brand.startSeconds) &&
      isFiniteNumber(input.brand.revealDurationSeconds) &&
      isFiniteNumber(input.durationSeconds) &&
      input.brand.startSeconds + input.brand.revealDurationSeconds > input.durationSeconds + 0.02
    ) {
      errors.push("brand reveal extends past the end of the composition.");
    }
  }

  if (!Array.isArray(input.assets)) {
    errors.push("assets manifest must be an array.");
  } else {
    input.assets.forEach((asset, index) => {
      if (!isRecord(asset)) {
        errors.push(`assets[${index}] must be an object.`);
        return;
      }
      checkLocalPath(asset.path, `assets[${index}].path`, errors);
      if (!isNonEmptyString(asset.license)) errors.push(`assets[${index}].license is required.`);
      if (!isNonEmptyString(asset.sourceUrl)) errors.push(`assets[${index}].sourceUrl is required.`);
    });
  }

  if (isRecord(input.narration) && isNonEmptyString(input.narration.voiceAudioPath)) {
    if (!isFiniteNumber(input.narration.audioDurationSeconds)) {
      errors.push("narration.audioDurationSeconds is needed to align sound.");
    } else if (
      isFiniteNumber(input.durationSeconds) &&
      input.narration.audioDurationSeconds > input.durationSeconds
    ) {
      errors.push("Narration is longer than the composition duration.");
    }
  }

  if (isRecord(input.brand) && input.brand.enabled === true) {
    if (input.brand.avatarEnabled === true && BRAND.avatarPath.length === 0) {
      errors.push("Avatar is enabled but no brand avatar path is configured.");
    }
  }

  return errors;
};

export const parseEpisode = (input: unknown): Episode => {
  const errors = collectEpisodeErrors(input);
  if (errors.length > 0) {
    throw new Error(`Episode configuration is invalid:\n- ${errors.join("\n- ")}`);
  }
  return input as Episode;
};
