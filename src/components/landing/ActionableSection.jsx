import React from "react";

const elements = [
  { label: "What we found", description: "A clear description of the charge, pattern, or opportunity we spotted." },
  { label: "Why it matters", description: "The reason this caught our attention and why you should care." },
  { label: "The amount involved", description: "The dollar figure at stake, when the data supports it." },
  { label: "What may be recoverable", description: "An estimate of what could be saved or recovered." },
  { label: "What you can do next", description: "Concrete next steps so every finding feels actionable." },
];

export default function ActionableSection() {
  return (
    <section className="relative z-10 border-t border-foreground/10 px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">The report</p>
        <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
          We don't just show you a number.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
          When something is worth looking into, every finding is presented in a way that makes it feel actionable — not just raw transaction data.
        </p>
        <div className="mt-14 rounded-3xl border border-white/50 bg-white/40 px-8 shadow-[0_12px_48px_-16px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:px-12">
          {elements.map((item, i) => (
            <div key={item.label} className="flex gap-6 border-b border-foreground/10 py-7 sm:gap-10">
              <span className="font-heading text-3xl leading-none text-muted-foreground/30">{i + 1}</span>
              <div>
                <h3 className="font-heading text-2xl font-medium text-foreground">{item.label}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}