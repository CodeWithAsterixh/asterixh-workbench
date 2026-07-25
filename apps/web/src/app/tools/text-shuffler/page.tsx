import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { TextShufflerTool } from "@/features/text-shuffler";

export const metadata: Metadata = {
  title: "Text Shuffler \u2014 Workbench",
  description: "Split text on any delimiter, shuffle the pieces, and rejoin them into a new order.",
};

export default function TextShufflerPage() {
  return (
    <ToolPageShell
      title="Text Shuffler"
      description="Pick a delimiter \u2014 a comma, a period, a space, anything \u2014 split your text into pieces on it, shuffle them, and rejoin with the same delimiter."
    >
      <TextShufflerTool />
    </ToolPageShell>
  );
}
