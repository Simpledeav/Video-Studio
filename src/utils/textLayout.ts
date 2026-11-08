/** Small, deterministic text helpers shared by headline presets. */

export const splitWords = (text: string): string[] =>
  text
    .trim()
    .split(/\s+/)
    .filter(Boolean);

export const splitCharacters = (text: string): string[] => Array.from(text);

export const isAccentWord = (word: string, accentWords: readonly string[] = []) => {
  const cleaned = word.replace(/[.,!?;:—–…"'“”‘’]/g, "").toLowerCase();
  return accentWords.some((accent) => {
    const normalized = accent.replace(/[.,!?;:—–…"'“”‘’]/g, "").toLowerCase();
    return (
      cleaned === normalized ||
      cleaned.includes(normalized) ||
      normalized.split(/\s+/).includes(cleaned)
    );
  });
};

export const splitAtLineBreaks = (text: string): string[] =>
  text.split(/\n+/).map((line) => line.trim()).filter(Boolean);

export const countHeadlineCharacters = (text: string) =>
  text.replace(/\s+/g, "").length;
