import React from "react";
import { Check, X } from "lucide-react";

const diyTasks = [
  "Search transactions",
  "Check bills",
  "Research settlements",
  "Search recalls",
  "Track subscriptions",
  "Review charges",
];

const weDo = [
  "One automated scan",
  "One place to review everything we found",
];

export default function ComparisonSection() {
  return (
    <section className="relative z-10 border-t border-foreground/10 px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">The alternative</p>
        <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
          You could spend hours looking for this yourself.
        </h2>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-muted-foreground">
          You'd have to search your transactions, check old bills, remember what you subscribed to, search settlement databases, research recalls, and figure out which charges actually matter.
        </p>
        <p className="mt-8 font-heading text-3xl text-foreground sm:text-4xl">
          Instead, we'll do the searching for you.
        </p>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-foreground/10 p-8 sm:p-10">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">Doing it yourself</h3>
            <ul className="mt-6 space-y-4">
              {diyTasks.map((task) => (
                <li key={task} className="flex items-center gap-3 text-lg text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                    <X className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border-2 border-primary/25 bg-primary/5 p-8 sm:p-10">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Let us find it</h3>
            <ul className="mt-6 space-y-4">
              {weDo.map((item) => (
                <li key={item} className="flex items-center gap-3 text-lg font-medium text-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}