"use client";

import { useEffect, useState } from "react";
import { generateQrPng, generateQrSvg, type QrOptions, type ErrorCorrectionLevel } from "./generate-qr";
import { triggerDownload } from "@/lib/browser-zip";

const DEFAULT_OPTIONS: QrOptions = {
  text: "https://workbench.dev",
  errorCorrectionLevel: "M",
  size: 320,
  darkColor: "#17150f",
  lightColor: "#f4f1e6",
  margin: 2,
};

export function useQrCode() {
  const [options, setOptions] = useState<QrOptions>(DEFAULT_OPTIONS);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!options.text.trim()) {
      setPngUrl(null);
      return;
    }
    let cancelled = false;
    generateQrPng(options)
      .then((url) => {
        if (!cancelled) {
          setPngUrl(url);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn't generate that QR code.");
      });
    return () => {
      cancelled = true;
    };
  }, [options]);

  const update = <K extends keyof QrOptions>(key: K, value: QrOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const setErrorCorrectionLevel = (level: ErrorCorrectionLevel) => update("errorCorrectionLevel", level);

  const downloadPng = () => {
    if (pngUrl) triggerDownload(pngUrl, "qr-code.png");
  };

  const downloadSvg = async () => {
    const svg = await generateQrSvg(options);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "qr-code.svg");
    URL.revokeObjectURL(url);
  };

  return { options, update, setErrorCorrectionLevel, pngUrl, error, downloadPng, downloadSvg };
}
