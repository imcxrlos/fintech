import React from "react";
import { ArrowUpRight, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
export default function FindingCard({ finding }) {
  const recurring = finding.type === "subscription" || finding.type === "bill";
  return <article className="rounded-2xl border bg-card p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{finding.badge}</span><h3 className="mt-4 font-heading text-2xl font-semibold">{finding.title}</h3>{finding.merchant && <p className="mt-1 text-sm text-muted-foreground">{finding.merchant}</p>}</div><p className="font-heading text-2xl font-semibold">{money(finding.amount)}{finding.frequency && <span className="text-sm font-normal text-muted-foreground">/{finding.frequency === "monthly" ? "mo" : finding.frequency}</span>}</p></div>
    <p className="mt-5 text-sm leading-6 text-muted-foreground">{finding.reason}</p>
    <div className="mt-5 flex flex-wrap items-center gap-4 border-t pt-4 text-sm">{recurring && <><span>{money(finding.annualCost)}/year</span><span className="flex items-center gap-1 text-muted-foreground"><CalendarRange className="h-4 w-4" />{finding.firstObserved} – {finding.lastObserved}</span></>}{finding.annualImpact && <span>Estimated annual impact: <strong className="text-foreground">+{money(finding.annualImpact)}</strong></span>}<Button variant="ghost" size="sm" className="ml-auto">Review <ArrowUpRight className="ml-1 h-4 w-4" /></Button></div>
  </article>;
}