/**
 * Color Dictionary and Helper Utilities
 * Maps color names (in French and English) to hex color codes for UI representation.
 */

export const COLOR_DICTIONARY: Record<string, string> = {
  // Purples / Lilacs
  lavande: "#c4b5fd",
  lavender: "#c4b5fd",
  violet: "#a855f7",
  purple: "#c4b5fd",
  lilas: "#e9d5ff",
  lilac: "#e9d5ff",
  mauve: "#d8b4fe",

  // Pinks
  rose: "#fbcfe8",
  pink: "#fbcfe8",
  fuchsia: "#f472b6",
  magenta: "#ec4899",
  "rose pale": "#fce7f3",
  "rose bonbon": "#f472b6",

  // Beiges / Creams / Neutrals
  beige: "#f5ebe0",
  creme: "#f5ebe0",
  crème: "#f5ebe0",
  cream: "#f5ebe0",
  ecru: "#fef3c7",
  écru: "#fef3c7",
  ivoire: "#fffff0",
  ivory: "#fffff0",
  nude: "#eddcd2",
  sable: "#e6ccb2",
  sand: "#e6ccb2",
  taupe: "#b7a896",

  // Greens
  vert: "#a7c4bc",
  green: "#a7c4bc",
  sauge: "#a7c4bc",
  sage: "#a7c4bc",
  menthe: "#a7f3d0",
  mint: "#a7f3d0",
  olive: "#84cc16",
  kaki: "#a3a375",
  khaki: "#a3a375",
  emeraude: "#10b981",
  emerald: "#10b981",
  "vert d'eau": "#bbf7d0",

  // Blues
  bleu: "#bfdbfe",
  blue: "#bfdbfe",
  ciel: "#bae6fd",
  "bleu ciel": "#bae6fd",
  sky: "#bae6fd",
  marine: "#1e3a8a",
  navy: "#1e3a8a",
  turquoise: "#5eead4",
  cyan: "#67e8f9",
  indigo: "#6366f1",
  denim: "#3b82f6",

  // Browns / Earth tones
  marron: "#b45309",
  brown: "#b45309",
  chocolat: "#78350f",
  chocolate: "#78350f",
  caramel: "#c2410c",
  camel: "#c19a6b",
  terracotta: "#e07a5f",
  brique: "#c85a32",
  cuir: "#8d5b4c",

  // Yellows & Oranges
  jaune: "#fde047",
  yellow: "#fde047",
  moutarde: "#eab308",
  mustard: "#eab308",
  orange: "#fb923c",
  corail: "#fb7185",
  coral: "#fb7185",
  peche: "#fed7aa",
  pêche: "#fed7aa",
  peach: "#fed7aa",
  abricot: "#fed7aa",
  apricot: "#fed7aa",
  dore: "#facc15",
  doré: "#facc15",
  gold: "#facc15",

  // Reds
  rouge: "#f87171",
  red: "#f87171",
  bordeaux: "#881337",
  burgundy: "#881337",
  framboise: "#db2777",
  raspberry: "#db2777",
  rubis: "#e11d48",

  // Grays & Monochromes
  noir: "#27272a",
  black: "#27272a",
  blanc: "#f4f4f5",
  white: "#f4f4f5",
  gris: "#9ca3af",
  grey: "#9ca3af",
  gray: "#9ca3af",
  anthracite: "#374151",
  argent: "#e5e7eb",
  silver: "#e5e7eb",
};

export const DEFAULT_COLOR_HEX = "#c4b5fd";

/**
 * Returns a corresponding hex color code for a given color name string.
 * Supports partial matching for compound names (e.g. "Bleu ciel", "Vert d'eau").
 */
export function getColorHex(colorName?: string): string {
  if (!colorName || typeof colorName !== "string") {
    return DEFAULT_COLOR_HEX;
  }

  const normalized = colorName.trim().toLowerCase();

  // Exact match first
  if (COLOR_DICTIONARY[normalized]) {
    return COLOR_DICTIONARY[normalized];
  }

  // Partial match check across dictionary keys
  for (const [key, hex] of Object.entries(COLOR_DICTIONARY)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return hex;
    }
  }

  // Fallback
  return DEFAULT_COLOR_HEX;
}
