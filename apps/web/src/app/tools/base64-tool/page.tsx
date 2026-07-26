import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { Base64Tool } from "@/features/base64-tool";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder - Workbench",
  description: "Encode and decode Base64 directly in your browser.",
};

export default function Base64ToolPage() {
  return (
    <ToolPageShell
      slug="base64-tool"
      title="Base64 Encoder/Decoder"
      description="Convert plain text to Base64 or decode Base64 back to readable text using nothing but your browser."
    >
      <Base64Tool />
    </ToolPageShell>
  );
}
