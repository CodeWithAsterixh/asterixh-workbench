import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { ColorContrastCheckerTool } from "@/features/color-contrast-checker";

export const metadata: Metadata = {
  title: "Color Contrast Checker - Workbench",
  description: "Check foreground and background color contrast in your browser.",
};

export default function ColorContrastCheckerPage() {
  return (
    <ToolPageShell
      slug="color-contrast-checker"
      title="Color Contrast Checker"
      description="Measure contrast ratios, preview foreground and background pairs, and check WCAG pass or fail states before you ship a design."
    >
      <ColorContrastCheckerTool />
    </ToolPageShell>
  );
}
