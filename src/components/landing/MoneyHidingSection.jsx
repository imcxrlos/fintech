import React from "react";

export default function MoneyHidingSection() {
  return (
    <section className="relative z-10 px-5 py-24 lg:px-8 lg:py-40">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">The opportunity</p>
        <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
          There's money hiding in plain sight.
        </h2>
        <p className="mt-8 max-w-2xl text-xl leading-8 text-muted-foreground">
          Most people don't know where to look.
        </p>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Fees get buried. Bills creep up. Subscriptions keep charging. Refunds go unclaimed. Settlements get missed.
        </p>
        <p className="mt-8 max-w-2xl font-heading text-2xl leading-relaxed text-foreground sm:text-3xl">
          We'll search for the things you'd normally have to discover yourself — all in one place.
        </p>
      </div>
    </section>
  );
}