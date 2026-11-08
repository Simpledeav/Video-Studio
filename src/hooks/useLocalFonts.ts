import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export const FONT_FILES = [
  { family: "Manrope", weight: "400", style: "normal", file: "fonts/Manrope-Regular.ttf" },
  { family: "Manrope", weight: "500", style: "normal", file: "fonts/Manrope-Medium.ttf" },
  { family: "Manrope", weight: "600", style: "normal", file: "fonts/Manrope-SemiBold.ttf" },
  { family: "Instrument Serif", weight: "400", style: "normal", file: "fonts/InstrumentSerif-Regular.ttf" },
  { family: "Poppins", weight: "400", style: "normal", file: "fonts/Poppins-Regular.ttf" },
  { family: "Poppins", weight: "500", style: "normal", file: "fonts/Poppins-Medium.ttf" },
  { family: "Poppins", weight: "600", style: "normal", file: "fonts/Poppins-SemiBold.ttf" },
  { family: "Poppins", weight: "700", style: "normal", file: "fonts/Poppins-Bold.ttf" },
  { family: "Poppins", weight: "800", style: "normal", file: "fonts/Poppins-ExtraBold.ttf" },
  { family: "Poppins", weight: "400", style: "italic", file: "fonts/Poppins-Italic.ttf" },
] as const;

export const useLocalFonts = (): boolean => {
  const [handle] = useState(() => delayRender("Loading local Simpledeav fonts"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const faces = FONT_FILES.map((font) => {
          const face = new FontFace(font.family, `url(${staticFile(font.file)})`, {
            weight: font.weight,
            style: font.style,
          });
          document.fonts.add(face);
          return face;
        });
        await Promise.all(faces.map((face) => face.load()));
      } catch {
        // Fall back to the declared system stacks if a local font cannot load.
      }
      if (active) {
        setReady(true);
        continueRender(handle);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [handle]);

  return ready;
};
