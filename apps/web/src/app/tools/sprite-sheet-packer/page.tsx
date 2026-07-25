import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { SpriteSheetPackerTool } from "@/features/sprite-sheet-packer";

export const metadata: Metadata = {
  title: "Sprite Sheet Packer — Workbench",
  description: "Pack a batch of images into one sprite sheet plus a JSON frame manifest.",
};

export default function SpriteSheetPackerPage() {
  return (
    <ToolPageShell
      title="Sprite Sheet Packer"
      description="Drop in a batch of images and get back one packed sheet plus a JSON manifest with exact frame coordinates — for game dev or CSS sprite animation."
    >
      <SpriteSheetPackerTool />
    </ToolPageShell>
  );
}
