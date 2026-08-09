import React from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScannerVisual from "@/components/landing/ScannerVisual";

export default function Hero({ onStart }) {
  return <main className="mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl items-center gap-14 px-5 pb-20 pt-12 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:pt-4">
    <div><div className="mb-7 inline-flex rounded-full border bg-card px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground">YOUR INTELLIGENT MONEY SCANNER</div>
      <h1 className="max-w-3xl font-heading text-5xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.6rem]">Find the money you're leaving behind.</h1>
      <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">Connect your accounts. We'll automatically find subscriptions, bill increases, unusual charges, overcharges, and other opportunities to save.</p>
      <Button onClick={onStart} size="lg" className="mt-9 h-14 rounded-full px-7 text-base">Find My Savings <ArrowRight className="ml-2 h-4 w-4" /></Button>
      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><LockKeyhole className="h-4 w-4" />Connect securely through Plaid. We never see your bank password.</p>
    </div><ScannerVisual />
  </main>;
}