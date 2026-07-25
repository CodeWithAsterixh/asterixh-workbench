"use client";

import { useCallback, useState } from "react";
import { buildGif, type GifOptions } from "./build-gif";
import { triggerDownload } from "@/lib/browser-zip";
import { formatBytes } from "@workbench-tools/video-to-frames";

export type GifStatus = "idle" | "building" | "ready" | "error";

export function useGifMaker() {
  const [status, setStatus] = useState<GifStatus>("idle");
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState<string | null>(null);

  const build = useCallback(async (files: File[], options: GifOptions) => {
    setStatus("building");
    setError(null);
    setProgress({ completed: 0, total: files.length });

    try {
      const bytes = await buildGif(files, options, (completed, total) => setProgress({ completed, total }));
      const blob = new Blob([bytes as unknown as BlobPart], { type: "image/gif" });
      setGifUrl(URL.createObjectURL(blob));
      setGifSize(formatBytes(blob.size));
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't build a GIF from those images.");
    }
  }, []);

  const download = useCallback(() => {
    if (gifUrl) triggerDownload(gifUrl, "workbench.gif");
  }, [gifUrl]);

  const reset = useCallback(() => {
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setGifUrl(null);
    setGifSize(null);
    setStatus("idle");
    setProgress(null);
    setError(null);
  }, [gifUrl]);

  return { status, progress, error, gifUrl, gifSize, build, download, reset };
}
