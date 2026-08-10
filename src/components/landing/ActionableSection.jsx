import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const elements = [
  { label: "What we found", description: "A clear description of the charge, pattern, or opportunity we spotted." },
  { label: "Why it matters", description: "The reason this caught our attention and why you should care." },
  { label: "The amount involved", description: "The dollar figure at stake, when the data supports it." },
  { label: "What may be recoverable", description: "An estimate of what could be saved or recovered." },
  { label: "What you can do next", description: "Concrete next steps so every finding feels actionable." },
];

export default function ActionableSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressToIndex = useTransform(scrollYProgress, [0, 1], [0, elements.length - 1]);
  const [activeStep, setActiveStep] = useState(0);

  useMotionValueEvent(progressToIndex, "change", (v) => {
    setActiveStep(Math.round(v));
  });

  const item = elements[activeStep];

  return (
    <>
      <section className="relative z-10 px-5 pt-24 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">The report</p>
          <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
            We don't just show you a number.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            When something is worth looking into, every finding is presented in a way that makes it feel actionable — not just raw transaction data.
          </p>
        </div>
      </section>

      <div ref={containerRef} className="relative z-10" style={{ height: `${elements.length * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-5">
          <div className="mx-auto w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[2rem] border border-white/60 bg-white/55 p-10 text-center shadow-[0_16px_56px_-16px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:p-14"
              >
                <motion.span
                  key={`num-${activeStep}`}
                  initial={{ opacity: 0, scale: 1.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="block font-heading text-8xl leading-none text-primary/15 sm:text-9xl"
                >
                  {activeStep + 1}
                </motion.span>
                <h3 className="mt-4 font-heading text-3xl font-medium text-foreground sm:text-4xl">{item.label}</h3>
                <p className="mx-auto mt-3 max-w-lg text-lg leading-8 text-muted-foreground">{item.description}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-center gap-2">
              {elements.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeStep ? "w-8 bg-primary" : "w-1.5 bg-foreground/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}