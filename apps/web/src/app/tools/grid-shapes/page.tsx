import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { GridShapesTool } from "@/features/grid-shapes";

export const metadata: Metadata = {
  title: "Grid Shapes \u2014 Workbench",
  description: "Paint a grid of cells and get back a smooth SVG outline, with every corner \u2014 convex and concave \u2014 rounded automatically.",
};

export default function GridShapesPage() {
  return (
    <ToolPageShell
      title="Grid Shapes"
      description="Paint cells on a grid \u2014 click, or drag like a brush \u2014 and get back a single smooth SVG path. Every outer corner rounds automatically, every inner notch rounds too, with a radius you can set globally or per cell."
    >
      <GridShapesTool />
    </ToolPageShell>
  );
}
