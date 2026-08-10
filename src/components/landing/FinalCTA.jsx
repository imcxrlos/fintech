import React from "react";
import { ArrowRight } from "lucide-react";
import GlowButton from "@/components/landing/GlowButton";

export default function FinalCTA({ onStart }) {
  return (
    <section className="relative z-10 px-5 py-24 lg:px-8 lg:py-40">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
          See what we found.
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
          Let us search for the money, charges, refunds, and opportunities hiding in places you normally wouldn't think to check.
        </p>
        <div className="mt-10 flex justify-center">
          <GlowButton onClick={onStart}>Find My Savings <ArrowRight className="h-4 w-4" /></GlowButton>
        </div>
      </div>
    </section>
  );
}