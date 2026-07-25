import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { FaviconGeneratorTool } from "@/features/favicon-generator";

export const metadata: Metadata = {
  title: "Favicon Generator — Workbench",
  description: "Generate a full favicon and app-icon set from one image, zipped with a manifest.",
};

export default function FaviconGeneratorPage() {
  return (
    <ToolPageShell
      title="Favicon Generator"
      description="Drop in one image and get back every size you actually need — browser tab, iOS home screen, Android, PWA — plus a manifest and copy-paste HTML, all in one zip."
    >
      <FaviconGeneratorTool />
    </ToolPageShell>
  );
}
