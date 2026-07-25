"use client";

import { useState, type ChangeEvent } from "react";
import { Paintbrush, CircleDot, Trash2, Download, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildSvgDocument, buildClipPathCss } from "../lib/export-shape";
import { triggerDownload } from "@/lib/browser-zip";
import type { useGridShapes } from "../lib/useGridShapes";

interface ShapeControlsProps {
  gs: ReturnType<typeof useGridShapes>;
}

function CopyButton({ getText, label }: { getText: () => string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(getText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button type="button" onClick={handleCopy} className="btn btn--secondary flex-1">
      {copied ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
      {copied ? "Copied" : label}
    </button>
  );
}

export function ShapeControls({ gs }: ShapeControlsProps) {
  const handleDownload = () => {
    const svg = buildSvgDocument(gs.shape, gs.fill, gs.stroke, gs.strokeWidth);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "shape.svg");
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <label>Mode</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => gs.setMode("paint")}
            className={cn("btn flex-1", gs.mode === "paint" ? "btn--primary" : "btn--secondary")}
          >
            <Paintbrush size={14} strokeWidth={1.75} />
            Paint
          </button>
          <button
            type="button"
            onClick={() => gs.setMode("radius")}
            className={cn("btn flex-1", gs.mode === "radius" ? "btn--primary" : "btn--secondary")}
          >
            <CircleDot size={14} strokeWidth={1.75} />
            Radius
          </button>
        </div>
        <p className="timecode mt-3">
          {gs.mode === "paint"
            ? "Click or drag across cells to fill or clear them."
            : "Click a filled cell to give it its own corner radius."}
        </p>
      </div>

      {gs.mode === "radius" && (
        <div className="card">
          <label>{gs.selectedCell ? `Selected cell (${gs.selectedCell})` : "No cell selected"}</label>
          {gs.selectedCell ? (
            <>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={gs.cellSize}
                  value={gs.selectedCellRadius ?? gs.defaultRadius}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => gs.setSelectedCellRadius(Number(e.target.value))}
                  className="w-full accent-[var(--accent-secondary)]"
                />
                <span className="timecode w-10 text-right">{gs.selectedCellRadius ?? gs.defaultRadius}</span>
              </div>
              <button type="button" onClick={() => gs.setSelectedCellRadius(null)} className="btn btn--ghost text-sm mt-3">
                Use default radius instead
              </button>
            </>
          ) : (
            <p className="timecode">Click a filled cell in the grid to select it.</p>
          )}
        </div>
      )}

      <div className="card">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="grid-rows">Rows</label>
            <input
              id="grid-rows"
              type="number"
              min={2}
              max={40}
              value={gs.rows}
              onChange={(e: ChangeEvent<HTMLInputElement>) => gs.resize(Number(e.target.value) || gs.rows, gs.cols)}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="grid-cols">Columns</label>
            <input
              id="grid-cols"
              type="number"
              min={2}
              max={40}
              value={gs.cols}
              onChange={(e: ChangeEvent<HTMLInputElement>) => gs.resize(gs.rows, Number(e.target.value) || gs.cols)}
              className="field"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="cell-size">Cell size</label>
          <div className="flex items-center gap-3">
            <input
              id="cell-size"
              type="range"
              min={16}
              max={48}
              value={gs.cellSize}
              onChange={(e: ChangeEvent<HTMLInputElement>) => gs.setCellSize(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <span className="timecode w-14 text-right">{gs.cellSize}px</span>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="default-radius">Default corner radius</label>
          <div className="flex items-center gap-3">
            <input
              id="default-radius"
              type="range"
              min={0}
              max={gs.cellSize}
              value={gs.defaultRadius}
              onChange={(e: ChangeEvent<HTMLInputElement>) => gs.setDefaultRadius(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <span className="timecode w-10 text-right">{gs.defaultRadius}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="fill-color">Fill</label>
            <div className="flex items-center gap-2">
              <input
                id="fill-color"
                type="color"
                value={gs.fill}
                onChange={(e: ChangeEvent<HTMLInputElement>) => gs.setFill(e.target.value)}
                style={{ width: "2.75rem", height: "2.75rem", padding: 0, border: "1px solid var(--border)", background: "none" }}
              />
              <code className="timecode">{gs.fill}</code>
            </div>
          </div>
          <div>
            <label htmlFor="stroke-color">Stroke</label>
            <div className="flex items-center gap-2">
              <input
                id="stroke-color"
                type="color"
                value={gs.stroke}
                onChange={(e: ChangeEvent<HTMLInputElement>) => gs.setStroke(e.target.value)}
                style={{ width: "2.75rem", height: "2.75rem", padding: 0, border: "1px solid var(--border)", background: "none" }}
              />
              <code className="timecode">{gs.stroke}</code>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="stroke-width">Stroke width</label>
          <div className="flex items-center gap-3">
            <input
              id="stroke-width"
              type="range"
              min={0}
              max={20}
              value={gs.strokeWidth}
              onChange={(e: ChangeEvent<HTMLInputElement>) => gs.setStrokeWidth(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <span className="timecode w-10 text-right">{gs.strokeWidth}</span>
          </div>
        </div>
      </div>

      <button type="button" onClick={gs.clear} className="btn btn--ghost">
        <Trash2 size={14} strokeWidth={1.75} />
        Clear grid
      </button>

      <div className="card">
        <label>Export</label>
        <div className="flex flex-col gap-3">
          <button type="button" onClick={handleDownload} disabled={!gs.shape.path} className="btn btn--accent disabled:opacity-50">
            <Download size={15} strokeWidth={1.75} />
            Download SVG
          </button>
          <div className="flex gap-3">
            <CopyButton getText={() => buildSvgDocument(gs.shape, gs.fill, gs.stroke, gs.strokeWidth)} label="Copy SVG" />
            <CopyButton getText={() => buildClipPathCss(gs.shape)} label="Copy clip-path" />
          </div>
        </div>
      </div>
    </div>
  );
}
