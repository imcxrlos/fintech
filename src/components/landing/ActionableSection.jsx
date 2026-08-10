import React from "react";
import { motion } from "framer-motion";

const elements = [
  { label: "What we found", description: "A clear description of the charge, pattern, or opportunity we spotted." },
  { label: "Why it matters", description: "The reason this caught our attention and why you should care." },
  { label: "The amount involved", description: "The dollar figure at stake, when the data supports it." },
  { label: "What may be recoverable", description: "An estimate of what could be saved or recovered." },
  { label: "What you can do next", description: "Concrete next steps so every finding feels actionable." },
];

export default function ActionableSection() {
  return (
    <section className="relative z-10 px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">The report</p>
        <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
          We don't just show you a number.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          When something is worth looking into, every finding is presented in a way that makes it feel actionable — not just raw transaction data.
        </p>
        <div className="mt-10">
          {elements.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              style={{ zIndex: elements.length - i }}
              className={`relative flex items-start gap-5 rounded-2xl border border-white/60 bg-white/60 p-6 shadow-[0_10px_36px_-14px_rgba(0,0,0,0.18)] backdrop-blur-2xl ${i > 0 ? "-mt-4" : ""}`}
            >
              <span className="font-heading text-3xl leading-none text-primary/25">{i + 1}</span>
              <div>
                <h3 className="font-heading text-xl font-medium text-foreground">{item.label}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}