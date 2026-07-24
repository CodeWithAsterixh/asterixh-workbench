import type { Metadata } from "next";
import { Reveal } from "@/lib/animations";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Tools \u2014 Workbench",
  description: "Every tool on Workbench, in one place.",
};

export default function ToolsPage() {
  return (
    <section data-theme="shell" className="pt-48 pb-36">
      <div className="container">
        <Reveal>
          <span className="eyebrow">All tools</span>
          <h1 className="text-display-lg mt-8 max-w-3xl">The whole bench, in one place</h1>
          <p className="lead mt-8">
            One tool live today. A couple more are on the bench, built on the same
            client-side-only foundation.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          {tools.map((tool, i) => (
            <Reveal key={tool.slug} delay={i * 0.06}>
              <ToolCard tool={tool} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
