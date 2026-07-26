"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { buildShapePath, cellKey, parseCellKey, type CellKey } from "./geometry";

const DEFAULT_ROWS = 14;
const DEFAULT_COLS = 14;
const DEFAULT_RADIUS = 10;
const DEFAULT_CELL_SIZE = 32;

/** A small plus/cross — it has both convex outer corners and concave inner
 *  notches, so the shape it produces immediately shows off what this tool does. */
function buildDefaultShape(rows: number, cols: number): Set<CellKey> {
  const filled = new Set<CellKey>();
  const midRow = Math.floor(rows / 2);
  const midCol = Math.floor(cols / 2);
  const armHalf = 2;
  for (let r = midRow - armHalf; r <= midRow + armHalf; r++) {
    for (let c = midCol - 1; c <= midCol + 1; c++) filled.add(cellKey(r, c));
  }
  for (let c = midCol - armHalf; c <= midCol + armHalf; c++) {
    for (let r = midRow - 1; r <= midRow + 1; r++) filled.add(cellKey(r, c));
  }
  return filled;
}

export type EditMode = "paint" | "radius";

export function useGridShapes() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [filled, setFilled] = useState<Set<CellKey>>(() => buildDefaultShape(DEFAULT_ROWS, DEFAULT_COLS));
  const [defaultRadius, setDefaultRadius] = useState(DEFAULT_RADIUS);
  const [cellRadiusOverrides, setCellRadiusOverrides] = useState<Map<CellKey, number>>(new Map());
  const [cellSize, setCellSize] = useState(DEFAULT_CELL_SIZE);
  const [fill, setFill] = useState("#b8863a");
  const [stroke, setStroke] = useState("#17150f");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [mode, setMode] = useState<EditMode>("paint");
  const [selectedCell, setSelectedCell] = useState<CellKey | null>(null);

  const paintValueRef = useRef(true);
  const isPointerDownRef = useRef(false);

  const setCell = useCallback((key: CellKey, value: boolean) => {
    setFilled((prev) => {
      if (prev.has(key) === value) return prev;
      const next = new Set(prev);
      if (value) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  const handlePointerDownOnCell = useCallback(
    (key: CellKey) => {
      if (mode === "radius") {
        setSelectedCell(filled.has(key) ? key : null);
        return;
      }
      isPointerDownRef.current = true;
      const next = !filled.has(key);
      paintValueRef.current = next;
      setCell(key, next);
    },
    [mode, filled, setCell],
  );

  const handlePointerEnterCell = useCallback(
    (key: CellKey) => {
      if (mode !== "paint" || !isPointerDownRef.current) return;
      setCell(key, paintValueRef.current);
    },
    [mode, setCell],
  );

  const handlePointerUp = useCallback(() => {
    isPointerDownRef.current = false;
  }, []);

  const resize = useCallback((nextRows: number, nextCols: number) => {
    setRows(nextRows);
    setCols(nextCols);
    setFilled((prev) => {
      const next = new Set<CellKey>();
      for (const key of prev) {
        const { row, col } = parseCellKey(key);
        if (row < nextRows && col < nextCols) next.add(key);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setFilled(new Set());
    setCellRadiusOverrides(new Map());
    setSelectedCell(null);
  }, []);

  const setSelectedCellRadius = useCallback(
    (radius: number | null) => {
      if (!selectedCell) return;
      setCellRadiusOverrides((prev) => {
        const next = new Map(prev);
        if (radius === null) next.delete(selectedCell);
        else next.set(selectedCell, radius);
        return next;
      });
    },
    [selectedCell],
  );

  const shape = useMemo(
    () => buildShapePath(filled, cellSize, defaultRadius, cellRadiusOverrides),
    [filled, cellSize, defaultRadius, cellRadiusOverrides],
  );

  const selectedCellRadius = selectedCell ? (cellRadiusOverrides.get(selectedCell) ?? null) : null;

  return {
    rows,
    cols,
    filled,
    defaultRadius,
    setDefaultRadius,
    cellSize,
    setCellSize,
    fill,
    setFill,
    stroke,
    setStroke,
    strokeWidth,
    setStrokeWidth,
    mode,
    setMode,
    selectedCell,
    selectedCellRadius,
    setSelectedCellRadius,
    cellRadiusOverrides,
    shape,
    resize,
    clear,
    handlePointerDownOnCell,
    handlePointerEnterCell,
    handlePointerUp,
  };
}
