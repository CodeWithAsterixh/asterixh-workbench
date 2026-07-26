import type { Metadata } from "next";
import { Reveal } from "@/lib/animations";
import { ToolCard } from "@/components/ToolCard";
import { categories } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";

export const metadata: Metadata = {
  title: "Tools — Workbench",
  description: "Every tool on Workbench, grouped by category.",
};

export default function ToolsPage() {
  return (
    <section data-theme="shell" className="pt-48 pb-36">
      <div className="container flex flex-col gap-5">
        <Reveal className="flex flex-col gap-5">
          <span className="eyebrow">All tools</span>
          <h1 className="text-display-lg mt-8 max-w-3xl">The whole bench, in one place</h1>
          <p className="lead mt-8">
            Fourteen tools live today, grouped by what they do — each built on the same
            client-side-only foundation.
          </p>
        </Reveal>

        <div className="flex flex-col gap-20 mt-20">
          {categories.map((category) => {
            const categoryTools = toolsByCategory(category.id);
            if (categoryTools.length === 0) return null;
            return (
              <div key={category.id} id={category.id} style={{ scrollMarginTop: "var(--header-height)" }}>
                <Reveal>
                  <span className="eyebrow">{category.label}</span>
                  <p className="text-secondary text-sm mt-3 max-w-md">{category.description}</p>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {categoryTools.map((tool, i) => (
                    <Reveal key={tool.slug} delay={i * 0.05}>
                      <ToolCard tool={tool} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
