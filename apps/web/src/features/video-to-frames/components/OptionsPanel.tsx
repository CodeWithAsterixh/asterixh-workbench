"use client";

import type { ChangeEvent } from "react";
import { Scissors } from "lucide-react";
import { FORMAT_OPTIONS, FRAME_COUNT_MAX, FRAME_COUNT_MIN } from "../lib/config";
import type { FrameMimeType } from "@workbench-tools/video-to-frames";

interface OptionsPanelProps {
  frameCount: number;
  onFrameCountChange: (n: number) => void;
  format: FrameMimeType;
  onFormatChange: (f: FrameMimeType) => void;
  trimStart: number;
  trimEnd: number;
  onTrimStartChange: (n: number) => void;
  onTrimEndChange: (n: number) => void;
  onExtract: () => void;
  canExtract: boolean;
  disabled?: boolean;
}

export function OptionsPanel({
  frameCount,
  onFrameCountChange,
  format,
  onFormatChange,
  trimStart,
  trimEnd,
  onTrimStartChange,
  onTrimEndChange,
  onExtract,
  canExtract,
  disabled,
}: OptionsPanelProps) {
  return (
    <div className="card">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="frame-count">Frame count</label>
          <div className="flex items-center gap-3">
            <input
              id="frame-count"
              type="range"
              min={FRAME_COUNT_MIN}
              max={FRAME_COUNT_MAX}
              value={frameCount}
              disabled={disabled}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onFrameCountChange(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <span className="timecode w-10 text-right">{frameCount}</span>
          </div>
        </div>

        <div>
          <label htmlFor="format">Format</label>
          <select
            id="format"
            className="field"
            value={format}
            disabled={disabled}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onFormatChange(e.target.value as FrameMimeType)}
          >
            {FORMAT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="trim-start">Trim start</label>
          <div className="flex items-center gap-3">
            <input
              id="trim-start"
              type="range"
              min={0}
              max={40}
              value={Math.round(trimStart * 100)}
              disabled={disabled}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onTrimStartChange(Number(e.target.value) / 100)}
              className="w-full accent-[var(--accent)]"
            />
            <span className="timecode w-10 text-right">{Math.round(trimStart * 100)}%</span>
          </div>
        </div>

        <div>
          <label htmlFor="trim-end">Trim end</label>
          <div className="flex items-center gap-3">
            <input
              id="trim-end"
              type="range"
              min={0}
              max={40}
              value={Math.round(trimEnd * 100)}
              disabled={disabled}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onTrimEndChange(Number(e.target.value) / 100)}
              className="w-full accent-[var(--accent)]"
            />
            <span className="timecode w-10 text-right">{Math.round(trimEnd * 100)}%</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onExtract}
        disabled={!canExtract || disabled}
        className="btn btn--primary w-full mt-8 disabled:opacity-50 disabled:pointer-events-none"
      >
        <Scissors size={15} strokeWidth={1.75} />
        Extract frames
      </button>
    </div>
  );
}
