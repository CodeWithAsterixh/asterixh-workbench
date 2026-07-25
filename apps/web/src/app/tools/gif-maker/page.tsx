import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { GifMakerTool } from "@/features/gif-maker";

export const metadata: Metadata = {
  title: "GIF Maker \u2014 Workbench",
  description: "Turn a batch of images into a looping animated GIF, entirely in your browser.",
};

export default function GifMakerPage() {
  return (
    <ToolPageShell
      title="GIF Maker"
      description="Drop in a batch of images, order them, set the delay and loop, and export an animated GIF \u2014 no upload, no server round-trip."
    >
      <GifMakerTool />
    </ToolPageShell>
  );
}
