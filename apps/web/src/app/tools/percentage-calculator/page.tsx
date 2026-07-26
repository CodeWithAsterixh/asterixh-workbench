import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { PercentageCalculatorTool } from "@/features/percentage-calculator";

export const metadata: Metadata = {
  title: "Percentage Calculator - Workbench",
  description: "Calculate percentage values, increases, and decreases in your browser.",
};

export default function PercentageCalculatorPage() {
  return (
    <ToolPageShell
      slug="percentage-calculator"
      title="Percentage Calculator"
      description="Find a raw percentage, increase an amount, or decrease it without leaving the browser."
    >
      <PercentageCalculatorTool />
    </ToolPageShell>
  );
}
