import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { GridShapesTool } from "@/features/grid-shapes";

export const metadata: Metadata = {
  title: "Grid Shapes — Workbench",
  description: "Paint a grid of cells and get back a smooth SVG outline, with every corner — convex and concave — rounded automatically.",
};

export default function GridShapesPage() {
  return (
    <ToolPageShell
      slug="grid-shapes"
      title="Grid Shapes"
      description="Paint cells on a grid — click, or drag like a brush — and get back a single smooth SVG path. Every outer corner rounds automatically, every inner notch rounds too, with a radius you can set globally or per cell."
    >
      <GridShapesTool />
    </ToolPageShell>
  );
}
