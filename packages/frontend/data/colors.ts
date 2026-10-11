/**
 * Color Dictionary and Helper Utilities
 * Maps color names (in French and English) to hex color codes for UI representation.
 */

export const COLOR_DICTIONARY: Record<string, string> = {
  // Purples / Lilacs
  lavande: "#c4b5fd",
  lavender: "#c4b5fd",
  violet: "#a855f7",
  purple: "#a855f7",
  lilas: "#e9d5ff",
  lilac: "#e9d5ff",
  mauve: "#d8b4fe",
  move: "#d8b4fe",

  // Pinks
  rose: "#F4B6C2",
  pink: "#F4B6C2",
  fuchsia: "#f472b6",
  magenta: "#ec4899",
  "rose pale": "#fce7f3",
  "rose bonbon": "#f472b6",
  "pink-white": "#F4B6C2",
  "rose-blanc": "#F4B6C2",

  // Beiges / Creams / Neutrals
  beige: "#E6D5B8",
  "beige sable": "#E6CCB2",
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
  vert: "#22c55e",
  green: "#22c55e",
  "vert sauge": "#355E3B",
  "sage green": "#355E3B",
  sauge: "#355E3B",
  sage: "#355E3B",
  menthe: "#a7f3d0",
  mint: "#a7f3d0",
  olive: "#84cc16",
  kaki: "#a3a375",
  khaki: "#a3a375",
  emeraude: "#10b981",
  emerald: "#10b981",
  "vert d'eau": "#bbf7d0",

  // Blues
  bleu: "#3b82f6",
  blue: "#3b82f6",
  "bleu roi": "#1d4ed8",
  "royal blue": "#1d4ed8",
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
  marron: "#8B4513",
  brown: "#8B4513",
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
  moutarde: "#E5C35A",
  mustard: "#E5C35A",
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
  biker: "#18181b",
  blanc: "#f4f4f5",
  white: "#f4f4f5",
  "white-purple": "#e9d5ff",
  "blanc-violet": "#e9d5ff",
  gris: "#9ca3af",
  grey: "#9ca3af",
  gray: "#9ca3af",
  anthracite: "#374151",
  argent: "#e5e7eb",
  silver: "#e5e7eb",
};

export const DEFAULT_COLOR_HEX = "#c4b5fd";

/**
 * Translations dictionary for colors in French and Arabic.
 */
export const COLOR_TRANSLATIONS: Record<string, { fr: string; ar: string }> = {
  // Specific user database values
  biker: { fr: "Biker", ar: "بايكر" },
  black: { fr: "Noir", ar: "أسود" },
  noir: { fr: "Noir", ar: "أسود" },
  blue: { fr: "Bleu", ar: "أزرق" },
  bleu: { fr: "Bleu", ar: "أزرق" },
  brown: { fr: "Marron", ar: "بني" },
  marron: { fr: "Marron", ar: "بني" },
  gray: { fr: "Gris", ar: "رمادي" },
  grey: { fr: "Gris", ar: "رمادي" },
  gris: { fr: "Gris", ar: "رمادي" },
  green: { fr: "Vert", ar: "أخضر" },
  vert: { fr: "Vert", ar: "أخضر" },
  pink: { fr: "Rose", ar: "وردي" },
  rose: { fr: "Rose", ar: "وردي" },
  "pink-white": { fr: "Rose-Blanc", ar: "وردي وأبيض" },
  "rose-blanc": { fr: "Rose-Blanc", ar: "وردي وأبيض" },
  purple: { fr: "Violet", ar: "بنفسجي" },
  violet: { fr: "Violet", ar: "بنفسجي" },
  white: { fr: "Blanc", ar: "أبيض" },
  blanc: { fr: "Blanc", ar: "أبيض" },
  "white-purple": { fr: "Blanc-Violet", ar: "أبيض وبنفسجي" },
  "blanc-violet": { fr: "Blanc-Violet", ar: "أبيض وبنفسجي" },
  beige: { fr: "Beige", ar: "بيج" },
  "Vert": { fr: "Vert", ar: "أخضر" },
  "sage green": { fr: "Vert Sauge", ar: "أخضر صاجي" },
  "beige sable": { fr: "Beige Sable", ar: "بيج رملي" },
  "bleu roi": { fr: "Bleu Roi", ar: "أزرق ملكي" },
  "royal blue": { fr: "Bleu Roi", ar: "أزرق ملكي" },
  move: { fr: "Mauve", ar: "موف" },
  mauve: { fr: "Mauve", ar: "موف" },
  moutarde: { fr: "Moutarde", ar: "خردلي" },
  mustard: { fr: "Moutarde", ar: "خردلي" },

  // Additional common shades
  lavande: { fr: "Lavande", ar: "لافندر" },
  lavender: { fr: "Lavande", ar: "لافندر" },
  lilas: { fr: "Lilas", ar: "ليلكي" },
  lilac: { fr: "Lilas", ar: "ليلكي" },
  fuchsia: { fr: "Fuchsia", ar: "فوشيا" },
  magenta: { fr: "Magenta", ar: "ماجنتا" },
  "rose pale": { fr: "Rose Pâle", ar: "وردي فاتح" },
  "rose bonbon": { fr: "Rose Bonbon", ar: "وردي سكري" },
  creme: { fr: "Crème", ar: "كريمي" },
  crème: { fr: "Crème", ar: "كريمي" },
  cream: { fr: "Crème", ar: "كريمي" },
  ecru: { fr: "Écru", ar: "أوف وايت" },
  écru: { fr: "Écru", ar: "أوف وايت" },
  ivoire: { fr: "Ivoire", ar: "عاجي" },
  ivory: { fr: "Ivoire", ar: "عاجي" },
  nude: { fr: "Nude", ar: "نيود" },
  sable: { fr: "Sable", ar: "رملي" },
  sand: { fr: "Sable", ar: "رملي" },
  taupe: { fr: "Taupe", ar: "طوبي" },
  sauge: { fr: "Sauge", ar: "صاجي" },
  sage: { fr: "Sauge", ar: "صاجي" },
  menthe: { fr: "Menthe", ar: "نعناعي" },
  mint: { fr: "Menthe", ar: "نعناعي" },
  olive: { fr: "Olive", ar: "زيتي" },
  kaki: { fr: "Kaki", ar: "كاكي" },
  khaki: { fr: "Kaki", ar: "كاكي" },
  emeraude: { fr: "Émeraude", ar: "زمردي" },
  emerald: { fr: "Émeraude", ar: "زمردي" },
  "vert d'eau": { fr: "Vert d'eau", ar: "أخضر مائي" },
  ciel: { fr: "Bleu Ciel", ar: "أزرق سماوي" },
  "bleu ciel": { fr: "Bleu Ciel", ar: "أزرق سماوي" },
  sky: { fr: "Bleu Ciel", ar: "أزرق سماوي" },
  marine: { fr: "Bleu Marine", ar: "كحلي" },
  navy: { fr: "Bleu Marine", ar: "كحلي" },
  turquoise: { fr: "Turquoise", ar: "فيروزي" },
  cyan: { fr: "Cyan", ar: "سماوي" },
  indigo: { fr: "Indigo", ar: "نيلي" },
  denim: { fr: "Denim", ar: "جينز" },
  chocolat: { fr: "Chocolat", ar: "شوكولاتة" },
  chocolate: { fr: "Chocolat", ar: "شوكولاتة" },
  caramel: { fr: "Caramel", ar: "كراميل" },
  camel: { fr: "Camel", ar: "جملي" },
  terracotta: { fr: "Terracotta", ar: "طمي" },
  brique: { fr: "Brique", ar: "آجري" },
  cuir: { fr: "Cuir", ar: "جلدي" },
  jaune: { fr: "Jaune", ar: "أصفر" },
  yellow: { fr: "Jaune", ar: "أصفر" },
  orange: { fr: "Orange", ar: "برتقالي" },
  corail: { fr: "Corail", ar: "مرجاني" },
  coral: { fr: "Corail", ar: "مرجاني" },
  peche: { fr: "Pêche", ar: "خوخي" },
  pêche: { fr: "Pêche", ar: "خوخي" },
  peach: { fr: "Pêche", ar: "خوخي" },
  abricot: { fr: "Abricot", ar: "مشمشي" },
  apricot: { fr: "Abricot", ar: "مشمشي" },
  dore: { fr: "Doré", ar: "ذهبي" },
  doré: { fr: "Doré", ar: "ذهبي" },
  gold: { fr: "Doré", ar: "ذهبي" },
  rouge: { fr: "Rouge", ar: "أحمر" },
  red: { fr: "Rouge", ar: "أحمر" },
  bordeaux: { fr: "Bordeaux", ar: "عنابي" },
  burgundy: { fr: "Bordeaux", ar: "عنابي" },
  framboise: { fr: "Framboise", ar: "توتي" },
  raspberry: { fr: "Framboise", ar: "توتي" },
  rubis: { fr: "Rubis", ar: "ياقوتي" },
  anthracite: { fr: "Anthracite", ar: "فحمي" },
  argent: { fr: "Argent", ar: "فضي" },
  silver: { fr: "Argent", ar: "فضي" },
};

/**
 * Returns the translated color name based on the current locale ('fr' or 'ar').
 * Supports exact matches and compound partial matches.
 */
export function getColorLabel(colorName?: string, locale: string = "fr"): string {
  if (!colorName || typeof colorName !== "string") {
    return "";
  }

  const normalized = colorName.trim().toLowerCase();

  // Exact match
  if (COLOR_TRANSLATIONS[normalized]) {
    return locale === "ar" ? COLOR_TRANSLATIONS[normalized].ar : COLOR_TRANSLATIONS[normalized].fr;
  }

  // Partial / compound match
  for (const [key, trans] of Object.entries(COLOR_TRANSLATIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return locale === "ar" ? trans.ar : trans.fr;
    }
  }

  // Fallback to original color name
  return colorName;
}

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
