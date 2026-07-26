import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { ContactSheetTool } from "@/features/contact-sheet";

export const metadata: Metadata = {
  title: "Contact Sheet — Workbench",
  description: "Stitch a batch of images into one labeled grid.",
};

export default function ContactSheetPage() {
  return (
    <ToolPageShell
      slug="contact-sheet"
      title="Contact Sheet"
      description="Drop in a batch of images and get back one labeled grid — a quick storyboard or contact sheet, ready to share as a single PNG."
    >
      <ContactSheetTool />
    </ToolPageShell>
  );
}
