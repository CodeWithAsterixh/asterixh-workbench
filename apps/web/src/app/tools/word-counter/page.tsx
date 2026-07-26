import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { WordCounterTool } from "@/features/word-counter";

export const metadata: Metadata = {
  title: "Word Counter - Workbench",
  description: "Count words, characters, paragraphs, sentences, and reading time.",
};

export default function WordCounterPage() {
  return (
    <ToolPageShell
      slug="word-counter"
      title="Word Counter"
      description="Paste in a draft, article, or note and see live counts for words, characters, lines, paragraphs, sentences, and reading time."
    >
      <WordCounterTool />
    </ToolPageShell>
  );
}
