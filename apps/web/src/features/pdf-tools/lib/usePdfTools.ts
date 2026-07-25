"use client";

import { useCallback, useState } from "react";
import { mergePdfs, splitPdf } from "./pdf-operations";
import { compileToZip, triggerDownload, type CompiledZip } from "@/lib/browser-zip";
import { formatBytes } from "@workbench-tools/video-to-frames";

export type PdfStatus = "idle" | "working" | "ready" | "error";

export function usePdfTools() {
  const [status, setStatus] = useState<PdfStatus>("idle");
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mergedBytes, setMergedBytes] = useState<Uint8Array | null>(null);
  const [zipResult, setZipResult] = useState<CompiledZip | null>(null);

  const runMerge = useCallback(async (files: File[]) => {
    if (files.length < 2) return;
    setStatus("working");
    setError(null);
    setProgress({ completed: 0, total: files.length });
    try {
      const bytes = await mergePdfs(files, (completed, total) => setProgress({ completed, total }));
      setMergedBytes(bytes);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't merge those PDFs — make sure each file is a valid PDF.");
    }
  }, []);

  const downloadMerged = useCallback(() => {
    if (!mergedBytes) return;
    const blob = new Blob([mergedBytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "merged.pdf");
    URL.revokeObjectURL(url);
  }, [mergedBytes]);

  const runSplit = useCallback(async (file: File) => {
    setStatus("working");
    setError(null);
    setZipResult(null);
    try {
      const pages = await splitPdf(file, (completed, total) => setProgress({ completed, total }));
      const zip = await compileToZip(
        pages.map((p) => ({ name: p.name, data: p.bytes })),
        { filename: "split-pages" },
      );
      setZipResult(zip);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't split that PDF — make sure it's a valid file.");
    }
  }, []);

  const reset = useCallback(() => {
    zipResult?.revoke();
    setMergedBytes(null);
    setZipResult(null);
    setStatus("idle");
    setProgress(null);
    setError(null);
  }, [zipResult]);

  const mergedSize = mergedBytes ? formatBytes(mergedBytes.length) : null;

  return { status, progress, error, mergedBytes, mergedSize, zipResult, runMerge, downloadMerged, runSplit, reset };
}
