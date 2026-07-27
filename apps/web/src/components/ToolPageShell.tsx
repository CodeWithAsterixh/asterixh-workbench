import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/lib/animations";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { howItWorks } from "@/data/how-it-works";
import { getTool } from "@/data/tools";

interface ToolPageShellProps {
  title: string;
  description: string;
  badge?: string;
  /** Tool registry slug — looks up this tool's Input/Output/Steps content. */
  slug?: string;
  children: ReactNode;
}

/**
 * Every tool page shares this shape: a dark "shell" hero (breadcrumb, title,
 * description), a light "paper" workspace holding the actual tool UI, and —
 * when a slug is given — a "How it works" section (input, output, steps)
 * back on the dark shell. See tokens-color.css for why the theme flips here.
 */
export function ToolPageShell({ title, description, badge = "Live", slug, children }: ToolPageShellProps) {
  const cleanTitle = JSON.parse(`"${title}"`);
  const details = slug ? howItWorks[slug] : undefined;
  const tool = slug ? getTool(slug) : undefined;

  return (
    <>
      <section data-theme="shell" className="pt-48 pb-28">
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <nav className="timecode mb-8" aria-label="Breadcrumb">
              <Link href="/tools" className="hover:text-(--text-primary) transition-colors">
                Tools
              </Link>{" "}
              / {title}
            </nav>
            <span className="badge badge--live w-fit">{badge}</span>
            <h1 className="text-display-lg mt-8 max-w-3xl">{cleanTitle}</h1>
            <p className="lead mt-8">{description}</p>
          </Reveal>
        </div>
      </section>

      <div data-theme="paper">
        <section className="section--tight" style={{ background: "var(--surface)", color: "var(--text-primary)" }}>
          <div className="container">
            <div className="text-[var(--text-primary)]">{children}</div>
          </div>
        </section>
      </div>

      {details && tool && (
        <HowItWorksSection tool={tool} input={details.input} output={details.output} steps={details.steps} />
      )}
    </>
  );
}
