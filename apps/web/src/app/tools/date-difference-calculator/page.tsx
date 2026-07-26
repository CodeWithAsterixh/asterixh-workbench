import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { DateDifferenceTool } from "@/features/date-difference";

export const metadata: Metadata = {
  title: "Date Difference Calculator - Workbench",
  description: "Measure the span between two dates in your browser.",
};

export default function DateDifferenceCalculatorPage() {
  return (
    <ToolPageShell
      slug="date-difference-calculator"
      title="Date Difference Calculator"
      description="Compare two local timestamps and see the difference in days, hours, minutes, and seconds."
    >
      <DateDifferenceTool />
    </ToolPageShell>
  );
}
