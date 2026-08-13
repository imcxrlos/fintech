import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const elements = [
{ label: "We found something.", description: "See exactly what caught our attention — the charge, fee, bill, subscription, or opportunity." },
{ label: "Here's why it matters.", description: "We explain what's unusual, what may have happened, and why it's worth taking a closer look." },
{ label: "Here's what's at stake.", description: "See the actual amount involved and, when possible, how much money may be on the line." },
{ label: "Here's what you could get back.", description: "We estimate the potential savings, refund, credit, or recovery when the available information supports it." },
{ label: "Here's how to get it.", description: "Follow the recommended next steps to act on the finding and potentially put that money back in your pocket." }];


const EASE = [0.22, 1, 0.36, 1];

export default function ActionableSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(elements.length - 1, Math.max(0, Math.floor(latest * elements.length)));
    setActiveIndex(idx);
  });

  return (
    <section className="relative z-10 px-5 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="pb-6 pt-16 lg:pb-8 lg:pt-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground hidden">The report</p>
          <h2 className="mt-5 font-heading text-[2.5rem] leading-[1.05] tracking-[-0.035em] sm:text-6xl">
            We don't just show you a number.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            When something is worth looking into, every finding is presented in a way that makes it feel actionable — not just raw transaction data.
          </p>
        </div>

        <div ref={sectionRef} style={{ height: `${elements.length * (isMobile ? 45 : 65)}vh` }}>
          <div className="sticky top-0 flex min-h-screen flex-col justify-center">
            <div className="relative">
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-foreground/10" />
              <motion.div
                style={{ scaleY: lineScale }}
                className="absolute left-[11px] top-3 bottom-3 w-0.5 origin-top bg-primary" />
              
              {elements.map((item, i) => {
                const isActive = i === activeIndex;
                const isPassed = i < activeIndex;
                return (
                  <motion.div
                    key={item.label}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : isPassed ? 0.4 : 0.2,
                      scale: isActive ? 1 : 0.96
                    }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className={`relative mb-3 pl-10 sm:mb-4 sm:pl-12`}>
                    
                    <div
                      className={`absolute left-0 top-6 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-700 ${
                      isActive ?
                      "border-2 border-primary bg-primary text-background shadow-[0_0_18px_hsl(var(--primary)/0.45)] h-5 w-5 sm:h-6 sm:w-6" :
                      isPassed ?
                      "border-2 border-primary/40 bg-primary/10 text-primary/50 h-5 w-5 sm:h-6 sm:w-6" :
                      "border-2 border-foreground/15 bg-background text-foreground/30 h-5 w-5 sm:h-6 sm:w-6"}`
                      }>
                      
                      {i + 1}
                    </div>
                    <div
                      className={`rounded-3xl border transition-all duration-700 ${
                      isActive ?
                      "border-primary/25 bg-white/90 p-5 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.28)] sm:p-7" :
                      isPassed ?
                      "border-white/50 bg-white/50 p-5 shadow-[0_10px_32px_-16px_rgba(0,0,0,0.16)] sm:p-6" :
                      "border-white/60 bg-white/55 p-5 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.2)] sm:p-6"}`
                      }>
                      
                      <h3
                        className={`font-heading text-xl font-medium transition-colors duration-700 sm:text-2xl ${
                        isActive ? "text-primary" : "text-foreground"}`
                        }>
                        
                        {item.label}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">{item.description}</p>
                    </div>
                  </motion.div>);

              })}
            </div>
          </div>
        </div>
      </div>
    </section>);

}