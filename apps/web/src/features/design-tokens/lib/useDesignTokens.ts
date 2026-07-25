"use client";

import { useCallback, useMemo, useState } from "react";
import { extractPalette, paletteToCss, paletteToTailwind, paletteToJson, type PaletteColor } from "./extract-palette";
import { compileToZip, type CompiledZip } from "@/lib/browser-zip";

export type ExtractorStatus = "idle" | "extracting" | "ready" | "error";

export function useDesignTokens() {
  const [status, setStatus] = useState<ExtractorStatus>("idle");
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [zipResult, setZipResult] = useState<CompiledZip | null>(null);

  const extract = useCallback(async (file: File, colorCount: number) => {
    setStatus("extracting");
    setError(null);
    setZipResult(null);
    try {
      const result = await extractPalette(file, colorCount);
      setPalette(result);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't extract a palette from that image.");
    }
  }, []);

  const css = useMemo(() => paletteToCss(palette), [palette]);
  const tailwind = useMemo(() => paletteToTailwind(palette), [palette]);
  const json = useMemo(() => paletteToJson(palette), [palette]);

  const downloadAll = useCallback(async () => {
    if (palette.length === 0) return;
    const zip = await compileToZip(
      [
        { name: "tokens.css", data: new TextEncoder().encode(css) },
        { name: "tailwind.config.snippet.js", data: new TextEncoder().encode(tailwind) },
        { name: "tokens.json", data: new TextEncoder().encode(json) },
      ],
      { filename: "design-tokens" },
    );
    zip.download();
    zip.revoke();
  }, [palette, css, tailwind, json]);

  const reset = useCallback(() => {
    zipResult?.revoke();
    setPalette([]);
    setZipResult(null);
    setStatus("idle");
    setError(null);
  }, [zipResult]);

  return { status, palette, error, css, tailwind, json, extract, downloadAll, reset };
}
