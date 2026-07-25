"use client";

import { useCallback, useState } from "react";
import { buildContactSheet, type ContactSheetResult, type ContactSheetOptions } from "./build-contact-sheet";
import { triggerDownload } from "@/lib/browser-zip";

export type ContactSheetStatus = "idle" | "building" | "ready" | "error";

export function useContactSheet() {
  const [status, setStatus] = useState<ContactSheetStatus>("idle");
  const [result, setResult] = useState<ContactSheetResult | null>(null);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const build = useCallback(async (files: File[], options: ContactSheetOptions) => {
    if (files.length === 0) return;
    setStatus("building");
    setError(null);
    setProgress({ completed: 0, total: files.length });

    try {
      const sheet = await buildContactSheet(files, options, (completed, total) => setProgress({ completed, total }));
      setResult(sheet);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't build the contact sheet.");
    }
  }, []);

  const download = useCallback(() => {
    if (result) triggerDownload(result.dataUrl, "contact-sheet.png");
  }, [result]);

  const reset = useCallback(() => {
    if (result) URL.revokeObjectURL(result.dataUrl);
    setResult(null);
    setStatus("idle");
    setProgress(null);
    setError(null);
  }, [result]);

  return { status, result, progress, error, build, download, reset };
}
