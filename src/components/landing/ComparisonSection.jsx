import React from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";

const diyTasks = [
"Search transactions",
"Check bills",
"Research settlements",
"Search recalls",
"Track subscriptions",
"Review charges"];


const weDo = [
"One automated scan",
"One place to review everything we found"];


export default function ComparisonSection() {
  return (
    <section className="relative z-10 px-5 py-16 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl">
        
        <h2 className="mt-5 font-heading text-[2.5rem] leading-[1.05] tracking-[-0.035em] sm:text-6xl">
          You could spend hours looking for this yourself.
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:mt-8 sm:text-lg sm:leading-8">
          You'd have to search your transactions, check old bills, remember what you subscribed to, search settlement databases, research recalls, and figure out which charges actually matter.
        </p>
        <p className="mt-6 font-heading text-2xl text-foreground sm:mt-8 sm:text-3xl">
          Instead, we'll do the searching for you.
        </p>

        <div className="mt-14 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_16px_56px_-16px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:p-10">
            
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">Doing it yourself</h3>
            <ul className="mt-6 space-y-4">
              {diyTasks.map((task, i) =>
              <motion.li
                key={task}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                className="flex items-center gap-3 text-base text-muted-foreground sm:text-lg">
                
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                    <X className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {task}
                </motion.li>
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex justify-center py-1 lg:py-0">
            
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="rotate-90 lg:rotate-0">
              
              <ArrowRight className="h-7 w-7 text-primary" strokeWidth={2} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-3xl border border-primary/30 bg-primary/10 p-6 shadow-[0_16px_56px_-16px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:p-10">
            
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Let us find it</h3>
            <ul className="mt-6 space-y-4">
              {weDo.map((item, i) =>
              <motion.li
                key={item}
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-lg font-medium text-foreground">
                
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                  </span>
                  {item}
                </motion.li>
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>);

}