import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const elements = [
  { label: "What we found", description: "A clear description of the charge, pattern, or opportunity we spotted." },
  { label: "Why it matters", description: "The reason this caught our attention and why you should care." },
  { label: "The amount involved", description: "The dollar figure at stake, when the data supports it." },
  { label: "What may be recoverable", description: "An estimate of what could be saved or recovered." },
  { label: "What you can do next", description: "Concrete next steps so every finding feels actionable." },
];

const EASE = [0.22, 1, 0.36, 1];

export default function ActionableSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(elements.length - 1, Math.max(0, Math.floor(latest * elements.length)));
    setActiveIndex(idx);
  });

  return (
    <section className="relative z-10 px-5 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="pb-6 pt-24 lg:pb-8 lg:pt-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">The report</p>
          <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
            We don't just show you a number.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            When something is worth looking into, every finding is presented in a way that makes it feel actionable — not just raw transaction data.
          </p>
        </div>

        <div ref={sectionRef} style={{ height: `${elements.length * 65}vh` }}>
          <div className="sticky top-0 flex min-h-screen flex-col justify-center">
            <div className="relative">
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-foreground/10" />
              <motion.div
                style={{ scaleY: lineScale }}
                className="absolute left-[11px] top-3 bottom-3 w-0.5 origin-top bg-primary"
              />
              {elements.map((item, i) => {
                const isActive = i === activeIndex;
                const isPassed = i < activeIndex;
                return (
                  <motion.div
                    key={item.label}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : isPassed ? 0.4 : 0.2,
                      scale: isActive ? 1 : 0.96,
                    }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className={`relative mb-4 pl-12`}
                  >
                    <div
                      className={`absolute left-0 top-6 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-700 ${
                        isActive
                          ? "border-2 border-primary bg-primary text-background shadow-[0_0_18px_hsl(var(--primary)/0.45)]"
                          : isPassed
                            ? "border-2 border-primary/40 bg-primary/10 text-primary/50"
                            : "border-2 border-foreground/15 bg-background text-foreground/30"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div
                      className={`rounded-3xl border transition-all duration-700 ${
                        isActive
                          ? "border-primary/25 bg-white/90 p-7 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.28)]"
                          : isPassed
                            ? "border-white/50 bg-white/50 p-6 shadow-[0_10px_32px_-16px_rgba(0,0,0,0.16)]"
                            : "border-white/60 bg-white/55 p-6 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.2)]"
                      }`}
                    >
                      <h3
                        className={`font-heading text-2xl font-medium transition-colors duration-700 ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {item.label}
                      </h3>
                      <p className="mt-2 text-base leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}