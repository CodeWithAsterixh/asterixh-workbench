import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { RegexTesterTool } from "@/features/regex-tester";

export const metadata: Metadata = {
  title: "Regex Tester \u2014 Workbench",
  description: "Test a regular expression against sample text with live match highlighting.",
};

export default function RegexTesterPage() {
  return (
    <ToolPageShell
      title="Regex Tester"
      description="Write a pattern, toggle flags, and see every match highlighted live \u2014 with capture groups broken out below."
    >
      <RegexTesterTool />
    </ToolPageShell>
  );
}
