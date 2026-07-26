import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { RegexTesterTool } from "@/features/regex-tester";

export const metadata: Metadata = {
  title: "Regex Tester — Workbench",
  description: "Test a regular expression against sample text with live match highlighting.",
};

export default function RegexTesterPage() {
  return (
    <ToolPageShell
      slug="regex-tester"
      title="Regex Tester"
      description="Write a pattern, toggle flags, and see every match highlighted live — with capture groups broken out below."
    >
      <RegexTesterTool />
    </ToolPageShell>
  );
}
