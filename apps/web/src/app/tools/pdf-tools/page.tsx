import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { PdfToolsTool } from "@/features/pdf-tools";

export const metadata: Metadata = {
  title: "PDF Split & Merge \u2014 Workbench",
  description: "Merge multiple PDFs into one, or split a PDF into individual pages \u2014 entirely in your browser.",
};

export default function PdfToolsPage() {
  return (
    <ToolPageShell
      title="PDF Split & Merge"
      description="Combine PDFs into one file in whatever order you choose, or break a PDF apart into individual pages. No upload \u2014 the file never leaves your browser."
    >
      <PdfToolsTool />
    </ToolPageShell>
  );
}
