"use client";

import { useCallback, useState } from "react";
import { loadImageFromFile, canvasToBlob, containScale, extensionForMime } from "@/lib/canvas-utils";
import { compileToZip, type CompiledZip } from "@/lib/browser-zip";
import type { FrameMimeType } from "@workbench-tools/video-to-frames";

export interface CompressedImage {
  name: string;
  originalBytes: number;
  compressedBytes: number;
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}

export type CompressorStatus = "idle" | "compressing" | "ready" | "zipping" | "zip-ready" | "error";

export interface CompressOptions {
  format: FrameMimeType;
  quality: number;
  maxWidth?: number;
}

export function useImageCompressor() {
  const [status, setStatus] = useState<CompressorStatus>("idle");
  const [results, setResults] = useState<CompressedImage[]>([]);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [zipResult, setZipResult] = useState<CompiledZip | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compress = useCallback(async (files: File[], options: CompressOptions) => {
    setStatus("compressing");
    setError(null);
    setZipResult(null);
    setProgress({ completed: 0, total: files.length });

    try {
      const output: CompressedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i]!;
        const img = await loadImageFromFile(file);
        const scale = containScale(img.naturalWidth, img.naturalHeight, options.maxWidth);
        const width = Math.max(1, Math.round(img.naturalWidth * scale));
        const height = Math.max(1, Math.round(img.naturalHeight * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const blob = await canvasToBlob(canvas, options.format, options.quality);
        const baseName = file.name.replace(/\.[^.]+$/, "");
        output.push({
          name: `${baseName}.${extensionForMime(options.format)}`,
          originalBytes: file.size,
          compressedBytes: blob.size,
          blob,
          dataUrl: URL.createObjectURL(blob),
          width,
          height,
        });
        setProgress({ completed: i + 1, total: files.length });
      }

      setResults(output);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't compress those images.");
    }
  }, []);

  const compileZip = useCallback(async () => {
    if (results.length === 0) return;
    setStatus("zipping");
    try {
      const files = await Promise.all(
        results.map(async (r) => ({ name: r.name, data: new Uint8Array(await r.blob.arrayBuffer()) })),
      );
      const zip = await compileToZip(files, { filename: "compressed-images" });
      setZipResult(zip);
      setStatus("zip-ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't compile the zip.");
    }
  }, [results]);

  const reset = useCallback(() => {
    results.forEach((r) => URL.revokeObjectURL(r.dataUrl));
    zipResult?.revoke();
    setResults([]);
    setZipResult(null);
    setStatus("idle");
    setProgress(null);
    setError(null);
  }, [results, zipResult]);

  return { status, results, progress, zipResult, error, compress, compileZip, reset };
}
