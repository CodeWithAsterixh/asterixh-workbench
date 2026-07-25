import type { ShapePathResult } from "./geometry";

export function buildSvgDocument(shape: ShapePathResult, fill: string, stroke: string, strokeWidth: number): string {
  const padding = strokeWidth;
  const width = shape.width + padding * 2;
  const height = shape.height + padding * 2;
  const strokeAttrs = strokeWidth > 0 ? ` stroke="${stroke}" stroke-width="${strokeWidth}"` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-padding} ${-padding} ${width} ${height}" width="${width}" height="${height}">
  <path d="${shape.path}" fill="${fill}"${strokeAttrs} fill-rule="evenodd" />
</svg>`;
}

export function buildClipPathCss(shape: ShapePathResult): string {
  return `.your-element {\n  width: ${shape.width}px;\n  height: ${shape.height}px;\n  clip-path: path("${shape.path}");\n}`;
}
