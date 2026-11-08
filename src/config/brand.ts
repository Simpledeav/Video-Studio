/**
 * Single source of truth for Simpledeav identity.
 * The signature is a closing story beat, never a persistent watermark.
 */

/**
 * The five closing-screen templates.
 *
 * Every template shows exactly two things: the avatar image and the bold
 * SIMPLEDEAV wordmark. They differ in composition, scale, light and motion, so
 * a film can close with the same identity without every video ending on the
 * same frame.
 */
export const END_CARD_TEMPLATE_IDS = [
  "aurora",
  "atlas",
  "axis",
  "editorial",
  "orbit",
] as const;

export type EndCardTemplateId = (typeof END_CARD_TEMPLATE_IDS)[number];

export type EndCardTemplate = {
  id: EndCardTemplateId;
  name: string;
  /** Short line for the picker / docs. */
  description: string;
  /** Where it works best. */
  bestFor: string;
};

export const END_CARD_TEMPLATES: EndCardTemplate[] = [
  {
    id: "aurora",
    name: "Aurora",
    description:
      "A portrait held in a soft ring of light, a small precise wordmark and a single luminous horizon. Calm, cinematic, expensive.",
    bestFor: "The house default. Every channel, vertical and wide.",
  },
  {
    id: "atlas",
    name: "Atlas",
    description:
      "An architectural grid with the avatar as a small seal and a precise wordmark on a measured baseline.",
    bestFor: "Films that want a quiet, architectural close.",
  },
  {
    id: "axis",
    name: "Axis",
    description:
      "A horizontal lockup with a squared portrait, a hairline rule and a precise accent mark. Modern and confident.",
    bestFor: "Wide films, YouTube end screens and sponsor-facing cuts.",
  },
  {
    id: "editorial",
    name: "Editorial",
    description:
      "An asymmetric, left-aligned stack with generous negative space, a fine rule system and directional light.",
    bestFor: "Case studies, documentary closes and designed title cards.",
  },
  {
    id: "orbit",
    name: "Orbit",
    description:
      "A portrait inside a slowly turning orbital system, set against a quiet field of stars and wide-tracked type.",
    bestFor: "Premium documentary closes, series finales and launch films.",
  },
];

/** Change this one line to re-brand every future film's close. */
export const DEFAULT_END_CARD_TEMPLATE: EndCardTemplateId = "aurora";

export const BRAND = {
  name: "Simpledeav",
  handle: "@simpledeav",
  instagramUrl: "https://www.instagram.com/simpledaev/",
  githubUrl: "https://github.com/simpledeav",
  avatarPath: "/brand/simpledeav-avatar.png",
  avatarSourceUrl: "https://avatars.githubusercontent.com/u/88326987?s=460&v=4",
  /** Warm signature light used when a film does not supply its own palette. */
  accent: "#E8B267",
  monogram: {
    letterA: "s",
    letterB: "d",
    markSize: 92,
    strokeWidth: 5.4,
    wordmark: "SIMPLEDEAV",
    wordmarkTracking: 0.32,
  },
  defaults: {
    avatarEnabled: true,
    signatureEnabled: true,
    revealDurationSeconds: 3.8,
    treatment: "hybrid" as const,
    placement: "closing-integrated" as const,
    endCardTemplate: DEFAULT_END_CARD_TEMPLATE,
  },
} as const;

export type SignatureTreatment = "monogram" | "avatar" | "hybrid" | "social";
