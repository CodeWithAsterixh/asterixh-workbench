import { PDFDocument } from "pdf-lib";

export async function getPageCount(file: File): Promise<number> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

export async function mergePdfs(files: File[], onProgress?: (completed: number, total: number) => void): Promise<Uint8Array> {
  const merged = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const doc = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
    onProgress?.(i + 1, files.length);
  }

  return merged.save();
}

export interface SplitPage {
  name: string;
  bytes: Uint8Array;
}

export async function splitPdf(file: File, onProgress?: (completed: number, total: number) => void): Promise<SplitPage[]> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const source = await PDFDocument.load(bytes);
  const indices = source.getPageIndices();
  const digits = String(indices.length).length;

  const results: SplitPage[] = [];
  for (let i = 0; i < indices.length; i++) {
    const newDoc = await PDFDocument.create();
    const [page] = await newDoc.copyPages(source, [indices[i]!]);
    newDoc.addPage(page!);
    const pageBytes = await newDoc.save();
    results.push({ name: `page-${String(i + 1).padStart(digits, "0")}.pdf`, bytes: pageBytes });
    onProgress?.(i + 1, indices.length);
  }

  return results;
}
