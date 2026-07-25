"use client";

import { useCallback, useState } from "react";
import { packSprites, type PackResult } from "./pack-sprites";
import { compileToZip, type CompiledZip } from "@/lib/browser-zip";

export type PackerStatus = "idle" | "packing" | "ready" | "zipping" | "zip-ready" | "error";

export function useSpritePacker() {
  const [status, setStatus] = useState<PackerStatus>("idle");
  const [result, setResult] = useState<PackResult | null>(null);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [zipResult, setZipResult] = useState<CompiledZip | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pack = useCallback(async (files: File[], padding: number) => {
    if (files.length === 0) return;
    setStatus("packing");
    setError(null);
    setZipResult(null);
    setProgress({ completed: 0, total: files.length });

    try {
      const packed = await packSprites(files, padding, (completed, total) => setProgress({ completed, total }));
      setResult(packed);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't pack those images.");
    }
  }, []);

  const compileZip = useCallback(async () => {
    if (!result) return;
    setStatus("zipping");
    try {
      const zip = await compileToZip(
        [
          { name: "sprite-sheet.png", data: new Uint8Array(await result.blob.arrayBuffer()) },
          { name: "sprite-manifest.json", data: new TextEncoder().encode(result.manifest) },
        ],
        { filename: "sprite-sheet" },
      );
      setZipResult(zip);
      setStatus("zip-ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't compile the zip.");
    }
  }, [result]);

  const reset = useCallback(() => {
    if (result) URL.revokeObjectURL(result.dataUrl);
    zipResult?.revoke();
    setResult(null);
    setZipResult(null);
    setStatus("idle");
    setProgress(null);
    setError(null);
  }, [result, zipResult]);

  return { status, result, progress, zipResult, error, pack, compileZip, reset };
}
