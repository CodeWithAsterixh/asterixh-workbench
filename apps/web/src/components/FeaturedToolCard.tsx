import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import type { ToolSpec } from "@/data/tools";
import { getCategory } from "@/data/categories";
import { howItWorks } from "@/data/how-it-works";

export function FeaturedToolCard({ tool }: { tool: ToolSpec }) {
  const category = getCategory(tool.category);
  const details = howItWorks[tool.slug];

  return (
    <Link
      href={tool.href}
      data-cursor="link"
      className="card h-full flex flex-col justify-between group transition-colors duration-300 hover:border-[var(--accent)]"
    >
      <div>
        <span className="timecode">{category.label}</span>
        <h3 className="mt-4 mb-2" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>
          {tool.name}
        </h3>
        <p className="text-secondary text-sm">{tool.tagline}</p>
      </div>

      {details && (
        <div className="mt-6 pt-6 flex flex-col gap-3" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-start gap-2">
            <ArrowDownToLine size={13} strokeWidth={1.75} className="mt-0.5 flex-shrink-0 text-[var(--accent-secondary)]" />
            <span className="text-xs text-secondary leading-relaxed">{details.input}</span>
          </div>
          <div className="flex items-start gap-2">
            <ArrowUpFromLine size={13} strokeWidth={1.75} className="mt-0.5 flex-shrink-0 text-[var(--accent)]" />
            <span className="text-xs text-secondary leading-relaxed">{details.output}</span>
          </div>
        </div>
      )}
    </Link>
  );
}
