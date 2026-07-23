/** Formats a byte count as a short human string, e.g. 8493821 -> "8.1 MB". */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, exponent);
  const rounded = exponent === 0 ? String(value) : value.toFixed(decimals);
  return `${rounded} ${units[exponent]}`;
}
