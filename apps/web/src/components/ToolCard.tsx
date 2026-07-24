import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolSpec } from "@/data/tools";

export function ToolCard({ tool }: { tool: ToolSpec }) {
  const isLive = tool.status === "live";

  const cardBody = (
    <div
      className={cn(
        "card h-full flex flex-col gap-2 justify-between transition-colors duration-300 group",
        isLive ? "hover:border-[var(--accent)]" : "opacity-70",
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className={cn("badge", isLive ? "badge--live" : "")}>
            {isLive ? "Live" : "In the works"}
          </span>
          {isLive && (
            <ArrowUpRight
              size={18}
              strokeWidth={1.5}
              className="text-[var(--text-tertiary)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]"
            />
          )}
        </div>

        <h3 className="text-display-sm mt-8 mb-3" style={{ fontSize: "1.5rem" }}>
          {tool.name}
        </h3>
        <p className="text-secondary text-sm">{tool.tagline}</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-10">
        {tool.tags.map((tag) => (
          <span key={tag} className="timecode uppercase">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  if (!isLive) {
    return <div aria-disabled="true">{cardBody}</div>;
  }

  return (
    <Link href={tool.href} data-cursor="link" className="block h-full">
      {cardBody}
    </Link>
  );
}
