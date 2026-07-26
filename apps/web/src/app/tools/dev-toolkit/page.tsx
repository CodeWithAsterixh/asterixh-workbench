import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { DevToolkitTool } from "@/features/dev-toolkit";

export const metadata: Metadata = {
  title: "Dev Toolkit — Workbench",
  description: "Base64 encode/decode, SHA hashing, and UUID generation in one place.",
};

export default function DevToolkitPage() {
  return (
    <ToolPageShell
      slug="dev-toolkit"
      title="Dev Toolkit"
      description="Base64, SHA-1/256/384/512 hashing, and UUID generation — three small utilities that belong in one tab, not three."
    >
      <DevToolkitTool />
    </ToolPageShell>
  );
}
