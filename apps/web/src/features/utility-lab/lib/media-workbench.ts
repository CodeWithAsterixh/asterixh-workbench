"use client";

import { canvasToBlob } from "@/lib/canvas-utils";
import { compileToZip } from "@/lib/browser-zip";

export type MediaKind = "video" | "audio";

export type VideoMode = "convert" | "trim" | "crop" | "resize" | "reverse" | "audio-extract";
export type AudioMode = "convert" | "trim" | "boost" | "noise-reduction" | "join" | "split";

export interface MediaWorkbenchOptions {
  start: number;
  end: number;
  width: number;
  height: number;
  fps: number;
  outputMime: string;
  gain: number;
  chunks: number;
}

export interface MediaWorkbenchResult {
  kind: "file" | "zip";
  filename: string;
  blob?: Blob;
  zip?: Awaited<ReturnType<typeof compileToZip>>;
  note?: string;
}

function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");
  return ctx;
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function pickMediaMimeType(kind: MediaKind, preferred: string): string {
  const videoChoices = [preferred, "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  const audioChoices = [preferred, "audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/ogg"];
  const choices = kind === "video" ? videoChoices : audioChoices;
  return choices.find((mime) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) ?? choices[choices.length - 1]!;
}

function extensionForMime(mimeType: string): string {
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("mpeg")) return "mp3";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  return "dat";
}

function toWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);
  let offset = 0;

  const writeString = (value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset++, value.charCodeAt(i));
  };
  const writeUint32 = (value: number) => {
    view.setUint32(offset, value, true);
    offset += 4;
  };
  const writeUint16 = (value: number) => {
    view.setUint16(offset, value, true);
    offset += 2;
  };

  writeString("RIFF");
  writeUint32(length - 8);
  writeString("WAVE");
  writeString("fmt ");
  writeUint32(16);
  writeUint16(1);
  writeUint16(numChannels);
  writeUint32(sampleRate);
  writeUint32(sampleRate * numChannels * 2);
  writeUint16(numChannels * 2);
  writeUint16(16);
  writeString("data");
  writeUint32(buffer.length * numChannels * 2);

  const channels = Array.from({ length: numChannels }, (_, index) => buffer.getChannelData(index));
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel]![i]!));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const audioContext = new AudioContext();
  const buffer = await file.arrayBuffer();
  return await audioContext.decodeAudioData(buffer.slice(0));
}

function cloneAudioBuffer(buffer: AudioBuffer, transform?: (sample: number) => number): AudioBuffer {
  const audioContext = new AudioContext();
  const clone = audioContext.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const source = buffer.getChannelData(channel);
    const target = clone.getChannelData(channel);
    for (let i = 0; i < source.length; i++) {
      target[i] = transform ? transform(source[i]!) : source[i]!;
    }
  }
  return clone;
}

function applyGain(buffer: AudioBuffer, gain: number): AudioBuffer {
  return cloneAudioBuffer(buffer, (sample) => sample * gain);
}

function applyNoiseReduction(buffer: AudioBuffer): AudioBuffer {
  const output = cloneAudioBuffer(buffer);
  for (let channel = 0; channel < output.numberOfChannels; channel++) {
    const data = output.getChannelData(channel);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const next = data[i]!;
      data[i] = next * 0.82 + last * 0.18;
      last = next;
    }
  }
  return output;
}

function sliceAudioBuffer(buffer: AudioBuffer, startSeconds: number, endSeconds: number): AudioBuffer {
  const start = Math.max(0, Math.floor(startSeconds * buffer.sampleRate));
  const end = Math.max(start + 1, Math.min(buffer.length, Math.floor(endSeconds * buffer.sampleRate)));
  const audioContext = new AudioContext();
  const sliced = audioContext.createBuffer(buffer.numberOfChannels, end - start, buffer.sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    sliced.getChannelData(channel)!.set(buffer.getChannelData(channel)!.slice(start, end));
  }
  return sliced;
}

function concatAudioBuffers(buffers: AudioBuffer[]): AudioBuffer {
  if (buffers.length === 0) throw new Error("Add at least one audio file.");
  const sampleRate = buffers[0]!.sampleRate;
  const channels = buffers[0]!.numberOfChannels;
  const totalLength = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
  const audioContext = new AudioContext();
  const merged = audioContext.createBuffer(channels, totalLength, sampleRate);
  for (let channel = 0; channel < channels; channel++) {
    let offset = 0;
    const target = merged.getChannelData(channel);
    for (const buffer of buffers) {
      target.set(buffer.getChannelData(channel)!, offset);
      offset += buffer.length;
    }
  }
  return merged;
}

function splitAudioBuffer(buffer: AudioBuffer, chunks: number): AudioBuffer[] {
  const count = Math.max(1, chunks);
  const chunkLength = Math.ceil(buffer.length / count);
  const audioContext = new AudioContext();
  const pieces: AudioBuffer[] = [];
  for (let i = 0; i < count; i++) {
    const start = i * chunkLength;
    const end = Math.min(buffer.length, start + chunkLength);
    const piece = audioContext.createBuffer(buffer.numberOfChannels, Math.max(1, end - start), buffer.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      piece.getChannelData(channel)!.set(buffer.getChannelData(channel)!.slice(start, end));
    }
    pieces.push(piece);
  }
  return pieces;
}

function getVideoStream(video: HTMLVideoElement): MediaStream | null {
  const element = video as HTMLVideoElement & {
    captureStream?: () => MediaStream;
    mozCaptureStream?: () => MediaStream;
    webkitCaptureStream?: () => MediaStream;
  };
  return element.captureStream?.() ?? element.mozCaptureStream?.() ?? element.webkitCaptureStream?.() ?? null;
}

async function exportAudioBuffer(buffer: AudioBuffer, mimeType: string) {
  if (mimeType === "audio/wav") {
    return toWavBlob(buffer);
  }

  const safeMime = pickMediaMimeType("audio", mimeType);
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(destination);

  const recorder = new MediaRecorder(destination.stream, { mimeType: safeMime });
  const chunks: BlobPart[] = [];
  const done = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => event.data.size > 0 && chunks.push(event.data);
    recorder.onerror = () => reject(new Error("Audio recording failed."));
    recorder.onstop = () => resolve(new Blob(chunks, { type: safeMime }));
  });

  await audioContext.resume();
  recorder.start();
  source.start();
  await new Promise<void>((resolve) => {
    source.onended = () => resolve();
  });
  recorder.stop();
  return await done;
}

interface LoadedVideo {
  video: HTMLVideoElement;
  revoke: () => void;
}

async function loadVideo(file: File): Promise<LoadedVideo> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = url;
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error(`Couldn't load "${file.name}".`));
    });
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
  return {
    video,
    revoke: () => URL.revokeObjectURL(url),
  };
}

async function seek(video: HTMLVideoElement, time: number) {
  await new Promise<void>((resolve) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      resolve();
    };
    video.addEventListener("seeked", onSeeked);
    video.currentTime = Math.max(0, Math.min(video.duration || time, time));
  });
}

async function recordVideoFrameSequence(
  video: HTMLVideoElement,
  options: MediaWorkbenchOptions,
  drawFrame: (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => void,
  reverse = false,
): Promise<Blob> {
  const fps = Math.max(1, options.fps);
  const start = Math.max(0, Math.min(video.duration, options.start));
  const end = Math.max(start + 0.1, Math.min(video.duration, options.end || video.duration));
  const duration = end - start;
  const totalFrames = Math.max(1, Math.ceil(duration * fps));
  const canvas = createCanvas(options.width, options.height);
  const ctx = getContext(canvas);
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType: pickMediaMimeType("video", options.outputMime) });
  const chunks: BlobPart[] = [];
  const done = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => event.data.size > 0 && chunks.push(event.data);
    recorder.onerror = () => reject(new Error("Video recording failed."));
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType }));
  });

  recorder.start();
  const audioStream = getVideoStream(video);
  if (!audioStream) {
    await video.play();
    const frameDuration = 1 / fps;
    for (let frame = 0; frame < totalFrames; frame++) {
      const t = reverse ? end - frame * frameDuration : start + frame * frameDuration;
      await seek(video, t);
      drawFrame(ctx, video);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    }
    await video.pause();
    recorder.stop();
    return await done;
  }
  const audioTracks = audioStream.getAudioTracks();
  if (audioTracks.length > 0 && !reverse) {
    const merged = new MediaStream([...stream.getVideoTracks(), ...audioTracks]);
    recorder.stop();
    const audioRecorder = new MediaRecorder(merged, { mimeType: recorder.mimeType });
    const videoChunks: BlobPart[] = [];
    const audioDone = new Promise<Blob>((resolve, reject) => {
      audioRecorder.ondataavailable = (event) => event.data.size > 0 && videoChunks.push(event.data);
      audioRecorder.onerror = () => reject(new Error("Video recording failed."));
      audioRecorder.onstop = () => resolve(new Blob(videoChunks, { type: audioRecorder.mimeType }));
    });
    audioRecorder.start();
    await video.play();
    const frameDuration = 1 / fps;
    for (let frame = 0; frame < totalFrames; frame++) {
      const t = reverse ? end - frame * frameDuration : start + frame * frameDuration;
      await seek(video, t);
      drawFrame(ctx, video);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    }
    audioRecorder.stop();
    await video.pause();
    return await audioDone;
  }

  await seek(video, reverse ? end : start);
  await video.play();
  const frameDuration = 1 / fps;

  for (let frame = 0; frame < totalFrames; frame++) {
    const t = reverse ? end - frame * frameDuration : start + frame * frameDuration;
    await seek(video, t);
    drawFrame(ctx, video);
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  }

  await video.pause();
  recorder.stop();
  return await done;
}

async function convertVideo(file: File, options: MediaWorkbenchOptions, mode: VideoMode): Promise<Blob> {
  const loaded = await loadVideo(file);
  const video = loaded.video;
  try {
    const sourceWidth = video.videoWidth || options.width;
    const sourceHeight = video.videoHeight || options.height;
    const width = mode === "resize" ? options.width || sourceWidth : sourceWidth;
    const height = mode === "resize" ? options.height || sourceHeight : sourceHeight;
    const cropWidth = Math.min(sourceWidth, options.width || sourceWidth);
    const cropHeight = Math.min(sourceHeight, options.height || sourceHeight);

    const drawFrame = (ctx: CanvasRenderingContext2D, currentVideo: HTMLVideoElement) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (mode === "crop") {
        const sx = Math.max(0, Math.round((sourceWidth - cropWidth) / 2));
        const sy = Math.max(0, Math.round((sourceHeight - cropHeight) / 2));
        ctx.drawImage(currentVideo, sx, sy, cropWidth, cropHeight, 0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
      }
      if (mode === "resize") {
        ctx.drawImage(currentVideo, 0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
      }
      ctx.drawImage(currentVideo, 0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    if (mode === "reverse") {
      return await recordVideoFrameSequence(video, { ...options, width, height }, drawFrame, true);
    }

    const canvas = createCanvas(width, height);
    const ctx = getContext(canvas);
    const stream = canvas.captureStream(Math.max(1, options.fps));

    const audioStream = getVideoStream(video);
    const audioTracks = audioStream?.getAudioTracks() ?? [];
    const merged = audioTracks.length > 0 ? new MediaStream([...stream.getVideoTracks(), ...audioTracks]) : stream;
    const mimeType = pickMediaMimeType("video", options.outputMime);
    const videoRecorder = new MediaRecorder(merged, { mimeType });
    const videoChunks: BlobPart[] = [];
    const final = new Promise<Blob>((resolve, reject) => {
      videoRecorder.ondataavailable = (event) => event.data.size > 0 && videoChunks.push(event.data);
      videoRecorder.onerror = () => reject(new Error("Video recording failed."));
      videoRecorder.onstop = () => resolve(new Blob(videoChunks, { type: videoRecorder.mimeType }));
    });

    videoRecorder.start();
    await seek(video, options.start || 0);
    await video.play();
    const stopAt = Math.min(video.duration, options.end || video.duration);
    while (video.currentTime < stopAt) {
      drawFrame(ctx, video);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    }
    await video.pause();
    videoRecorder.stop();
    return await final;
  } finally {
    loaded.revoke();
  }
}

async function extractAudioFromVideo(file: File, options: MediaWorkbenchOptions): Promise<Blob> {
  const loaded = await loadVideo(file);
  const video = loaded.video;
  try {
    const stream = getVideoStream(video);
    if (!stream) throw new Error("This browser cannot capture media from the video element.");
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) throw new Error("That video doesn't expose an audio track.");
    const audioStream = new MediaStream(audioTracks);
    const mimeType = pickMediaMimeType("audio", options.outputMime);
    const recorder = new MediaRecorder(audioStream, { mimeType });
    const chunks: BlobPart[] = [];
    const done = new Promise<Blob>((resolve, reject) => {
      recorder.ondataavailable = (event) => event.data.size > 0 && chunks.push(event.data);
      recorder.onerror = () => reject(new Error("Audio extraction failed."));
      recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    });
    recorder.start();
    await seek(video, options.start || 0);
    await video.play();
    while (video.currentTime < Math.min(video.duration, options.end || video.duration)) {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    }
    await video.pause();
    recorder.stop();
    return await done;
  } finally {
    loaded.revoke();
  }
}

export async function runMediaWorkbench(
  kind: MediaKind,
  mode: VideoMode | AudioMode,
  files: File[],
  options: MediaWorkbenchOptions,
): Promise<MediaWorkbenchResult> {
  if (kind === "video") {
    const file = files[0];
    if (!file) throw new Error("Add a video file first.");
    if (mode === "audio-extract") {
      const blob = await extractAudioFromVideo(file, options);
      const filename = `audio-extract.${extensionForMime(blob.type || options.outputMime)}`;
      return { kind: "file", filename, blob };
    }
    const blob = await convertVideo(file, options, mode as VideoMode);
    return { kind: "file", filename: `${mode}.${extensionForMime(blob.type || options.outputMime)}`, blob };
  }

  const audioFiles = files;
  if (audioFiles.length === 0) throw new Error("Add at least one audio file.");
  const outputs: { name: string; data: Uint8Array }[] = [];
  if (mode === "join") {
    const buffers = await Promise.all(audioFiles.map((file) => decodeAudioFile(file)));
    const joined = concatAudioBuffers(buffers);
    const blob = await exportAudioBuffer(joined, options.outputMime);
    return { kind: "file", filename: `joined.${extensionForMime(blob.type || options.outputMime)}`, blob };
  }

  if (mode === "split") {
    const buffer = await decodeAudioFile(audioFiles[0]!);
    const pieces = splitAudioBuffer(buffer, options.chunks);
    for (let i = 0; i < pieces.length; i++) {
      const blob = await exportAudioBuffer(pieces[i]!, options.outputMime);
      outputs.push({ name: `segment-${String(i + 1).padStart(2, "0")}.${extensionForMime(blob.type || options.outputMime)}`, data: new Uint8Array(await blob.arrayBuffer()) });
    }
    const zip = await compileToZip(outputs, { filename: "audio-split" });
    return { kind: "zip", filename: zip.filename, zip, note: `${pieces.length} segments` };
  }

  const buffer = await decodeAudioFile(audioFiles[0]!);
  let processed = buffer;
  if (mode === "trim") {
    processed = sliceAudioBuffer(buffer, options.start, options.end || buffer.duration);
  } else if (mode === "boost") {
    processed = applyGain(buffer, options.gain);
  } else if (mode === "noise-reduction") {
    processed = applyNoiseReduction(buffer);
  }
  const blob = await exportAudioBuffer(processed, options.outputMime);
  return { kind: "file", filename: `${mode}.${extensionForMime(blob.type || options.outputMime)}`, blob };
}
