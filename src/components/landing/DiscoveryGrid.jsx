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
  const [index, setIndex] = useState(0);
  const [exitDir, setExitDir] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExitDir(1);
      setIndex((i) => i + 1);
    }, 4500);
    return () => clearTimeout(timer);
  }, [index]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      setExitDir(1);
      setIndex((i) => i + 1);
    } else if (info.offset.x < -100 || info.velocity.x < -500) {
      setExitDir(-1);
      setIndex((i) => i + 1);
    }
  };

  const stack = [0, 1, 2].map((offset) => ({
    key: index + offset,
    card: categories[(index + offset) % categories.length],
    offset,
  }));

  return (
    <section className="relative z-10 px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">What we search for</p>
        <h2 className="mt-5 font-heading text-[2.5rem] leading-[1.05] tracking-[-0.035em] sm:text-6xl">
          The things you'd never think to check.
        </h2>
        <div className="mt-14 flex justify-center">
          <div className="relative aspect-[4/5] w-full max-w-sm select-none">
            <AnimatePresence>
              {stack.map(({ key, card, offset }) => (
                <motion.div
                  key={key}
                  initial={{ scale: 0.9, y: 24, opacity: 0 }}
                  animate={{ scale: 1 - offset * 0.05, y: offset * 14, opacity: 1 }}
                  exit={{ x: exitDir * 400, opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
                  drag={offset === 0}
                  dragSnapToOrigin={offset === 0}
                  dragElastic={0.7}
                  onDragEnd={offset === 0 ? handleDragEnd : undefined}
                  style={{ zIndex: 10 - offset }}
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border border-white/60 bg-white/60 p-8 text-center shadow-[0_16px_56px_-16px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:p-10"
                >
                  <span className="font-heading text-sm text-muted-foreground/40">
                    {String((key % categories.length) + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-heading text-3xl font-medium leading-tight text-foreground sm:text-4xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    {card.description}
                  </p>
                  <span className="mt-6 text-xs text-muted-foreground/40">Swipe →</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}