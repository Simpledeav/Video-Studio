import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Episode, SoundEffectConfig } from "../../config/episode.schema";
import { AUDIO_DEFAULTS } from "../../config/audio";
import { DUCK_DEPTH } from "../../config/audioPreset";
import { normalizePublicAssetPath } from "../../utils/assetValidation";

const localFile = (path: string) =>
  staticFile(normalizePublicAssetPath(path).replace(/^\//, ""));

const SfxClip: React.FC<{ effect: SoundEffectConfig; fps: number }> = ({ effect, fps }) => {
  const frame = useCurrentFrame();
  const durationFrames = Math.max(1, Math.round(effect.durationSeconds * fps));
  const fadeIn = Math.max(1, Math.round(effect.fadeInSeconds * fps));
  const fadeOut = Math.max(1, Math.round(effect.fadeOutSeconds * fps));
  const fadeInGain = interpolate(frame, [0, fadeIn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOutGain = interpolate(
    frame,
    [durationFrames - fadeOut, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <Audio
      src={localFile(effect.path)}
      volume={effect.volume * fadeInGain * fadeOutGain}
      trimAfter={durationFrames}
    />
  );
};

export const AudioTimeline: React.FC<{ episode: Episode }> = ({ episode }) => {
  const { fps } = useVideoConfig();
  const totalFrames = Math.round(episode.durationSeconds * fps);

  const duckCurve = useMemo(() => {
    const values = new Array<number>(totalFrames + 1).fill(0);
    const attack = Math.max(1, Math.round(AUDIO_DEFAULTS.duckAttackSeconds * fps));
    const release = Math.max(1, Math.round(AUDIO_DEFAULTS.duckReleaseSeconds * fps));
    const targets = new Array<number>(totalFrames + 1).fill(0);

    for (const cue of episode.narration.subtitles) {
      const start = Math.max(0, Math.round(cue.start * fps) - attack);
      const end = Math.min(totalFrames, Math.round(cue.end * fps));
      for (let index = start; index <= end; index += 1) {
        targets[index] = 1;
      }
    }

    let current = 0;
    for (let index = 0; index <= totalFrames; index += 1) {
      const target = targets[index];
      const rate = target > current ? 1 / attack : 1 / release;
      current += (target - current) * rate;
      values[index] = current;
    }
    return values;
  }, [episode.narration.subtitles, fps, totalFrames]);

  const musicFadeIn = Math.max(0, episode.music.fadeInSeconds * fps);
  const musicFadeOut = Math.max(0, episode.music.fadeOutSeconds * fps);

  const baseMusicVolume = (timeSeconds: number) => {
    const points = episode.music.volumeAutomation;
    if (!points || points.length === 0) return episode.music.volume;
    if (timeSeconds <= points[0].timeSeconds) return points[0].volume;
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const next = points[index];
      if (timeSeconds <= next.timeSeconds) {
        const span = Math.max(0.001, next.timeSeconds - previous.timeSeconds);
        const progress = Math.min(1, Math.max(0, (timeSeconds - previous.timeSeconds) / span));
        return previous.volume + (next.volume - previous.volume) * progress;
      }
    }
    return points[points.length - 1].volume;
  };

  const musicVolume = (currentFrame: number) => {
    const base = baseMusicVolume(currentFrame / fps);
    const ducked = base * (1 - DUCK_DEPTH);
    const duckRatio = base > 0 ? ducked / base : 1;
    const fadeIn = interpolate(currentFrame, [0, musicFadeIn], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(
      currentFrame,
      [totalFrames - musicFadeOut, totalFrames],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const duck = episode.music.duckUnderNarration
      ? 1 - (1 - duckRatio) * (duckCurve[Math.round(currentFrame)] ?? 0)
      : 1;
    return base * fadeIn * fadeOut * duck * AUDIO_DEFAULTS.overallMaster;
  };

  return (
    <>
      <Audio
        src={localFile(episode.narration.voiceAudioPath)}
        volume={AUDIO_DEFAULTS.narrationVolume}
      />
      <Audio src={localFile(episode.music.path)} volume={musicVolume} hidden />
      {episode.soundEffects.map((effect) => {
        const from = Math.max(0, Math.round(effect.startSeconds * fps));
        const duration = Math.max(1, Math.round(effect.durationSeconds * fps));
        return (
          <Sequence
            key={effect.id}
            from={from}
            durationInFrames={duration}
            layout="none"
          >
            <SfxClip effect={effect} fps={fps} />
          </Sequence>
        );
      })}
    </>
  );
};
