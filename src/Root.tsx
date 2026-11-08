import { Composition } from "remotion";
import { z } from "zod";
import { DEFAULT_END_CARD_TEMPLATE, END_CARD_TEMPLATE_IDS } from "./config/brand";
import { JG } from "./config/juicero";
import { JuiceroFilm } from "./compositions/Juicero";
import { JuiceroCover } from "./compositions/JuiceroCover";

const endCardSchema = z.object({
  endCardTemplate: z.enum(END_CARD_TEMPLATE_IDS),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JuiceroFilm"
        component={JuiceroFilm}
        durationInFrames={JG.durationFrames}
        fps={JG.fps}
        width={JG.portrait.width}
        height={JG.portrait.height}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="JuiceroFilmWide"
        component={JuiceroFilm}
        durationInFrames={JG.durationFrames}
        fps={JG.fps}
        width={JG.wide.width}
        height={JG.wide.height}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="JuiceroCover"
        component={JuiceroCover}
        durationInFrames={1}
        fps={JG.fps}
        width={1080}
        height={1350}
      />
    </>
  );
};
