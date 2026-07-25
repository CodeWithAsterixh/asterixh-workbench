"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { cellKey, type CellKey } from "../lib/geometry";

interface GridEditorProps {
  rows: number;
  cols: number;
  filled: Set<CellKey>;
  cellSize: number;
  mode: "paint" | "radius";
  selectedCell: CellKey | null;
  cellHasOverride: (key: CellKey) => boolean;
  onPointerDownCell: (key: CellKey) => void;
  onPointerEnterCell: (key: CellKey) => void;
  onPointerUp: () => void;
}

/**
 * Pointer handling is delegated to the container (rather than per-cell
 * onPointerEnter) and resolved via elementFromPoint on move. Per-cell
 * pointerenter doesn't fire during a touch drag on most browsers \u2014 this
 * is what makes finger-painting actually work, not just mouse-dragging.
 */
export function GridEditor({
  rows,
  cols,
  filled,
  cellSize,
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
      className="inline-grid select-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        touchAction: "none",
        border: "1px solid var(--border)",
        background: "var(--surface-sunken)",
      }}
      role="grid"
      aria-label="Shape grid \u2014 click or drag to fill cells"
    >
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const key = cellKey(r, c);
          const isFilled = filled.has(key);
          const isSelected = mode === "radius" && selectedCell === key;
          const hasOverride = isFilled && cellHasOverride(key);
          return (
            <div
              key={key}
              data-cell-key={key}
              role="gridcell"
              aria-selected={isFilled}
              style={{
                width: cellSize,
                height: cellSize,
                boxSizing: "border-box",
                border: "1px solid var(--border)",
                background: isFilled ? "var(--accent)" : "transparent",
                outline: isSelected ? "2px solid var(--accent-secondary)" : undefined,
                outlineOffset: isSelected ? -2 : undefined,
                position: "relative",
                cursor: mode === "radius" && !isFilled ? "default" : "pointer",
              }}
            >
              {hasOverride && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--accent-secondary)",
                  }}
                />
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}
