import React from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import GlowButton from "@/components/landing/GlowButton";
import ScannerVisual from "@/components/landing/ScannerVisual";

export default function Hero({ onStart }) {
  return <main className="relative z-10 overflow-hidden"><div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 pb-16 pt-8 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-4">
    <div className="hero-rise"><p className="eyebrow">LIVE BETA</p>
<h1 className="mt-6 max-w-3xl font-heading font-normal leading-[0.96] tracking-[-0.045em] text-[46px] sm:text-[46px] lg:text-[76px]">
  Find the money you're leaving behind.
</h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:mt-8 sm:text-lg sm:leading-8">Connect your accounts. We'll look through your spending and find subscriptions, rising bills, duplicate charges, overcharges, and other ways you could be saving.</p>
      <GlowButton onClick={onStart} className="mt-7 sm:mt-9">Find My Savings <ArrowRight className="h-4 w-4" /></GlowButton>
      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="h-4 w-4" />**Plaid-secured. Credentials stay private.**
</p>
    </div><div className="visual-float"><ScannerVisual /></div>
  </div></main>;
}