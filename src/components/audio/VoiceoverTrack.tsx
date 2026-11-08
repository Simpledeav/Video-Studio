import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import type { VoiceoverMetadata } from "../../config/voiceProfile";
import { normalizePublicAssetPath } from "../../utils/assetValidation";

const localFile = (path: string) =>
  staticFile(normalizePublicAssetPath(path).replace(/^\//, ""));

type VoiceoverTrackProps = {
  metadata: VoiceoverMetadata;
  /**
   * Play the individually cached scene masters instead of the assembled full
   * track. Use this when a composition wants to align visuals to each file
   * rather than one continuous read.
   */
  perScene?: boolean;
  volume?: number;
  hidden?: boolean;
};

/**
 * Reusable narration layer for cloned-voice episodes.
 *
 * Music and SFX are intentionally not rendered here. They stay on their own
 * layers through `AudioTimeline` or a composition-specific score.
 */
export const VoiceoverTrack: React.FC<VoiceoverTrackProps> = ({
  metadata,
  perScene = false,
  volume = 0.92,
  hidden = false,
}) => {
  const { fps } = useVideoConfig();

  if (!perScene) {
    return <Audio src={localFile(metadata.files.fullWav)} volume={volume} hidden={hidden} />;
  }

  return (
    <>
      {metadata.scenes.map((scene) => {
        const from = Math.max(0, Math.round(scene.startSeconds * fps));
        const durationInFrames = Math.max(1, Math.round(scene.durationSeconds * fps));
        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={durationInFrames}
            layout="none"
            name={`voiceover-${scene.id}`}
          >
            <Audio src={localFile(scene.audioPath)} volume={volume} hidden={hidden} />
          </Sequence>
        );
      })}
    </>
  );
};
