import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ArrowRight, BookOpen, AlertCircle, Terminal } from "lucide-react";
import { Reveal } from "@/lib/animations";
import { getTool, tools } from "@/data/tools";
import { getCategory } from "@/data/categories";

interface ArticleRouteProps {
  params: Promise<{ slug: string; articleSlug: string }>;
}

export const dynamicParams = false;

// Enable Static Site Generation (SSG) in Next.js
export function generateStaticParams() {
  const articles = ["best-use-cases", "cleaner-results", "workflow-patterns"];
  return tools.flatMap((tool) =>
    articles.map((articleSlug) => ({
      slug: tool.slug,
      articleSlug,
    }))
  );
}

// Generate tool-specific article content dynamically
function getArticleContent(toolSlug: string, articleSlug: string, toolName: string, categoryLabel: string) {
  const noun = toolName.replace(/\s*[→-]\s*/g, " ");

  if (articleSlug === "best-use-cases") {
    return {
      title: `What ${noun} is best for`,
      tag: "Overview",
      readTime: "3 min read",
      lead: `Learn about the primary workloads, input specifications, and core design use cases where ${toolName} shines.`,
      paragraphs: [
        `${toolName} was built to handle high-performance operations entirely client-side. By leveraging advanced browser APIs, this utility eliminates the need for remote file uploads, protecting your privacy while saving network bandwidth.`,
        `This node is particularly suited for rapid prototyping, batch processing, and assets compilation. It fits seamlessly into modern designer-developer handoff pipelines, allowing you to prepare assets or parse structures without launching heavy external suites.`
      ],
      bulletTitle: "Ideal Input Specifications",
      bullets: [
        "Optimized formats: Web-safe standards (PNG, WebP, SVG, MP4, JSON).",
        "Size boundaries: Safe for large local files since no network uploading occurs.",
        "Pipeline context: Perfect for asset optimization before committing to production."
      ],
      codeTitle: "Sample Input Schema",
      codeLanguage: "json",
      codeSnippet: `{
  "tool": "${toolSlug}",
  "status": "ready",
  "sandbox": true,
  "engine": "WASM_Thread"
}`,
      calloutTitle: "When to choose another tool",
      calloutText: "If your workflow requires persistent cloud hosting or multi-user database collaboration, you should pair this local editor with a cloud database. Workbench utilities focus strictly on fast, local transformations."
    };
  }

  if (articleSlug === "cleaner-results") {
    return {
      title: `How to get cleaner results with ${noun}`,
      tag: "Workflow",
      readTime: "5 min read",
      lead: `Optimize your local file compilation, configure variables, and avoid common errors using these expert workflow tips.`,
      paragraphs: [
        `Getting the best output from ${toolName} depends heavily on how you prepare your input. Large assets should be trimmed or normalized to prevent browser-thread blocking, while structured parameters should align with target framework schemas.`,
        `When using this tool, take advantage of the live preview panel. Since all calculations occur locally, changes render instantly—allowing you to fine-tune quality, padding, and factors iteratively before exporting the final archive.`
      ],
      bulletTitle: "Best Practices for cleaner compiles",
      bullets: [
        "Format check: Verify that file headers are clean and uncorrupted.",
        "Iterative tuning: Adjust configurations in small increments and watch the live preview.",
        "Export caching: Use the copy buttons or batch download zips to save compilations locally."
      ],
      codeTitle: "Developer Configuration Example",
      codeLanguage: "javascript",
      codeSnippet: `// Custom compilation configurations
const config = {
  quality: 0.92,
  targetFormat: "webp",
  minify: true,
  cleanComments: true
};`,
      calloutTitle: "Performance Tip",
      calloutText: "Processing extremely large batches may trigger browser memory warnings. If you experience lags, process items in smaller batches—the local compilation is fast enough that it won't impact your timeline."
    };
  }

  if (articleSlug === "workflow-patterns") {
    return {
      title: `${categoryLabel} patterns around ${noun}`,
      tag: "Related",
      readTime: "4 min read",
      lead: `Explore how to chain ${toolName} with adjacent utilities to construct powerful design-to-code asset pipelines.`,
      paragraphs: [
        `No utility stands completely alone. In modern asset pipelines, the output of one workbench node becomes the input of the next. Understanding how these tools connect is the key to automating your asset pipeline.`,
        `For instance, you can capture color swatches with one utility, convert them to design tokens, and then format the resulting JSON using a code validator. This workflow chain keeps your assets standardized and production-ready.`
      ],
      bulletTitle: "Common Chaining Patterns",
      bullets: [
        "Design Handoff: Extract tokens -> Generate styling variables -> Paste into config files.",
        "Asset Compiling: Compress images -> Create sprite sheets -> Export clean manifests.",
        "Local Auditing: Validate raw outputs -> Clean formatting -> Copy to clipboard."
      ],
      codeTitle: "Pipeline Schema Structure",
      codeLanguage: "json",
      codeSnippet: `{
  "pipeline": "workbench_standard",
  "nodes": [
    { "step": 1, "action": "extract" },
    { "step": 2, "action": "compile" },
    { "step": 3, "action": "export" }
  ]
}`,
      calloutTitle: "Automating workflows",
      calloutText: "All outputs are formatted to follow industry standards. This makes it simple to feed outputs directly into git scripts, build scripts, or terminal watchers."
    };
  }

  return notFound();
}

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  const { slug, articleSlug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const category = getCategory(tool.category);
  const article = getArticleContent(slug, articleSlug, tool.name, category.label);
  
  return {
    title: `${article.title} — ${tool.name} — Workbench`,
    description: article.lead,
  };
}

export default async function ArticleRoutePage({ params }: ArticleRouteProps) {
  const { slug, articleSlug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const category = getCategory(tool.category);
  const article = getArticleContent(slug, articleSlug, tool.name, category.label);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--surface)]">
      {/* Article Header (Dark Theme / Shell) */}
      <section data-theme="shell" className="relative pt-36 pb-20 bg-[var(--surface-sunken)] border-b border-[var(--border)]">
        <div className="container max-w-4xl">
          <Reveal className="flex flex-col gap-6">
            {/* Back Link */}
            <Link
              href={`/tools/${tool.slug}`}
              className="flex items-center gap-2 text-xs font-mono text-secondary hover:text-[var(--accent-secondary)] transition-colors w-fit group"
            >
              <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
              Back to {tool.name} workspace
            </Link>

            {/* Tags & Timecode */}
            <div className="flex items-center gap-4 text-xs timecode">
              <span className="eyebrow text-[var(--accent)] font-semibold" style={{ color: "var(--accent)" }}>{article.tag}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
              <span>•</span>
              <span>Updated July 2026</span>
            </div>

            {/* Title */}
            <h1 className="text-display-lg font-bold leading-tight max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>
              {article.title}
            </h1>

            {/* Lead */}
            <p className="lead text-secondary max-w-2xl text-lg">
              {article.lead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Article Content Body (Light Theme / Paper) */}
      <main data-theme="paper" className="flex-grow bg-[var(--surface)] py-20">
        <article className="container max-w-3xl px-6">
          <Reveal className="flex flex-col gap-10 text-[var(--text-primary)]">
            
            {/* Paragraphs */}
            <div className="flex flex-col gap-6 text-base leading-relaxed text-[var(--text-secondary)]">
              {article.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Bullets / Key list */}
            {article.bullets && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                  <BookOpen size={18} className="text-[var(--accent)]" />
                  {article.bulletTitle}
                </h3>
                <ul className="space-y-3">
                  {article.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                      <span className="text-[var(--accent-secondary)] font-bold mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Code Snippet Box */}
            {article.codeSnippet && (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono text-[var(--text-tertiary)] flex items-center gap-1.5 uppercase tracking-wider">
                  <Terminal size={14} />
                  {article.codeTitle || "Code Reference"}
                </span>
                <pre className="rounded-xl overflow-hidden border border-[var(--border)] p-6 bg-[var(--surface-sunken)] font-mono text-sm leading-relaxed">
                  <code>{article.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Callout Info Box */}
            {article.calloutText && (
              <div className="rounded-2xl border-l-4 border-[var(--accent)] bg-[var(--surface-sunken)] p-6 flex items-start gap-4">
                <AlertCircle size={20} className="text-[var(--accent)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>{article.calloutTitle}</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{article.calloutText}</p>
                </div>
              </div>
            )}

            {/* CTA Bottom Banner */}
            <div className="mt-10 border-t border-[var(--border)] pt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>Ready to test this workflow?</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-normal mt-1">Open the {tool.name} workspace and run your operations client-side.</p>
              </div>
              <Link
                href={`/tools/${tool.slug}`}
                className="btn btn--primary py-2.5 px-6 text-sm font-mono tracking-wider flex items-center justify-center gap-2 shrink-0 rounded-[var(--radius-control)] hover:bg-[var(--accent-strong)] transition-all cursor-pointer"
                style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
              >
                Launch Workspace <ArrowRight size={14} />
              </Link>
            </div>

          </Reveal>
        </article>
      </main>
    </div>
  );
}
