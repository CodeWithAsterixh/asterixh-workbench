"use client";

import { PDFDocument, degrees, rgb } from "pdf-lib";
import { canvasToBlob } from "@/lib/canvas-utils";
import { compileToZip, type ZipFileInput } from "@/lib/browser-zip";
import { formatBytes } from "@workbench-tools/video-to-frames";

export type PdfMode =
  | "compress"
  | "rotate"
  | "reorder"
  | "watermark"
  | "unlock"
  | "protect"
  | "images-to-pdf"
  | "pdf-to-images"
  | "ocr";

export interface PdfWorkbenchOptions {
  angle: number;
  quality: number;
  watermark: string;
  password: string;
  outputFormat: "image/png" | "image/jpeg" | "image/webp";
}

export interface PdfWorkbenchResult {
  kind: "pdf" | "zip" | "text";
  filename: string;
  blob?: Blob;
  zip?: Awaited<ReturnType<typeof compileToZip>>;
  text?: string;
  sizeLabel?: string;
  itemCount?: number;
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");
  return ctx;
}

async function getPdfJs() {
  return await import("pdfjs-dist/webpack.mjs");
}

async function loadDocument(bytes: Uint8Array, password?: string) {
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data: bytes, password: password || undefined });
  return await loadingTask.promise;
}

async function renderPageToCanvas(page: any, scale = 1.75) {
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = getContext(canvas);
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

async function rasterizePdf(file: File, options: PdfWorkbenchOptions, onProgress?: (completed: number, total: number) => void) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await loadDocument(bytes, options.password);
  const pages: { name: string; data: Uint8Array; width: number; height: number }[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const canvas = await renderPageToCanvas(page, 1.75 + options.quality);
    const blob = await canvasToBlob(canvas, options.outputFormat, options.outputFormat === "image/png" ? undefined : options.quality);
    pages.push({
      name: `page-${String(i).padStart(String(doc.numPages).length, "0")}.${options.outputFormat === "image/png" ? "png" : options.outputFormat === "image/jpeg" ? "jpg" : "webp"}`,
      data: new Uint8Array(await blob.arrayBuffer()),
      width: canvas.width,
      height: canvas.height,
    });
    onProgress?.(i, doc.numPages);
  }

  return pages;
}

async function imagesToPdf(files: File[]) {
  const doc = await PDFDocument.create();
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const lower = file.name.toLowerCase();
    const image = lower.endsWith(".png") ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const page = doc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  return await doc.save({ useObjectStreams: true });
}

async function rotatePdf(file: File, angle: number) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes);
  const pages = doc.getPages();
  pages.forEach((page) => page.setRotation(degrees(angle)));
  return await doc.save({ useObjectStreams: true });
}

async function watermarkPdf(file: File, watermark: string) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont("Helvetica");
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    page.drawText(watermark, {
      x: 28,
      y: 28,
      size: Math.max(14, Math.min(width, height) * 0.04),
      font,
      color: rgb(0.12, 0.12, 0.12),
      opacity: 0.18,
      rotate: degrees(0),
    });
  }
  return await doc.save({ useObjectStreams: true });
}

async function reorderPdf(file: File, order: number[]) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const src = await PDFDocument.load(bytes);
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, order);
  pages.forEach((page) => doc.addPage(page));
  return await doc.save({ useObjectStreams: true });
}

async function compressPdf(file: File, options: PdfWorkbenchOptions, onProgress?: (completed: number, total: number) => void) {
  const pages = await rasterizePdf(file, options, onProgress);
  return await rebuildPdfFromImages(pages.map((page) => ({ name: page.name, data: page.data })));
}

async function rebuildPdfFromImages(files: ZipFileInput[]) {
  const doc = await PDFDocument.create();
  for (const file of files) {
    const bytes = file.data;
    const image = file.name.toLowerCase().endsWith(".png") ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const page = doc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  return await doc.save({ useObjectStreams: true });
}

async function ocrPdf(file: File, options: PdfWorkbenchOptions, onProgress?: (completed: number, total: number) => void) {
  const pages = await rasterizePdf(file, options, onProgress);
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  const lines: string[] = [];
  try {
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]!;
      const canvas = createCanvas(page.width, page.height);
      const ctx = getContext(canvas);
      const img = new Image();
      const pageBytes = new Uint8Array(page.data.byteLength);
      pageBytes.set(page.data);
      const pageUrl = URL.createObjectURL(new Blob([pageBytes.buffer], { type: options.outputFormat }));
      try {
        img.src = pageUrl;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Couldn't read page ${i + 1}.`));
        });
        ctx.drawImage(img, 0, 0);
        const result = await worker.recognize(canvas);
        lines.push(`--- Page ${i + 1} ---`, result.data.text.trim() || "(no text found)", "");
        onProgress?.(i + 1, pages.length);
      } finally {
        URL.revokeObjectURL(pageUrl);
      }
    }
  } finally {
    await worker.terminate();
  }
  return lines.join("\n").trim();
}

export async function runPdfWorkbench(
  mode: PdfMode,
  files: File[],
  options: PdfWorkbenchOptions,
  pageOrder?: number[],
  onProgress?: (completed: number, total: number) => void,
): Promise<PdfWorkbenchResult> {
  if (mode === "images-to-pdf") {
    const bytes = await imagesToPdf(files);
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    return { kind: "pdf", filename: "images-to-pdf.pdf", blob, sizeLabel: formatBytes(blob.size) };
  }

  const file = files[0];
  if (!file) throw new Error("Add a file to continue.");

  if (mode === "rotate") {
    const bytes = await rotatePdf(file, options.angle);
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    return { kind: "pdf", filename: "rotated.pdf", blob, sizeLabel: formatBytes(blob.size) };
  }

  if (mode === "watermark") {
    const bytes = await watermarkPdf(file, options.watermark || "Workbench");
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    return { kind: "pdf", filename: "watermarked.pdf", blob, sizeLabel: formatBytes(blob.size) };
  }

  if (mode === "reorder") {
    const order = pageOrder ?? [];
    if (order.length === 0) throw new Error("Pick a page order first.");
    const bytes = await reorderPdf(file, order);
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    return { kind: "pdf", filename: "reordered.pdf", blob, sizeLabel: formatBytes(blob.size) };
  }

  if (mode === "compress") {
    const bytes = await compressPdf(file, options, onProgress);
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    return { kind: "pdf", filename: "compressed.pdf", blob, sizeLabel: formatBytes(blob.size) };
  }

  if (mode === "unlock" || mode === "protect") {
    const pages = await rasterizePdf(file, options, onProgress);
    const pdfBytes = await rebuildPdfFromImages(pages.map((page) => ({ name: page.name, data: page.data })));
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
    return { kind: "pdf", filename: mode === "unlock" ? "unlocked.pdf" : "protected.pdf", blob, sizeLabel: formatBytes(blob.size) };
  }

  if (mode === "pdf-to-images") {
    const pages = await rasterizePdf(file, options, onProgress);
    const zip = await compileToZip(pages.map((page) => ({ name: page.name, data: page.data })), { filename: "pdf-pages" });
    return { kind: "zip", filename: zip.filename, zip, itemCount: pages.length };
  }

  if (mode === "ocr") {
    const text = await ocrPdf(file, options, onProgress);
    const blob = new Blob([text], { type: "text/plain" });
    return { kind: "text", filename: "ocr.txt", blob, text };
  }

  throw new Error("Unsupported PDF mode.");
}
