"use client";

import { useCallback, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { UploadCloud, FileVideo, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_UPLOAD_BYTES, SAMPLE_VIDEO_LABEL } from "../lib/config";
import { formatBytes } from "@workbench-tools/video-to-frames";

interface DropzoneProps {
  selectedFile: File | null;
  onFileSelected: (file: File) => void;
  onUseSample: () => void;
  disabled?: boolean;
}

export function Dropzone({ selectedFile, onFileSelected, onUseSample, disabled }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("video/")) {
        setSizeError("That doesn't look like a video file.");
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setSizeError(`That file is larger than the ${formatBytes(MAX_UPLOAD_BYTES)} limit for in-browser processing.`);
        return;
      }
      setSizeError(null);
      onFileSelected(file);
    },
    [onFileSelected],
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) inputRef.current?.click();
        }}
        onDragOver={(e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFile(e.dataTransfer.files[0]);
        }}
        className={cn(
          "panel-frame flex flex-col items-center justify-center text-center gap-3 py-16 px-6 cursor-pointer transition-colors duration-200",
          isDragging ? "border-[var(--accent)]" : "",
          disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "",
        )}
        style={{ borderStyle: "dashed", borderWidth: 1 }}
        aria-disabled={disabled}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])}
          disabled={disabled}
        />

        {selectedFile ? (
          <>
            <FileVideo size={28} strokeWidth={1.25} className="text-[var(--accent)]" />
            <div>
              <p className="text-sm text-[var(--text-primary)]">{selectedFile.name}</p>
              <p className="timecode mt-1">{formatBytes(selectedFile.size)}</p>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Click or drop to replace</p>
          </>
        ) : (
          <>
            <UploadCloud size={28} strokeWidth={1.25} className="text-[var(--text-tertiary)]" />
            <div>
              <p className="text-sm text-[var(--text-primary)]">Drop a video, or click to browse</p>
              <p className="timecode mt-1">Stays on this device \u00b7 up to {formatBytes(MAX_UPLOAD_BYTES)}</p>
            </div>
          </>
        )}
      </div>

      {sizeError && <p className="text-sm mt-3" style={{ color: "var(--alert)" }}>{sizeError}</p>}

      <button
        type="button"
        onClick={onUseSample}
        disabled={disabled}
        className="btn btn--ghost inline-flex items-center gap-2 mt-4 text-sm disabled:opacity-50"
      >
        <PlayCircle size={16} strokeWidth={1.5} />
        Try the sample clip instead
      </button>
      <p className="timecode mt-1">{SAMPLE_VIDEO_LABEL}</p>
    </div>
  );
}
