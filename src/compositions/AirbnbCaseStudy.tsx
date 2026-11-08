import type { CSSProperties } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import cues from "../../content/airbnb-cues.json";
import { ACTS, FILM, FONT_STACK, frameAt, useStage } from "../config/airbnb";
import { MUSIC_POINTS, SFX } from "../config/airbnb-audio";
import { AirbnbScore } from "../components/audio/AirbnbScore";
import { AirbnbCaptions } from "../components/typography/AirbnbCaptions";
import { FilmGrain } from "../components/airbnb/primitives";
import { SceneBreakthrough } from "../components/airbnb/scenes/SceneBreakthrough";
import { SceneCereal } from "../components/airbnb/scenes/SceneCereal";
import { SceneFunding } from "../components/airbnb/scenes/SceneFunding";
import { SceneHook } from "../components/airbnb/scenes/SceneHook";
import { SceneIdea } from "../components/airbnb/scenes/SceneIdea";
import { SceneLesson } from "../components/airbnb/scenes/SceneLesson";
import { SceneStruggle } from "../components/airbnb/scenes/SceneStruggle";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { getEpisodeFontVars } from "../utils/fontVars";

const SCENES = {
  hook: SceneHook,
  idea: SceneIdea,
  struggle: SceneStruggle,
  cereal: SceneCereal,
  funding: SceneFunding,
  breakthrough: SceneBreakthrough,
  lesson: SceneLesson,
} as const;

const ENTER_FRAMES: Record<string, number> = {
  hook: 0,
  idea: 4,
  struggle: 6,
  cereal: 2,
  funding: 4,
  breakthrough: 4,
  lesson: 6,
};

const EXIT_FRAMES: Record<string, number> = {
  hook: 0,
  idea: 6,
  struggle: 3,
  cereal: 4,
  funding: 3,
  breakthrough: 6,
  lesson: 0,
};

/** Fades an act in and out at its own edges, without a global cross-fade cost. */
const ActGate: React.FC<{
  enterFrames: number;
  exitFrames: number;
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ enterFrames, exitFrames, durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const enter = enterFrames > 0 ? Math.min(1, frame / enterFrames) : 1;
  const exit =
    exitFrames > 0
      ? Math.min(1, Math.max(0, (durationInFrames - frame) / exitFrames))
      : 1;
  return <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>{children}</AbsoluteFill>;
};

const frameStyle: CSSProperties = { backgroundColor: "#171717" };

/**
 * AIRBNB — THE STARTUP THAT SOLD CEREAL
 *
 * 80.0s · 30fps · 2,400 frames · 1080x1920 (portrait) with a 16:9 adaptation.
 * Preview only: this composition is meant to be reviewed in Remotion Studio.
 */
export const AirbnbCaseStudy: React.FC = () => {
  const ready = useLocalFonts();
  const { fps } = useVideoConfig();
  useStage();

  const voiceWindows = (cues.cues as { start: number; end: number }[]).map((cue) => ({
    start: cue.start,
    end: cue.end,
  }));

  if (!ready) {
    return <AbsoluteFill style={{ backgroundColor: "#171717" }} />;
  }

  return (
    <AbsoluteFill style={{ ...frameStyle, ...getEpisodeFontVars("poppins"), fontFamily: FONT_STACK }}>
      {ACTS.map((act) => {
        const Scene = SCENES[act.id];
        const from = frameAt(act.start, fps);
        const duration = Math.max(1, frameAt(act.end, fps) - from);
        return (
          <Sequence key={act.id} from={from} durationInFrames={duration} name={`${act.label} · ${act.start}-${act.end}s`}>
            <ActGate
              enterFrames={ENTER_FRAMES[act.id]}
              exitFrames={EXIT_FRAMES[act.id]}
              durationInFrames={duration}
            >
              <Scene />
            </ActGate>
          </Sequence>
        );
      })}

      <AirbnbCaptions />
      <AirbnbScore
        voicePath="audio/episodes/airbnb/voice.mp3"
        musicPath="audio/episodes/airbnb/music/airbnb-bed-80s.mp3"
        musicPoints={MUSIC_POINTS}
        sfx={SFX}
        voiceWindows={voiceWindows}
      />

      <FilmGrain opacity={0.05} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 150px 0px rgba(0,0,0,0.26)",
        }}
      />
    </AbsoluteFill>
  );
};

export const AIRBNB_DURATION = FILM.durationInFrames;
