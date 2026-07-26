import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { SlugGeneratorTool } from "@/features/slug-generator";

export const metadata: Metadata = {
  title: "Slug Generator - Workbench",
  description: "Convert headings and titles into URL-safe slugs.",
};

export default function SlugGeneratorPage() {
  return (
    <ToolPageShell
      slug="slug-generator"
      title="Slug Generator"
      description="Turn titles and headings into lowercase, URL-safe slugs with hyphens and no punctuation."
    >
      <SlugGeneratorTool />
    </ToolPageShell>
  );
}
