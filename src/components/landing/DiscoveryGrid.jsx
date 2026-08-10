import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { title: "Bank fees", description: "Find fees and recurring charges that may be worth questioning." },
  { title: "Bills that quietly increased", description: "See when recurring bills become more expensive." },
  { title: "Duplicate charges", description: "Find charges that appear to have happened more than once." },
  { title: "Forgotten subscriptions", description: "Find recurring payments you may no longer use." },
  { title: "Overcharges", description: "Spot unusual changes in recurring payments." },
  { title: "Refunds & settlements", description: "Find potential refunds, credits, and consumer settlements you may be able to claim." },
  { title: "Product recalls & claims", description: "Find relevant recalls, claims, and consumer opportunities connected to products you own or have purchased." },
  { title: "Medical billing", description: "Surface unusual medical-related charges worth taking a closer look at." },
  { title: "Wage-related opportunities", description: "Identify potential wage-related claims or issues where supported." },
];

export default function DiscoveryGrid() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((c) => (c + 1) % categories.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, [current]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -40) {
      setCurrent((c) => (c + 1) % categories.length);
    } else if (info.offset.x > 40) {
      setCurrent((c) => (c - 1 + categories.length) % categories.length);
    }
  };

  const cat = categories[current];

  return (
    <section className="relative z-10 px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">What we search for</p>
        <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
          The things you'd never think to check.
        </h2>

        <div className="mt-14 flex justify-center">
          <div className="relative aspect-[4/5] w-full max-w-sm select-none">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.92 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border border-white/60 bg-white/55 p-8 text-center shadow-[0_16px_56px_-16px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:p-10"
              >
                <span className="font-heading text-sm text-muted-foreground/40">
                  {String(current + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-heading text-3xl font-medium leading-tight text-foreground sm:text-4xl">{cat.title}</h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{cat.description}</p>
                <span className="mt-6 text-xs text-muted-foreground/40">Swipe →</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-xs">
          <div className="h-1 overflow-hidden rounded-full bg-foreground/10">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${((current + 1) / categories.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}