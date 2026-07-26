import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { UuidGeneratorTool } from "@/features/uuid-generator";

export const metadata: Metadata = {
  title: "UUID Generator - Workbench",
  description: "Generate a batch of UUIDs locally in your browser.",
};

export default function UuidGeneratorPage() {
  return (
    <ToolPageShell
      slug="uuid-generator"
      title="UUID Generator"
      description="Create any number of RFC 4122 version 4 UUIDs locally in your browser, then copy the full batch for test data, fixtures, or identifiers."
    >
      <UuidGeneratorTool />
    </ToolPageShell>
  );
}
