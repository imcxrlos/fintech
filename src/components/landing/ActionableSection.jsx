import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const elements = [
  { label: "What we found", description: "A clear description of the charge, pattern, or opportunity we spotted." },
  { label: "Why it matters", description: "The reason this caught our attention and why you should care." },
  { label: "The amount involved", description: "The dollar figure at stake, when the data supports it." },
  { label: "What may be recoverable", description: "An estimate of what could be saved or recovered." },
  { label: "What you can do next", description: "Concrete next steps so every finding feels actionable." },
];

export default function ActionableSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.55", "end 0.45"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(elements.length - 1, Math.max(0, Math.floor(latest * elements.length)));
    setActiveIndex(idx);
  });

  return (
    <section ref={sectionRef} className="relative z-10 px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">The report</p>
        <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
          We don't just show you a number.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          When something is worth looking into, every finding is presented in a way that makes it feel actionable — not just raw transaction data.
        </p>
        <div className="relative mt-12">
          <div className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-0.5 bg-foreground/10" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-0.5 origin-top bg-primary"
          />
          {elements.map((item, i) => {
            const isActive = i === activeIndex;
            const isPassed = i < activeIndex;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative mb-4 pl-10"
              >
                <div
                  className={`absolute left-0 top-5 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    isActive
                      ? "border-primary bg-primary text-background scale-125 shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                      : isPassed
                        ? "border-primary/50 bg-primary/15 text-primary/60"
                        : "border-foreground/15 bg-background text-foreground/30"
                  }`}
                >
                  {i + 1}
                </div>
                <div
                  className={`rounded-2xl border p-6 backdrop-blur-2xl transition-all duration-500 ${
                    isActive
                      ? "scale-[1.015] border-primary/30 bg-white/85 shadow-[0_18px_52px_-14px_rgba(0,0,0,0.24)]"
                      : isPassed
                        ? "border-white/50 bg-white/45 opacity-45 shadow-[0_8px_28px_-14px_rgba(0,0,0,0.14)]"
                        : "border-white/60 bg-white/55 shadow-[0_10px_36px_-14px_rgba(0,0,0,0.18)]"
                  }`}
                >
                  <h3
                    className={`font-heading text-xl font-medium transition-colors duration-500 ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}