"use client";

import { useCallback, useRef, useState } from "react";
import {
  videoToFrames,
  type ExtractedFrame,
  type ExtractionProgress,
  type FrameExtractionOptions,
  type VideoInfo,
  type VideoToFramesResult,
  type ZipOptions,
  type ZipProgress,
  type ZipResult,
} from "@workbench-tools/video-to-frames";

export type ToolStatus = "idle" | "extracting" | "ready" | "zipping" | "zip-ready" | "error";

export interface UseVideoToFramesState {
  status: ToolStatus;
  frames: ExtractedFrame[];
  video: VideoInfo | null;
  totalSizeBytes: number;
  extractionProgress: ExtractionProgress | null;
  zipResult: ZipResult | null;
  zipProgress: ZipProgress | null;
  error: string | null;
}

const initialState: UseVideoToFramesState = {
  status: "idle",
  frames: [],
  video: null,
  totalSizeBytes: 0,
  extractionProgress: null,
  zipResult: null,
  zipProgress: null,
  error: null,
};

export function useVideoToFrames() {
  const [state, setState] = useState<UseVideoToFramesState>(initialState);
  const resultRef = useRef<VideoToFramesResult | null>(null);
  const zipResultRef = useRef<ZipResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const disposeCurrent = useCallback(() => {
    zipResultRef.current?.revoke();
    zipResultRef.current = null;
    resultRef.current?.dispose();
    resultRef.current = null;
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    disposeCurrent();
    setState(initialState);
  }, [disposeCurrent]);

  const extract = useCallback(
    async (source: File | string, options: Omit<FrameExtractionOptions, "onProgress" | "signal">) => {
      disposeCurrent();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({ ...initialState, status: "extracting" });

      try {
        const result = await videoToFrames(source, {
          ...options,
          signal: controller.signal,
          onProgress: (progress) => {
            setState((prev) => ({ ...prev, extractionProgress: progress }));
          },
        });

        resultRef.current = result;
        setState((prev) => ({
          ...prev,
          status: "ready",
          frames: result.frames,
          video: result.video,
          totalSizeBytes: result.totalSizeBytes,
        }));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setState(initialState);
          return;
        }
        setState((prev) => ({
          ...prev,
          status: "error",
          error: err instanceof Error ? err.message : "Something went wrong extracting frames.",
        }));
      }
    },
    [disposeCurrent],
  );

  const compileZip = useCallback(async (zipOptions?: Omit<ZipOptions, "onProgress">) => {
    if (!resultRef.current) return;

    setState((prev) => ({ ...prev, status: "zipping", zipProgress: null }));

    try {
      const zip = await resultRef.current.toZip({
        ...zipOptions,
        onProgress: (progress) => {
          setState((prev) => ({ ...prev, zipProgress: progress }));
        },
      });
      zipResultRef.current = zip;
      setState((prev) => ({ ...prev, status: "zip-ready", zipResult: zip }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: err instanceof Error ? err.message : "Something went wrong compiling the zip.",
      }));
    }
  }, []);

  return { ...state, extract, compileZip, reset };
}
