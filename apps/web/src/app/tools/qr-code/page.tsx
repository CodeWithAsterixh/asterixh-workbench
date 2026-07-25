import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { QrCodeTool } from "@/features/qr-code";

export const metadata: Metadata = {
  title: "QR Code Generator \u2014 Workbench",
  description: "Generate a downloadable QR code from text or a link, as PNG or SVG.",
};

export default function QrCodePage() {
  return (
    <ToolPageShell
      title="QR Code Generator"
      description="Text or a link in, a downloadable QR code out \u2014 adjust error correction, size, and colors, and export as PNG or SVG."
    >
      <QrCodeTool />
    </ToolPageShell>
  );
}
