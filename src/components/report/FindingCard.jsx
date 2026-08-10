import React from "react";
import { ArrowUpRight, CalendarRange, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

export default function FindingCard({ finding }) {
  const recurring = finding.type === "subscription" || finding.type === "bill";
  const hasAmount = finding.amount !== undefined && finding.amount !== null && finding.amount > 0;
  const hasRecovery = finding.recovery !== undefined && finding.recovery > 0;
  const hasDeadline = finding.deadline;
  const hasSource = finding.sourceUrl;

  return (
    <article className="rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{finding.badge}</span>
          <h3 className="mt-4 font-heading text-2xl font-semibold">{finding.title}</h3>
          {finding.merchant && <p className="mt-1 text-sm text-muted-foreground">{finding.merchant}</p>}
        </div>
        {hasAmount && (
          <p className="font-heading text-2xl font-semibold">
            {money(finding.amount)}
            {finding.frequency && <span className="text-sm font-normal text-muted-foreground">/{finding.frequency === "monthly" ? "mo" : finding.frequency}</span>}
          </p>
        )}
      </div>

      <p className="mt-5 text-sm leading-6 text-muted-foreground">{finding.reason}</p>

      {finding.nextSteps && finding.nextSteps.length > 0 && (
        <details className="group mt-4">
          <summary className="flex cursor-pointer items-center gap-1 text-sm font-medium text-primary hover:underline">
            How to act on this
            <ArrowUpRight className="h-4 w-4 transition-transform group-open:rotate-90" />
          </summary>
          <ul className="mt-3 space-y-2">
            {finding.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                <span className="font-semibold text-primary">{i + 1}.</span> {step}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t pt-4 text-sm">
        {recurring && (
          <>
            <span>{money(finding.annualCost)}/year</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <CalendarRange className="h-4 w-4" />
              {finding.firstObserved} – {finding.lastObserved}
            </span>
          </>
        )}
        {finding.annualImpact && <span>Estimated annual impact: <strong className="text-foreground">+{money(finding.annualImpact)}</strong></span>}
        {hasRecovery && !recurring && <span>Potential recovery: <strong className="text-foreground">{money(finding.recovery)}</strong></span>}
        {hasDeadline && <span className="flex items-center gap-1 text-muted-foreground"><AlertTriangle className="h-4 w-4" /> Deadline: {finding.deadline}</span>}
        {hasSource && (
          <a href={finding.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
            <ExternalLink className="h-4 w-4" /> Verify & file
          </a>
        )}
      </div>
    </article>
  );
}