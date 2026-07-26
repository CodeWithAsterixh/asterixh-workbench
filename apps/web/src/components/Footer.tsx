import Link from "next/link";
import { categories } from "@/data/categories";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-theme="shell" className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container section--tight grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-14">
        <div>
          <span className="font-serif text-lg text-[var(--text-primary)]">Workbench</span>
          <p className="text-secondary text-sm mt-4 max-w-xs">
            A browser-first tools platform designed to scale from a small starter bench into a
            much larger cluster of fast, private, accessible utilities.
          </p>
        </div>

        <div>
          <span className="eyebrow">Explore</span>
          <ul className="mt-5 grid grid-cols-1 gap-3">
            <li>
              <Link
                href="/strategy"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Strategy blueprint
              </Link>
            </li>
            <li>
              <Link
                href="/tools"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                All tools
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/tools#${category.id}`}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="eyebrow">Launch rules</span>
          <p className="timecode mt-5 leading-relaxed">
            No login required
            <br />
            No ads in phase 1
            <br />
            Browser processing first
          </p>
        </div>
      </div>

      <div className="container pb-10 flex items-center justify-between">
        <span className="timecode">&copy; {year} Workbench</span>
        <span className="timecode">Built for a larger tool platform</span>
      </div>
    </footer>
  );
}
