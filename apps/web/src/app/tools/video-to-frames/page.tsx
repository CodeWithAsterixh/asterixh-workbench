import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoToFramesTool } from "@/features/video-to-frames";

export const metadata: Metadata = {
  title: "Video \u2192 Frames \u2014 Workbench",
  description:
    "Turn a video into a preloaded, zip-ready frame sequence \u2014 entirely in your browser. No upload, nothing leaves your machine.",
};

export default function VideoToFramesPage() {
  return (
    <ToolPageShell
      title="Video \u2192 Frames"
      description="Drop in a video, pick a frame count, and get back a preloaded set of frames \u2014 trimmed, sized, and ready to compile into a single .zip. Runs entirely in your browser; nothing is uploaded."
    >
      <VideoToFramesTool />
    </ToolPageShell>
  );
}
