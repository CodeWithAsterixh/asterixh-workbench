import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/ToolPageShell";
import { getTool } from "@/data/tools";
import { getToolView } from "@/data/tool-renders";

interface ToolRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ToolRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Workbench`,
    description: tool.description,
  };
}

export default async function ToolRoutePage({ params }: ToolRouteProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  const ToolView = tool ? getToolView(tool) : undefined;

  if (!tool || !ToolView) notFound();

  return (
    <ToolPageShell slug={slug} title={tool.name} description={tool.description}>
      <ToolView />
    </ToolPageShell>
  );
}
