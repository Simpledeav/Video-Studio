import type { CharacterConfig, Scene, SceneVisualConfig } from "../../config/episode.schema";
import type { Palette } from "../../config/theme";
import { CityEnvironment } from "./environments/CityEnvironment";
import {
  AgentGrid,
  CatchEnvironment,
  ChartPanel,
  ThresholdPanel,
} from "./environments/DataEnvironments";
import { OfficeEnvironment } from "./environments/OfficeEnvironment";
import { ConsoleEnvironment } from "./environments/ConsoleEnvironment";

type SceneVisualsProps = {
  scene: Scene;
  character: CharacterConfig;
  visual?: SceneVisualConfig;
  palette: Palette;
  frame: number;
  fps: number;
};

export const SceneVisuals: React.FC<SceneVisualsProps> = ({
  scene,
  character,
  visual,
  palette,
  frame,
  fps,
}) => {
  switch (scene.layout) {
    case "city":
      return <CityEnvironment palette={palette} frame={frame} variant="night" />;
    case "closing":
      return <CityEnvironment palette={palette} frame={frame} variant="dawn" />;
    case "office":
      return (
        <OfficeEnvironment
          palette={palette}
          frame={frame}
          fps={fps}
          character={character}
          visual={visual}
        />
      );
    case "console":
      return (
        <ConsoleEnvironment
          palette={palette}
          frame={frame}
          fps={fps}
          character={character}
          visual={visual}
        />
      );
    case "agentGrid":
      return <AgentGrid palette={palette} frame={frame} fps={fps} visual={visual} />;
    case "chart":
      return <ChartPanel palette={palette} frame={frame} fps={fps} visual={visual} />;
    case "threshold":
      return <ThresholdPanel palette={palette} frame={frame} fps={fps} visual={visual} />;
    case "catch":
      return <CatchEnvironment palette={palette} frame={frame} fps={fps} visual={visual} />;
    default:
      return null;
  }
};
