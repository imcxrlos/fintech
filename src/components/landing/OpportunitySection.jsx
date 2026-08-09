import React from "react";
import { ArrowDownUp, BadgeDollarSign, CircleDollarSign, CopyCheck, RefreshCcw } from "lucide-react";

const opportunities = [
  { icon: RefreshCcw, title: "Subscriptions", copy: "Find recurring charges you may have forgotten about." },
  { icon: ArrowDownUp, title: "Rising bills", copy: "Catch recurring bills that have gotten more expensive." },
  { icon: CopyCheck, title: "Duplicate charges", copy: "Spot charges that appear to have been billed twice." },
  { icon: CircleDollarSign, title: "Overcharges", copy: "Find unusual changes in recurring charges worth reviewing." },
  { icon: BadgeDollarSign, title: "Refunds & settlements", copy: "Find potential opportunities to get money back." },
];

export default function OpportunitySection() {
  return <section id="what-we-find" className="relative z-10 overflow-hidden"><div className="relative mx-auto max-w-6xl px-5 py-24 lg:px-8 lg:py-32"><div className="max-w-3xl"><p className="eyebrow">We look for money you're missing</p><h2 className="mt-5 font-heading text-5xl leading-[1.02] tracking-[-0.035em] sm:text-6xl">The quiet leaks add up. We find them.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">One secure connection lets us review your available history for supported patterns—automatically and all at once.</p></div><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">{opportunities.map(({ icon: Icon, title, copy }, index) => <article key={title} className={`group rounded-[1.75rem] border bg-card p-6 shadow-[0_20px_55px_-45px_hsl(var(--foreground)/0.35)] ${index < 2 ? "lg:col-span-3" : "lg:col-span-2"}`}><span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><h3 className="mt-8 font-heading text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}</div></div></section>;
}