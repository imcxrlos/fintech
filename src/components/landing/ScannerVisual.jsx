import React from "react";
import { Check, ScanSearch } from "lucide-react";

const checks = ["Recurring charges", "Bill changes", "Duplicate charges"];
export default function ScannerVisual() {
  return <div className="relative mx-auto max-w-lg rounded-[2rem] border bg-card p-3 shadow-[0_30px_80px_-45px_hsl(var(--foreground)/0.28)]">
    <div className="rounded-[1.5rem] border bg-background p-6 sm:p-8">
      <div className="mb-10 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Automatic scan</p><p className="mt-2 font-heading text-2xl font-semibold">Looking everywhere</p></div><div className="rounded-full bg-primary/10 p-3 text-primary"><ScanSearch className="h-6 w-6" /></div></div>
      <div className="space-y-3">{checks.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border bg-card p-4"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-4 w-4" /></span><span className="text-sm font-medium">{item}</span><span className="ml-auto text-xs text-muted-foreground">Included</span></div>)}</div>
      <p className="mt-6 text-center text-xs text-muted-foreground">No categories to choose. No scan to configure.</p>
    </div>
  </div>;
}