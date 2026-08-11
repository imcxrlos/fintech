import React from "react";
import { Lock, ArrowRight } from "lucide-react";
import FlowShell from "./FlowShell";
import GlowButton from "@/components/landing/GlowButton";
import { money, totalSavings, sortFindingsByValue, findingSavingsValue } from "@/lib/findingValue";

export default function SavingsTeaser({ report, onContinue, onBack }) {
  const savings = totalSavings(report.summary);
  const sorted = sortFindingsByValue(report.findings);
  const previewCount = Math.min(3, sorted.length);
  const preview = sorted.slice(0, previewCount);
  const hidden = sorted.length - previewCount;
  const showSavingsCTA = savings > 5;

  return (
    <FlowShell stepLabel="Your results" onBack={onBack}>
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        {savings > 0 ? (
          <>
            We found <span className="text-primary">{money(savings)}/year</span> in potential savings.
          </>
        ) : (
          <>We found {sorted.length} potential opportunities.</>
        )}
      </h1>

      <div className="mt-8 grid gap-3">
        {preview.map((finding, i) => (
          <TeaserCard key={`${finding.type}-${finding.title}-${i}`} finding={finding} />
        ))}
      </div>

      {hidden > 0 && (
        <div className="mt-4 flex items-center gap-4 rounded-2xl border border-dashed bg-muted/40 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">{hidden} more {hidden === 1 ? "opportunity" : "opportunities"} found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Unlock the complete report to see every finding and exactly what you can do about each one.
            </p>
          </div>
        </div>
      )}

      <div className="mt-10">
        <GlowButton onClick={onContinue}>
          {showSavingsCTA ? `Would you save ${money(savings)} for $5?` : "Unlock My Full Report — $5"}
          <ArrowRight className="h-4 w-4" />
        </GlowButton>
      </div>
    </FlowShell>
  );
}

function TeaserCard({ finding }) {
  const value = findingSavingsValue(finding);
  const hasValue = value > 0;
  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border bg-card p-5">
      <div className="min-w-0">
        <p className="font-heading text-xl font-semibold">{finding.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{finding.badge || "Potential opportunity detected"}</p>
      </div>
      <div className="shrink-0 text-right">
        {hasValue ? (
          <>
            <p className="font-heading text-xl font-semibold text-primary">{money(value)}</p>
            <p className="text-xs text-muted-foreground">/year</p>
          </>
        ) : (
          <p className="text-sm font-medium text-muted-foreground">Opportunity</p>
        )}
      </div>
    </article>
  );
}