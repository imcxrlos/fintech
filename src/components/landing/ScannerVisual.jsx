import React from "react";
import { Check, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";

const checks = [
{ label: "Streaming service", detail: "Recurring" },
{ label: "Monthly utility", detail: "Price change" },
{ label: "Recent purchase", detail: "Duplicate review" }];

export default function ScannerVisual() {
  return <div className="glass-preview relative mx-auto max-w-lg rounded-[2rem] border border-card/70 bg-card/55 p-3 shadow-[0_40px_120px_-45px_hsl(var(--foreground)/0.38)] backdrop-blur-2xl">
    <div className="relative overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-card/65 p-6 backdrop-blur-2xl sm:p-8"><div className="scan-beam" />
      <div className="mb-9 flex items-start justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><ScanSearch className="h-5 w-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Automatic scan</p><p className="mt-1 font-heading text-3xl">Looking everywhere</p></div></div></div>
      <div className="space-y-3">{checks.map((item, index) => <div key={item.label} className="scan-row flex items-center gap-3 rounded-2xl border border-foreground/10 bg-background/55 p-4 backdrop-blur-xl" style={{ animationDelay: `${index * 0.45}s` }}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-4 w-4" /></span><div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.detail}</p></div><span className="ml-auto h-2 w-2 rounded-full bg-primary" /></div>)}</div>
      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4" />Read-only connection through Plaid</p>
    </div>
  </div>;
}