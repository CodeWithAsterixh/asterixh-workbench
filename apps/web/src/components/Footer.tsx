import Link from "next/link";
import { tools } from "@/data/tools";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-theme="shell" className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container section--tight grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-14">
        <div>
          <span className="font-serif text-lg text-[var(--text-primary)]">Workbench</span>
          <p className="text-secondary text-sm mt-4 max-w-xs">
            A growing set of small, sharp tools that run entirely in your browser. Nothing you
            feed them leaves your machine unless you choose to export it.
          </p>
        </div>

        <div>
          <span className="eyebrow">Tools</span>
          <ul className="mt-5 flex flex-col gap-3">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={tool.href}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {tool.name} {" "}
                  {tool.status === "in-progress" && <span className="timecode ml-2">in progress</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="eyebrow">Built with</span>
          <p className="timecode mt-5 leading-relaxed">
            Next.js &middot; Motion &middot; fflate
            <br />
            Video &rarr; Frames ships as <code>@workbench-tools/video-to-frames</code> on npm.
          </p>
        </div>
      </div>

      <div className="container pb-10 flex items-center justify-between">
        <span className="timecode">&copy; {year} Workbench</span>
        <span className="timecode">Every tool runs client-side</span>
      </div>
    </footer>
  );
}
