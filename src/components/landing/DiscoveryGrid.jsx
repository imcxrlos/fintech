import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.6", "end 0.4"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="relative z-10 px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">What we search for</p>
        <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
          The things you'd never think to check.
        </h2>
        <div className="relative mt-14">
          <div className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-0.5 bg-foreground/10" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-0.5 origin-top bg-primary"
          />
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-4 pl-10"
            >
              <div className="absolute left-0 top-6 h-4 w-4 rounded-full border-2 border-primary bg-background" />
              <div className="rounded-2xl border border-white/60 bg-white/55 p-6 shadow-[0_10px_36px_-14px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
                <span className="font-heading text-sm text-muted-foreground/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-heading text-lg font-medium text-foreground">{cat.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{cat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}