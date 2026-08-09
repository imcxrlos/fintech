import React from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScannerVisual from "@/components/landing/ScannerVisual";

export default function Hero({ onStart }) {
  return <main className="relative z-10 overflow-hidden"><div className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl items-center gap-16 px-5 pb-24 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pt-4">
    <div className="hero-rise"><p className="eyebrow">We look for money you're missing</p>
      <h1 className="mt-6 max-w-3xl font-heading text-6xl font-normal leading-[0.94] tracking-[-0.045em] sm:text-7xl lg:text-[5.35rem]">Find the money you're leaving behind.</h1>
      <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">Connect your accounts. We'll look through your spending and find subscriptions, rising bills, duplicate charges, overcharges, and other ways you could be saving.</p>
      <Button onClick={onStart} size="lg" className="mt-9 h-14 rounded-full px-7 text-base shadow-[0_14px_34px_-18px_hsl(var(--primary))]">Find My Savings <ArrowRight className="ml-2 h-4 w-4" /></Button>
      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="h-4 w-4" />Securely connected through Plaid. We never see your bank password.</p>
    </div><div className="visual-float"><ScannerVisual /></div>
  </div></main>;
}