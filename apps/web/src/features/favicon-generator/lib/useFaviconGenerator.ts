"use client";

import { useCallback, useState } from "react";
import { loadImageFromFile, canvasToBlob } from "@/lib/canvas-utils";
import { compileToZip, type CompiledZip } from "@/lib/browser-zip";
import { ICON_SPECS, buildManifest, buildHtmlSnippet } from "./config";

export interface GeneratedIcon {
  size: number;
  filename: string;
  purpose: string;
  blob: Blob;
  dataUrl: string;
  sizeBytes: number;
}

export type FaviconStatus = "idle" | "generating" | "ready" | "zipping" | "zip-ready" | "error";

export function useFaviconGenerator() {
  const [status, setStatus] = useState<FaviconStatus>("idle");
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [zipResult, setZipResult] = useState<CompiledZip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appName, setAppName] = useState("App");

  const generate = useCallback(async (file: File) => {
    setStatus("generating");
    setError(null);
    setZipResult(null);
    setAppName(file.name.replace(/\.[^.]+$/, "") || "App");
    setProgress({ completed: 0, total: ICON_SPECS.length });

    try {
      const img = await loadImageFromFile(file);
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;

      const results: GeneratedIcon[] = [];
      for (let i = 0; i < ICON_SPECS.length; i++) {
        const spec = ICON_SPECS[i]!;
        const canvas = document.createElement("canvas");
        canvas.width = spec.size;
        canvas.height = spec.size;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, sx, sy, side, side, 0, 0, spec.size, spec.size);

        const blob = await canvasToBlob(canvas, "image/png");
        results.push({
          size: spec.size,
          filename: spec.filename,
          purpose: spec.purpose,
          blob,
          dataUrl: URL.createObjectURL(blob),
          sizeBytes: blob.size,
        });
        setProgress({ completed: i + 1, total: ICON_SPECS.length });
      }

      setIcons(results);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't generate icons from that image.");
    }
  }, []);

  const compileZip = useCallback(async () => {
    if (icons.length === 0) return;
    setStatus("zipping");
    try {
      const files = await Promise.all(
        icons.map(async (icon) => ({
          name: icon.filename,
          data: new Uint8Array(await icon.blob.arrayBuffer()),
        })),
      );
      files.push({ name: "site.webmanifest", data: new TextEncoder().encode(buildManifest(appName)) });
      files.push({ name: "favicon-snippet.html", data: new TextEncoder().encode(buildHtmlSnippet()) });

      const zip = await compileToZip(files, { filename: "favicons" });
      setZipResult(zip);
      setStatus("zip-ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't compile the zip.");
    }
  }, [icons, appName]);

  const reset = useCallback(() => {
    icons.forEach((icon) => URL.revokeObjectURL(icon.dataUrl));
    zipResult?.revoke();
    setIcons([]);
    setZipResult(null);
    setStatus("idle");
    setProgress(null);
    setError(null);
  }, [icons, zipResult]);

  return { status, icons, progress, zipResult, error, generate, compileZip, reset };
}
