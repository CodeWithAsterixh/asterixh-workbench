export interface JsonErrorPosition {
  line: number;
  column: number;
}

export interface JsonParseOutcome {
  data?: unknown;
  error?: string;
  position?: JsonErrorPosition;
}

/**
 * Wraps JSON.parse with best-effort error location extraction. Exact error
 * message formats (and whether a position is included at all) vary by
 * browser engine, so `position` is a bonus, not a guarantee.
 */
export function tryParseJson(input: string): JsonParseOutcome {
  try {
    return { data: JSON.parse(input) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON";
    return { error: message, position: extractPosition(message, input) };
  }
}

function extractPosition(message: string, input: string): JsonErrorPosition | undefined {
  const lineColMatch = message.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return { line: Number(lineColMatch[1]), column: Number(lineColMatch[2]) };
  }

  const positionMatch = message.match(/position (\d+)/i);
  if (!positionMatch) return undefined;

  const index = Number(positionMatch[1]);
  const before = input.slice(0, index);
  const lines = before.split("\n");
  const lastLine = lines[lines.length - 1] ?? "";
  return { line: lines.length, column: lastLine.length + 1 };
}

export function formatJson(input: string, indent: number = 2): JsonParseOutcome & { formatted?: string } {
  const outcome = tryParseJson(input);
  if (outcome.error) return outcome;
  return { ...outcome, formatted: JSON.stringify(outcome.data, null, indent) };
}

export function minifyJson(input: string): JsonParseOutcome & { minified?: string } {
  const outcome = tryParseJson(input);
  if (outcome.error) return outcome;
  return { ...outcome, minified: JSON.stringify(outcome.data) };
}

export function countKeys(data: unknown): number {
  if (Array.isArray(data)) return data.reduce<number>((sum, item) => sum + countKeys(item), 0);
  if (data && typeof data === "object") {
    return Object.entries(data).reduce((sum, [, value]) => sum + 1 + countKeys(value), 0);
  }
  return 0;
}
