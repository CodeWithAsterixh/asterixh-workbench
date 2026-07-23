/**
 * Lightweight classnames helper. Avoids an extra dependency (clsx/tailwind-merge)
 * for a utility this small.
 */
export function cn(...inputs: unknown[]): string {
  return inputs
    .flat(Infinity)
    .filter((val): val is string => typeof val === "string" && val.trim() !== "")
    .join(" ");
}
