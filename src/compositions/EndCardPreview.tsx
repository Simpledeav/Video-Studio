import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { useLocalFonts } from "../hooks/useLocalFonts";
import {
  DEFAULT_END_CARD_TEMPLATE,
  END_CARD_TEMPLATE_IDS,
  type EndCardTemplateId,
} from "../config/brand";

/**
 * Studio previews for the five closing screens.
 *
 * Pick a template, watch the five-second reveal at 1080×1920, then set the
 * winner as `DEFAULT_END_CARD_TEMPLATE` in `src/config/brand.ts`. The wide
 * preview has a dropdown so the same layout can be judged at 1920×1080.
 */

const Preview: React.FC<{ template: EndCardTemplateId }> = ({ template }) => {
  useLocalFonts();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <SimpledeavSignOff startSeconds={0.2} template={template} />
    </AbsoluteFill>
  );
};

export const EndCardAurora: React.FC = () => <Preview template="aurora" />;
export const EndCardAtlas: React.FC = () => <Preview template="atlas" />;
export const EndCardAxis: React.FC = () => <Preview template="axis" />;
export const EndCardEditorial: React.FC = () => (
  <Preview template="editorial" />
);
export const EndCardOrbit: React.FC = () => <Preview template="orbit" />;

export const endCardWidePreviewSchema = z.object({
  template: z.enum(END_CARD_TEMPLATE_IDS),
});

export type EndCardWidePreviewProps = z.infer<
  typeof endCardWidePreviewSchema
>;

/**
 * 16:9 version of the picker. Change `template` in the Studio props panel to
 * compare the same five layouts on the wide canvas.
 */
export const EndCardWidePreview: React.FC<EndCardWidePreviewProps> = ({
  template = DEFAULT_END_CARD_TEMPLATE,
}) => {
  useLocalFonts();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <SimpledeavSignOff startSeconds={0.2} template={template} />
    </AbsoluteFill>
  );
};
