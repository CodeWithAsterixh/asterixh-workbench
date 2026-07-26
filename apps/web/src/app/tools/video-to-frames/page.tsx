import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoToFramesTool } from "@/features/video-to-frames";

export const metadata: Metadata = {
  title: "Video →Frames — Workbench",
  description:
    "Turn a video into a preloaded, zip-ready frame sequence — entirely in your browser. No upload, nothing leaves your machine.",
};

export default function VideoToFramesPage() {
  return (
    <ToolPageShell
      slug="video-to-frames"
      title="Video →Frames"
      description="Drop in a video, pick a frame count, and get back a preloaded set of frames — trimmed, sized, and ready to compile into a single .zip. Runs entirely in your browser; nothing is uploaded."
    >
      <VideoToFramesTool />
    </ToolPageShell>
  );
}
