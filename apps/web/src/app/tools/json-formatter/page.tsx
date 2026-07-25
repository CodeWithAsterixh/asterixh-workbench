import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { JsonFormatterTool } from "@/features/json-formatter";

export const metadata: Metadata = {
  title: "JSON Formatter \u2014 Workbench",
  description: "Format, minify, and validate JSON entirely in your browser.",
};

export default function JsonFormatterPage() {
  return (
    <ToolPageShell
      title="JSON Formatter"
      description="Paste in JSON, format or minify it, and catch syntax errors with a line and column pointer. Nothing you paste here leaves your browser."
    >
      <JsonFormatterTool />
    </ToolPageShell>
  );
}
