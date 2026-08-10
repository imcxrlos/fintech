import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { icon: "bank", title: "Bank fees", description: "Find fees and recurring charges that may be worth questioning." },
  { icon: "bills", title: "Bills that quietly increased", description: "See when recurring bills become more expensive." },
  { icon: "duplicate", title: "Duplicate charges", description: "Find charges that appear to have happened more than once." },
  { icon: "forgot", title: "Forgotten subscriptions", description: "Find recurring payments you may no longer use." },
  { icon: "overcharge", title: "Overcharges", description: "Spot unusual changes in recurring payments." },
  { icon: "refund", title: "Refunds & settlements", description: "Find potential refunds, credits, and consumer settlements you may be able to claim." },
  { icon: "recall", title: "Product recalls & claims", description: "Find relevant recalls, claims, and consumer opportunities connected to products you own or have purchased." },
  { icon: "medical", title: "Medical billing", description: "Surface unusual medical-related charges worth taking a closer look at." },
  { icon: "wage", title: "Wage-related opportunities", description: "Identify potential wage-related claims or issues where supported." },
];

const iconPaths = {
  bank: "M3 10h18M5 10V6h14v4M5 10v8h14v-8M8 14h2m4 0h2",
  bills: "M3 17l6-6 4 4 8-8M14 7h7v7",
  duplicate: "M9 9h11v11H9zM4 4h11v3M4 4v11h3",
  forgot: "M4 4v6h6M4 10a8 8 0 1 1 2 6",
  overcharge: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  refund: "M3 7v6h6M3 13a9 9 0 1 0 3-7.7L3 8",
  recall: "M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 0L4 7m8 4v10M9 9.5l3-1.5 3 1.5",
  medical: "M12 8v8m-4-4h8M4 4h16v16H4z",
  wage: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
};

export default function DiscoveryGrid() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % categories.length);
  const prev = () => setCurrent((c) => (c - 1 + categories.length) % categories.length);
  const go = (i) => setCurrent(i);

  const cat = categories[current];

  return (
    <section className="relative z-10 border-t border-foreground/10 px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">What we search for</p>
        <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
          The things you'd never think to check.
        </h2>

        <div className="mt-14 flex items-center gap-4 sm:gap-6">
          <button
            onClick={prev}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-white/40 text-muted-foreground backdrop-blur-xl transition-all hover:border-foreground/25 hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="relative h-[18rem] flex-1 sm:h-[16rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col justify-center rounded-3xl border border-white/50 bg-white/45 p-8 shadow-[0_12px_48px_-16px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:p-10"
              >
                <div className="flex items-center justify-between">
                  <svg className="h-7 w-7 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={iconPaths[cat.icon]} />
                  </svg>
                  <span className="font-heading text-sm text-muted-foreground/40">
                    {String(current + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-heading text-3xl font-medium leading-tight text-foreground sm:text-4xl">{cat.title}</h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{cat.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={next}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-white/40 text-muted-foreground backdrop-blur-xl transition-all hover:border-foreground/25 hover:text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {categories.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-1.5 bg-foreground/15 hover:bg-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}