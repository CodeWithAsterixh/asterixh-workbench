import { Shapes } from "lucide-react";
import type { ShapePathResult } from "../lib/geometry";

interface ShapePreviewProps {
  shape: ShapePathResult;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export function ShapePreview({ shape, fill, stroke, strokeWidth }: ShapePreviewProps) {
  const padding = strokeWidth;

  if (!shape.path) {
    return (
      <div className="panel-frame flex flex-col items-center justify-center gap-2 aspect-square" style={{ background: "var(--surface-sunken)" }}>
        <Shapes size={28} strokeWidth={1.25} className="text-[var(--text-tertiary)]" />
        <p className="timecode">Fill in a few cells to see the shape</p>
      </div>
    );
  }

  return (
    <div className="panel-frame flex items-center justify-center p-6" style={{ background: "var(--surface-sunken)" }}>
      <svg
        viewBox={`${-padding} ${-padding} ${shape.width + padding * 2} ${shape.height + padding * 2}`}
        width="100%"
        style={{ maxWidth: 420, maxHeight: 420 }}
        role="img"
        aria-label="Generated shape preview"
      >
        <path
          d={shape.path}
          fill={fill}
          stroke={strokeWidth > 0 ? stroke : "none"}
          strokeWidth={strokeWidth}
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}
