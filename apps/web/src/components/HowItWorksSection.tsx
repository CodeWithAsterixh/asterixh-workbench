import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Reveal } from "@/lib/animations";
import type { HowItWorks } from "@/data/how-it-works";

export function HowItWorksSection({ input, output, steps }: HowItWorks) {
  return (
    <section data-theme="shell" className="section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">How it works</span>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
          <Reveal>
            <div className="card h-full">
              <div className="flex items-center gap-2 mb-4">
                <ArrowDownToLine size={16} strokeWidth={1.75} className="text-[var(--accent-secondary)]" />
                <span className="eyebrow">Input</span>
              </div>
              <p className="text-secondary text-sm leading-relaxed">{input}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="card h-full">
              <div className="flex items-center gap-2 mb-4">
                <ArrowUpFromLine size={16} strokeWidth={1.75} className="text-[var(--accent)]" />
                <span className="eyebrow">Output</span>
              </div>
              <p className="text-secondary text-sm leading-relaxed">{output}</p>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="card h-full">
                <span className="timecode">Step {String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 mb-2" style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem" }}>
                  {step.title}
                </h3>
                <p className="text-secondary text-sm leading-relaxed">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
