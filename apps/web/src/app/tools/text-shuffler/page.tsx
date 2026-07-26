import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { TextShufflerTool } from "@/features/text-shuffler";

export const metadata: Metadata = {
  title: "Text Shuffler — Workbench",
  description: "Split text on any delimiter, shuffle the pieces, and rejoin them into a new order.",
};

export default function TextShufflerPage() {
  return (
    <ToolPageShell
      slug="text-shuffler"
      title="Text Shuffler"
      description="Pick a delimiter — a comma, a period, a space, anything — split your text into pieces on it, shuffle them, and rejoin with the same delimiter."
    >
      <TextShufflerTool />
    </ToolPageShell>
  );
}
