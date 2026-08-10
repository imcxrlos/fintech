import React from "react";
import { Receipt, TrendingUp, Copy, RotateCcw, AlertCircle, Undo2, PackageSearch, HeartPulse, Wallet } from "lucide-react";

const categories = [
  { icon: Receipt, title: "Bank fees", description: "Find fees and recurring charges that may be worth questioning." },
  { icon: TrendingUp, title: "Bills that quietly increased", description: "See when recurring bills become more expensive." },
  { icon: Copy, title: "Duplicate charges", description: "Find charges that appear to have happened more than once." },
  { icon: RotateCcw, title: "Forgotten subscriptions", description: "Find recurring payments you may no longer use." },
  { icon: AlertCircle, title: "Overcharges", description: "Spot unusual changes in recurring payments." },
  { icon: Undo2, title: "Refunds & settlements", description: "Find potential refunds, credits, and consumer settlements you may be able to claim." },
  { icon: PackageSearch, title: "Product recalls & claims", description: "Find relevant recalls, claims, and consumer opportunities connected to products you own or have purchased." },
  { icon: HeartPulse, title: "Medical billing", description: "Surface unusual medical-related charges worth taking a closer look at." },
  { icon: Wallet, title: "Wage-related opportunities", description: "Identify potential wage-related claims or issues where supported." },
];

export default function DiscoveryGrid() {
  return (
    <section className="relative z-10 border-t border-foreground/10 px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">What we search for</p>
        <h2 className="mt-6 font-heading text-5xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
          The things you'd never think to check.
        </h2>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ icon: Icon, title, description }) => (
            <div key={title} className="group rounded-2xl border border-white/40 bg-white/30 p-8 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-white/60 hover:bg-white/40 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)]">
              <Icon className="h-5 w-5 text-muted-foreground/60 transition-colors duration-300 group-hover:text-primary" strokeWidth={1.5} />
              <h3 className="mt-5 font-heading text-xl font-medium text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}