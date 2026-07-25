import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { DesignTokensTool } from "@/features/design-tokens";

export const metadata: Metadata = {
  title: "Design Token Extractor — Workbench",
  description: "Extract a dominant color palette from an image and export it as CSS, Tailwind, or JSON.",
};

export default function DesignTokensPage() {
  return (
    <ToolPageShell
      title="Design Token Extractor"
      description="Drop in an image and pull out its dominant colors — export as CSS custom properties, a Tailwind config snippet, or plain JSON."
    >
      <DesignTokensTool />
    </ToolPageShell>
  );
}
