import React from "react";

export default function MoneyHidingSection() {
  return (
    <section className="relative z-10 px-5 py-16 lg:px-8 lg:py-40">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground hidden">The opportunity</p>
        <h2 className="mt-5 font-heading text-[2.5rem] leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
          There's money hiding in plain sight.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-7 text-muted-foreground sm:mt-8 sm:text-xl sm:leading-8">
          Most people don't know where to look.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          Fees get buried. Bills creep up. Subscriptions keep charging. Refunds go unclaimed. Settlements get missed.
        </p>
        <p className="mt-6 max-w-2xl font-heading text-xl leading-relaxed text-foreground sm:mt-8 sm:text-2xl sm:leading-relaxed">
          We'll search for the things you'd normally have to discover yourself — all in one place.
        </p>
      </div>
    </section>);

}