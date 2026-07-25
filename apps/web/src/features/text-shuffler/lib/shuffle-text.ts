export interface DelimiterPreset {
  label: string;
  value: string;
}

export const DELIMITER_PRESETS: DelimiterPreset[] = [
  { label: "Comma", value: "," },
  { label: "Comma + space", value: ", " },
  { label: "Period", value: "." },
  { label: "Period + space", value: ". " },
  { label: "Space", value: " " },
  { label: "Two spaces", value: "  " },
  { label: "Newline", value: "\n" },
  { label: "Semicolon", value: "; " },
];

/**
 * Splits text on a delimiter. An empty delimiter splits into individual
 * characters (by Unicode code point, so emoji/surrogate pairs survive
 * intact) rather than throwing — a character shuffle is a legitimate,
 * if extreme, use of this tool.
 */
export function splitText(text: string, delimiter: string, trimPieces: boolean): string[] {
  const pieces = delimiter === "" ? Array.from(text) : text.split(delimiter);
  return trimPieces ? pieces.map((p) => p.trim()) : pieces;
}

/** Unbiased in-place Fisher–Yates (Durstenfeld) shuffle, applied to a copy. */
export function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

export interface ShuffleOutcome {
  pieces: string[];
  shuffled: string[];
  result: string;
}

export function shuffleText(text: string, delimiter: string, trimPieces: boolean): ShuffleOutcome {
  const pieces = splitText(text, delimiter, trimPieces).filter((p) => p.length > 0);
  const shuffled = shuffleArray(pieces);
  const result = shuffled.join(delimiter);
  return { pieces, shuffled, result };
}
