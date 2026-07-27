import type { Metadata } from "next";
import { Reveal } from "@/lib/animations";
import { ToolCard } from "@/components/ToolCard";
import { categories } from "@/data/categories";
import { tools, toolsByCategory } from "@/data/tools";

export const metadata: Metadata = {
  title: "Tools - Workbench",
  description: "Browse the current Workbench tool catalog.",
};

const metrics = [
  { value: tools.length, label: "Live tools" },
  { value: categories.length, label: "Current categories" },
  { value: 0, label: "Login walls" },
];

export default function ToolsPage() {
  return (
    <section data-theme="shell" className="pt-48 pb-36">
      <div className="container flex flex-col gap-6">
        <Reveal className="flex flex-col gap-5">
          <span className="eyebrow">Current bench</span>
          <h1 className="text-display-lg mt-4 max-w-3xl">All live tools, grouped by category.</h1>
          <p className="lead mt-6 max-w-3xl">
            Browse the live catalog, jump to a category, and open any tool that fits the job you
            need right now.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3 mt-6">
          {metrics.map((metric) => (
            <Reveal key={metric.label}>
              <div className="card">
                <span className="text-display-md font-mono">{metric.value}</span>
                <p className="text-secondary text-sm mt-2">{metric.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-col gap-20 mt-14">
          {categories.map((category) => {
            const categoryTools = toolsByCategory(category.id);
            if (categoryTools.length === 0) return null;
            return (
              <div
                key={category.id}
                id={category.id}
                style={{ scrollMarginTop: "var(--header-height)" }}
              >
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
