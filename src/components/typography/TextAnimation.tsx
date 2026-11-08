import { interpolate, spring } from "remotion";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { TextPreset } from "../../config/episode.schema";
import { SPRINGS } from "../../config/motion";
import { countHeadlineCharacters, isAccentWord, splitWords } from "../../utils/textLayout";

type AnimatedTextProps = {
  text: string;
  preset: TextPreset;
  frame: number;
  fps: number;
  startFrame?: number;
  accentWords?: string[];
  accentColor: string;
  style: CSSProperties;
  align?: "left" | "center";
  stagger?: number;
};

const accentFontStyle: CSSProperties = {
  fontFamily: 'var(--sd-accent-font, "Instrument Serif", "Times New Roman", serif)',
  fontStyle: 'var(--sd-accent-style, italic)' as CSSProperties["fontStyle"],
  fontWeight: 'var(--sd-accent-weight, 400)' as CSSProperties["fontWeight"],
  letterSpacing: "-0.015em",
};

const Word = ({
  children,
  style,
  accent,
}: {
  children: ReactNode;
  style?: CSSProperties;
  accent: boolean;
}) => (
  <span
    style={{
      display: "inline-block",
      ...(accent ? accentFontStyle : {}),
      ...style,
    }}
  >
    {children}
  </span>
);

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  preset,
  frame,
  fps,
  startFrame = 0,
  accentWords = [],
  accentColor,
  style,
  align = "left",
  stagger,
}) => {
  const localFrame = frame - startFrame;
  const words = splitWords(text);
  const wordStagger = stagger ?? (preset === "charReveal" ? 1.4 : 3);
  const base = {
    ...style,
    color: style.color,
    textAlign: align,
    maxWidth: style.maxWidth ?? 900,
  } as CSSProperties;
  const accentStyle: CSSProperties = { color: accentColor };

  if (localFrame < -1) return null;

  if (preset === "scaleSettle") {
    const progress = spring({
      frame: Math.max(0, localFrame),
      fps,
      config: SPRINGS.settle,
    });
    const scale = interpolate(progress, [0, 1], [1.085, 1]);
    const opacity = interpolate(progress, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
    return (
      <div
        style={{
          ...base,
          transform: `scale(${scale})`,
          transformOrigin: align === "center" ? "center center" : "left center",
          opacity,
        }}
      >
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <Word
              accent={isAccentWord(word, accentWords)}
              style={isAccentWord(word, accentWords) ? accentStyle : undefined}
            >
              {word}
            </Word>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </div>
    );
  }

  if (preset === "charReveal" && countHeadlineCharacters(text) <= 46) {
    let charIndex = 0;
    return (
      <div style={{ ...base, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start" }}>
        {words.map((word, wordIndex) => {
          const accent = isAccentWord(word, accentWords);
          return (
            <span
              key={`${word}-${wordIndex}`}
              style={{
                display: "inline-block",
                marginRight: "0.24em",
                ...(accent ? { ...accentFontStyle, color: accentColor } : {}),
              }}
            >
              {Array.from(word).map((character) => {
                const characterFrame = localFrame - charIndex * wordStagger;
                charIndex += 1;
                const progress = spring({
                  frame: Math.max(0, characterFrame),
                  fps,
                  config: SPRINGS.soft,
                });
                return (
                  <span
                    key={`${character}-${charIndex}`}
                    style={{
                      display: "inline-block",
                      opacity: interpolate(progress, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }),
                      transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
                    }}
                  >
                    {character}
                  </span>
                );
              })}
            </span>
          );
        })}
      </div>
    );
  }

  if (preset === "splitLine") {
    const lines = text.split(/\n+/).filter((line) => line.trim().length > 0);
    return (
      <div style={base}>
        {lines.map((line, lineIndex) => {
          const lineFrame = localFrame - lineIndex * 6;
          const progress = spring({
            frame: Math.max(0, lineFrame),
            fps,
            config: SPRINGS.settle,
          });
          return (
            <div
              key={`${line}-${lineIndex}`}
              style={{
                overflow: "hidden",
                paddingBottom: "0.12em",
                marginBottom: "-0.12em",
              }}
            >
              <div
                style={{
                  transform: `translateY(${interpolate(progress, [0, 1], [105, 0])}%)`,
                  opacity: interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
                }}
              >
                {line.split(" ").map((word, wordIndex) => {
                  const accent = isAccentWord(word, accentWords);
                  return (
                    <span key={`${word}-${wordIndex}`}>
                      <Word accent={accent} style={accent ? accentStyle : undefined}>
                        {word}
                      </Word>
                      {wordIndex < line.split(" ").length - 1 ? " " : null}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const lineGroups = text.split(/\n+/).filter((line) => line.trim().length > 0);
  const renderWord = (word: string, index: number, lineOffset = 0) => {
    const accent = isAccentWord(word, accentWords);
    const wordFrame = localFrame - (index + lineOffset) * wordStagger;
    const visible = Math.max(0, wordFrame);

    if (preset === "maskedUp" || preset === "finalReveal") {
      const progress = spring({
        frame: visible,
        fps,
        config: preset === "finalReveal" ? SPRINGS.soft : SPRINGS.settle,
      });
      const y = interpolate(progress, [0, 1], [preset === "finalReveal" ? 26 : 112, 0]);
      const opacity = interpolate(progress, [0, 0.38], [0, 1], { extrapolateRight: "clamp" });
      const blur = preset === "finalReveal" ? interpolate(progress, [0, 1], [8, 0]) : 0;
      return (
        <span key={`${word}-${index}`}>
          <span
            style={{
              display: "inline-block",
              overflow: preset === "maskedUp" ? "hidden" : "visible",
              verticalAlign: "top",
              paddingBottom: preset === "maskedUp" ? "0.14em" : undefined,
              marginBottom: preset === "maskedUp" ? "-0.14em" : undefined,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${y}${preset === "finalReveal" ? "px" : "%"})`,
                opacity,
                filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                ...(accent ? { ...accentFontStyle, color: accentColor } : {}),
              }}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      );
    }

    if (preset === "staggeredPhrase") {
      const progress = spring({
        frame: visible,
        fps,
        config: SPRINGS.soft,
      });
      const offset = interpolate(progress, [0, 1], [22, 0]);
      const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
      const scale = interpolate(progress, [0, 1], [0.96, 1]);
      return (
        <span
          key={`${word}-${index}`}
          style={{
            display: "inline-block",
            marginRight: "0.23em",
            opacity,
            transform: `translateY(${offset}px) scale(${scale})`,
            ...(accent ? { ...accentFontStyle, color: accentColor } : {}),
          }}
        >
          {word}
        </span>
      );
    }

    const progress = spring({
      frame: visible,
      fps,
      config: SPRINGS.settle,
    });
    const offset = interpolate(progress, [0, 1], [28, 0]);
    const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
    const emphasis =
      preset === "kineticEmphasis" && accent
        ? interpolate(progress, [0, 0.72, 1], [0.88, 1.07, 1])
        : 1;
    return (
      <span
        key={`${word}-${index}`}
        style={{
          display: "inline-block",
          marginRight: "0.24em",
          opacity,
          transform: `translateY(${offset}px) scale(${emphasis})`,
          transformOrigin: "left 80%",
          ...(accent ? { ...accentFontStyle, color: accentColor } : {}),
        }}
      >
        {word}
      </span>
    );
  };

  if (lineGroups.length > 1) {
    let offset = 0;
    return (
      <div style={base}>
        {lineGroups.map((line, lineIndex) => {
          const lineWords = splitWords(line);
          const currentOffset = offset;
          offset += lineWords.length;
          return (
            <div key={`${line}-${lineIndex}`} style={{ display: "block" }}>
              {lineWords.map((word, index) => renderWord(word, index, currentOffset))}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={base}>
      {words.map((word, index) => renderWord(word, index))}
    </div>
  );
};
