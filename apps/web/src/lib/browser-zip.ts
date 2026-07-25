import { zipSync, type Zippable } from "fflate";
import { formatBytes } from "@workbench-tools/video-to-frames";

export interface ZipFileInput {
  name: string;
  data: Uint8Array;
}

export interface CompiledZip {
  blob: Blob;
  url: string;
  filename: string;
  sizeBytes: number;
  formattedSize: string;
  fileCount: number;
  download: () => void;
  revoke: () => void;
}

export interface CompileZipOptions {
  filename?: string;
  compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** Fires once per file as it's read into the archive (a real, per-file signal). */
  onProgress?: (completed: number, total: number) => void;
}

/**
 * The same "prepare everything, then hand back a sized, downloadable
 * result" shape used by @workbench-tools/video-to-frames, generalized for
 * tools that aren't specifically about video frames (Favicon Generator,
 * Image Compressor, Sprite Sheet Packer, ...).
 */
export async function compileToZip(files: ZipFileInput[], options: CompileZipOptions = {}): Promise<CompiledZip> {
  if (files.length === 0) {
    throw new Error("No files to zip.");
  }

  const { filename = "workbench-export", compressionLevel = 6, onProgress } = options;

  const zippable: Zippable = {};
  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    zippable[file.name] = file.data;
    onProgress?.(i + 1, files.length);
  }

  const zipBytes = zipSync(zippable, { level: compressionLevel });
  const blob = new Blob([zipBytes as unknown as BlobPart], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const finalFilename = filename.endsWith(".zip") ? filename : `${filename}.zip`;

  return {
    blob,
    url,
    filename: finalFilename,
    sizeBytes: blob.size,
    formattedSize: formatBytes(blob.size),
    fileCount: files.length,
    download: () => triggerDownload(url, finalFilename),
    revoke: () => URL.revokeObjectURL(url),
  };
}

export function triggerDownload(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
