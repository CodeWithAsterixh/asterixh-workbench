import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { ImageCompressorTool } from "@/features/image-compressor";

export const metadata: Metadata = {
  title: "Image Compressor \u2014 Workbench",
  description: "Batch-compress images client-side with a live before/after size comparison.",
};

export default function ImageCompressorPage() {
  return (
    <ToolPageShell
      title="Image Compressor"
      description="Drop in a batch of images, pick a format and quality, and see exactly how much smaller each one gets \u2014 before you download anything."
    >
      <ImageCompressorTool />
    </ToolPageShell>
  );
}
