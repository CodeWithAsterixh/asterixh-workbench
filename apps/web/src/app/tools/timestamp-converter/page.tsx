import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { TimestampConverterTool } from "@/features/timestamp-converter";

export const metadata: Metadata = {
  title: "Timestamp Converter - Workbench",
  description: "Convert between local dates, UTC strings, and Unix timestamps.",
};

export default function TimestampConverterPage() {
  return (
    <ToolPageShell
      slug="timestamp-converter"
      title="Timestamp Converter"
      description="Convert between local date and time, UTC output, Unix seconds, and Unix milliseconds in both directions."
    >
      <TimestampConverterTool />
    </ToolPageShell>
  );
}
