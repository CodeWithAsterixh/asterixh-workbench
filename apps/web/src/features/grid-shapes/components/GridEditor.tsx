"use client";

import { memo, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { cellKey, type CellKey } from "../lib/geometry";

interface GridEditorProps {
  rows: number;
  cols: number;
  filled: Set<CellKey>;
  mode: "paint" | "radius";
  selectedCell: CellKey | null;
  cellHasOverride: (key: CellKey) => boolean;
  onPointerDownCell: (key: CellKey) => void;
  onPointerEnterCell: (key: CellKey) => void;
  onPointerUp: () => void;
}

interface CellButtonProps {
  cellKeyValue: CellKey;
  isFilled: boolean;
  isSelected: boolean;
  hasOverride: boolean;
  cursor: string;
}

/**
 * Memoized so that, on a large grid, painting one cell only re-renders that
 * one cell — not all `rows * cols` of them. Without this, every pointermove
 * during a drag re-renders the whole grid, which is what caused the lag on
 * bigger canvases.
 */
const CellButton = memo(function CellButton({ cellKeyValue, isFilled, isSelected, hasOverride, cursor }: CellButtonProps) {
  return (
    <div
      data-cell-key={cellKeyValue}
      role="gridcell"
      aria-selected={isFilled}
      className="grid-shape-cell"
      style={{
        background: isFilled ? "var(--accent)" : "transparent",
        outline: isSelected ? "2px solid var(--accent-secondary)" : undefined,
        outlineOffset: isSelected ? -2 : undefined,
        cursor,
      }}
    >
      {hasOverride && <span className="grid-shape-cell-dot" aria-hidden="true" />}
    </div>
  );
});

/**
 * Pointer handling is delegated to the container (rather than per-cell
 * onPointerEnter) and resolved via elementFromPoint on move. Per-cell
 * pointerenter doesn't fire during a touch drag on most browsers — this
 * is what makes finger-painting actually work, not just mouse-dragging.
 *
 * Sizing is fluid (CSS grid `1fr` tracks inside a width-capped, aspect-ratio
 * locked container) rather than fixed pixels, so the grid always fits its
 * container and never needs horizontal scrolling on narrow screens — which
 * is what previously made touch drags fight with the page's own scrolling.
 */
export function GridEditor({
  rows,
  cols,
  filled,
  mode,
  selectedCell,
  cellHasOverride,
  onPointerDownCell,
  onPointerEnterCell,
  onPointerUp,
}: GridEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);

  const cellAt = (clientX: number, clientY: number): CellKey | null => {
    const el = document.elementFromPoint(clientX, clientY);
    const key = el?.getAttribute("data-cell-key");
    return key ?? null;
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDown.current = true;
    const key = cellAt(e.clientX, e.clientY);
    if (key) onPointerDownCell(key);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    const key = cellAt(e.clientX, e.clientY);
    if (key) onPointerEnterCell(key);
  };

  const handlePointerUp = () => {
    isDown.current = false;
    onPointerUp();
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="grid-shape-editor select-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        aspectRatio: `${cols} / ${rows}`,
      }}
      role="grid"
      aria-label="Shape grid — click or drag to fill cells"
    >
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const key = cellKey(r, c);
          const isFilled = filled.has(key);
          return (
            <CellButton
              key={key}
              cellKeyValue={key}
              isFilled={isFilled}
              isSelected={mode === "radius" && selectedCell === key}
              hasOverride={isFilled && cellHasOverride(key)}
              cursor={mode === "radius" && !isFilled ? "default" : "pointer"}
            />
          );
        }),
      )}
    </div>
  );
}
