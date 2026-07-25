"use client";

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent, type KeyboardEvent, type ReactNode } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@workbench-tools/video-to-frames";

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  title?: string;
  hint?: string;
  icon?: ReactNode;
  maxSizeBytes?: number;
}

export function FileDropzone({
  accept,
  multiple = false,
  onFiles,
  disabled,
  title = "Drop a file, or click to browse",
  hint,
  icon,
  maxSizeBytes,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);

      if (maxSizeBytes) {
        const tooLarge = files.find((f) => f.size > maxSizeBytes);
        if (tooLarge) {
          setError(`"${tooLarge.name}" is larger than the ${formatBytes(maxSizeBytes)} limit.`);
          return;
        }
      }

      setError(null);
      onFiles(multiple ? files : [files[0]!]);
    },
    [maxSizeBytes, multiple, onFiles],
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
          if (!disabled) handleFiles(e.dataTransfer.files);
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
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
          disabled={disabled}
        />
        {icon ?? <UploadCloud size={28} strokeWidth={1.25} className="text-[var(--text-tertiary)]" />}
        <div>
          <p className="text-sm text-[var(--text-primary)]">{title}</p>
          {hint && <p className="timecode mt-1">{hint}</p>}
        </div>
      </div>

      {error && (
        <p className="text-sm mt-3" style={{ color: "var(--alert)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
