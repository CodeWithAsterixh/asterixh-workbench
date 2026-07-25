import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/lib/animations";

interface ToolPageShellProps {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
}

/**
 * Every tool page shares this shape: a dark "shell" hero (breadcrumb, title,
 * description) followed by a light "paper" workspace holding the actual
 * tool UI. See tokens-color.css for why the theme flips here specifically.
 */
export function ToolPageShell({ title, description, badge = "Live", children }: ToolPageShellProps) {
  const cleanTitle = JSON.parse(`"${title}"`);

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
        <section className="section--tight" style={{ background: "var(--surface)" }}>
          <div className="container">{children}</div>
        </section>
      </div>
    </>
  );
}
