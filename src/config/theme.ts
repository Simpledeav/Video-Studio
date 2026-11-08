/**
 * Curated cinematic palettes.
 *
 * Palettes are semantic, not literal: components ask for "accent" or
 * "captionText" so a new palette can be added here without touching every
 * scene. The episode JSON selects one palette ID for the whole film.
 */

export const PALETTE_IDS = [
  "MIDNIGHT_CYAN",
  "GRAPHITE_LIME",
  "BURGUNDY_GOLD",
  "IVORY_INK",
  "ELECTRIC_VIOLET",
  "WARM_EDITORIAL",
  "CORAL_DOCUMENTARY",
] as const;

export type PaletteId = (typeof PALETTE_IDS)[number];

export type Palette = {
  id: PaletteId;
  name: string;
  mood: string;
  /** Deepest background wash. */
  background: string;
  /** Vertical/secondary background wash. */
  backgroundSecondary: string;
  /** Main type color. */
  textPrimary: string;
  /** Muted supporting type. */
  textSecondary: string;
  /** Primary UI / character accent. */
  accent: string;
  /** Warm or contrasting narrative accent. */
  accentSecondary: string;
  /** Positive data state. */
  positive: string;
  /** Risk / warning data state. */
  warning: string;
  /** Card and panel surfaces. */
  surface: string;
  /** Hairlines and panel edges. */
  border: string;
  /** Character line color. */
  characterLine: string;
  /** Optional character fill. */
  characterFill: string;
  /** Subtitle fill. */
  captionText: string;
  /** Subtitle shadow. */
  captionShadow: string;
  /** Optional subtitle scrim. */
  captionBackground: string;
  /** Light bloom used by scenes and signature. */
  glow: string;
  /** Whether to use a light-on-dark text treatment. */
  isDark: boolean;
};

export const THEMES: Record<PaletteId, Palette> = {
  MIDNIGHT_CYAN: {
    id: "MIDNIGHT_CYAN",
    name: "Midnight Cyan",
    mood: "technical, nocturnal, precise",
    background: "#0B1020",
    backgroundSecondary: "#0E1830",
    textPrimary: "#F5F7FA",
    textSecondary: "#99A7BD",
    accent: "#54D9F5",
    accentSecondary: "#FFB454",
    positive: "#62E6B0",
    warning: "#FF7C78",
    surface: "#172033",
    border: "#2B3953",
    characterLine: "#EDF8FF",
    characterFill: "#0B1020",
    captionText: "#FFFFFF",
    captionShadow: "0 2px 14px rgba(0,0,0,0.7)",
    captionBackground: "rgba(4, 8, 18, 0.38)",
    glow: "rgba(84, 217, 245, 0.34)",
    isDark: true,
  },
  GRAPHITE_LIME: {
    id: "GRAPHITE_LIME",
    name: "Graphite Lime",
    mood: "focused, modern, quietly optimistic",
    background: "#111411",
    backgroundSecondary: "#171D18",
    textPrimary: "#F4F5EF",
    textSecondary: "#9CA698",
    accent: "#C4F36B",
    accentSecondary: "#8CBF9F",
    positive: "#C4F36B",
    warning: "#F29B7B",
    surface: "#202820",
    border: "#354036",
    characterLine: "#F6F9EC",
    characterFill: "#111411",
    captionText: "#FFFFFF",
    captionShadow: "0 2px 14px rgba(0,0,0,0.72)",
    captionBackground: "rgba(9, 12, 9, 0.42)",
    glow: "rgba(196, 243, 107, 0.27)",
    isDark: true,
  },
  BURGUNDY_GOLD: {
    id: "BURGUNDY_GOLD",
    name: "Burgundy Gold",
    mood: "intimate, consequential, human",
    background: "#1A1017",
    backgroundSecondary: "#24141C",
    textPrimary: "#FFF6EC",
    textSecondary: "#C2A9A6",
    accent: "#F1B95B",
    accentSecondary: "#D66D83",
    positive: "#F1B95B",
    warning: "#E98880",
    surface: "#30202A",
    border: "#4A3340",
    characterLine: "#FFF7EA",
    characterFill: "#1A1017",
    captionText: "#FFFFFF",
    captionShadow: "0 2px 14px rgba(0,0,0,0.72)",
    captionBackground: "rgba(20, 9, 14, 0.42)",
    glow: "rgba(241, 185, 91, 0.31)",
    isDark: true,
  },
  IVORY_INK: {
    id: "IVORY_INK",
    name: "Ivory Ink",
    mood: "editorial, candid, daylight clarity",
    background: "#F4F0E8",
    backgroundSecondary: "#EAE2D5",
    textPrimary: "#181818",
    textSecondary: "#625E57",
    accent: "#2E725F",
    accentSecondary: "#D77746",
    positive: "#2E725F",
    warning: "#B34A3D",
    surface: "#E6DFD2",
    border: "#C9BFAE",
    characterLine: "#181818",
    characterFill: "#F4F0E8",
    captionText: "#181818",
    captionShadow: "0 2px 12px rgba(255,255,255,0.9)",
    captionBackground: "rgba(244, 240, 232, 0.72)",
    glow: "rgba(46, 114, 95, 0.2)",
    isDark: false,
  },
  WARM_EDITORIAL: {
    id: "WARM_EDITORIAL",
    name: "Warm Editorial",
    mood: "cinematic, tactile, premium documentary",
    background: "#171717",
    backgroundSecondary: "#1E1B18",
    textPrimary: "#F4F1E9",
    textSecondary: "#A7A7A7",
    accent: "#D62828",
    accentSecondary: "#E8B949",
    positive: "#E8B949",
    warning: "#D62828",
    surface: "#211E1B",
    border: "#3A332D",
    characterLine: "#F4F1E9",
    characterFill: "#171717",
    captionText: "#FFFFFF",
    captionShadow: "0 2px 14px rgba(0,0,0,0.78)",
    captionBackground: "rgba(12, 10, 9, 0.5)",
    glow: "rgba(214, 40, 40, 0.28)",
    isDark: true,
  },
  ELECTRIC_VIOLET: {
    id: "ELECTRIC_VIOLET",
    name: "Electric Violet",
    mood: "future-facing, inventive, electric",
    background: "#100E20",
    backgroundSecondary: "#17132D",
    textPrimary: "#F8F6FF",
    textSecondary: "#ABA4C9",
    accent: "#A78BFA",
    accentSecondary: "#5EEAD4",
    positive: "#5EEAD4",
    warning: "#FB7185",
    surface: "#25213C",
    border: "#3B3458",
    characterLine: "#F4F0FF",
    characterFill: "#100E20",
    captionText: "#FFFFFF",
    captionShadow: "0 2px 14px rgba(0,0,0,0.72)",
    captionBackground: "rgba(10, 8, 23, 0.44)",
    glow: "rgba(167, 139, 250, 0.34)",
    isDark: true,
  },
  CORAL_DOCUMENTARY: {
    id: "CORAL_DOCUMENTARY",
    name: "Coral Documentary",
    mood: "premium editorial documentary: charcoal, warm cream, selective coral",
    background: "#171717",
    backgroundSecondary: "#101010",
    textPrimary: "#F3EEE5",
    textSecondary: "#A6A6A6",
    accent: "#FF5A5F",
    accentSecondary: "#E6A49C",
    positive: "#F3EEE5",
    warning: "#FF5A5F",
    surface: "#1D1C1A",
    border: "#3A3632",
    characterLine: "#F3EEE5",
    characterFill: "#171717",
    captionText: "#F6F2EA",
    captionShadow: "0 2px 16px rgba(0,0,0,0.85)",
    captionBackground: "rgba(10, 9, 8, 0.34)",
    glow: "rgba(255, 90, 95, 0.26)",
    isDark: true,
  },
};

export const isPaletteId = (value: string): value is PaletteId =>
  (PALETTE_IDS as readonly string[]).includes(value);

export const getPalette = (id: PaletteId): Palette => THEMES[id];

export const paletteHexWithAlpha = (hex: string, alpha: number): string => {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value) || normalized.length !== 6) {
    return `rgba(0,0,0,${alpha})`;
  }
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
