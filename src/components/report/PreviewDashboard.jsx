import React from "react";
import { Lock, ArrowRight, Check } from "lucide-react";
import GlowButton from "@/components/landing/GlowButton";
import ReportSummary from "@/components/report/ReportSummary";
import FindingCard from "@/components/report/FindingCard";

const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);

const PAID_FEATURES = [
  "Every finding in your report",
  "Full potential savings breakdown",
  "Step-by-step action items",
  "Relevant merchant/contact information",
  "Refund, cancellation, or dispute guidance",
  "Relevant settlement opportunities",
  "Downloadable PDF report",
];

export default function PreviewDashboard({ report, onCreateAccount, onSignIn, onPurchase }) {
  const totalSavings = (report.summary.potentialSavings || 0) + (report.summary.potentialRecovery || 0);
  const showSavingsCTA = totalSavings > 5;
  const previewCount = Math.min(3, report.findings.length);
  const previewFindings = report.findings.slice(0, previewCount);
  const hiddenCount = report.findings.length - previewCount;
  const blurredFindings = report.findings.slice(previewCount, previewCount + 2);

  return (
    <main className="mx-auto max-w-4xl px-5 pb-24 pt-10 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Your scan is complete</p>
        <h1 className="mt-3 font-heading text-5xl font-semibold tracking-tight">Here's what we found.</h1>
        <p className="mt-3 text-muted-foreground">{report.summary.transactionsAnalyzed} transactions across {report.summary.accountsAnalyzed} connected accounts analyzed.</p>
      </div>

      <div className="mt-10"><ReportSummary summary={report.summary} /></div>

      {previewFindings.length > 0 && (
        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold">Preview of your findings</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{previewCount} of {report.findings.length} shown</span>
          </div>
          <div className="grid gap-4">
            {previewFindings.map((finding, i) => <FindingCard key={`${finding.type}-${finding.title}-${i}`} finding={finding} />)}
          </div>
          {hiddenCount > 0 && (
            <div className="relative mt-4 overflow-hidden rounded-2xl">
              <div className="space-y-4 select-none blur-sm">
                {blurredFindings.map((finding, i) => <FindingCard key={`blurred-${i}`} finding={finding} />)}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Lock className="h-5 w-5 text-primary" /></div>
                  <p className="mt-3 font-heading text-xl">{hiddenCount} more {hiddenCount === 1 ? "finding" : "findings"} waiting</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {previewFindings.length === 0 && (
        <div className="mt-10 rounded-2xl border bg-card p-10 text-center">
          <p className="font-heading text-2xl font-semibold">No actionable findings detected</p>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">Your transactions didn't reveal enough recurring charges, price increases, or duplicates to generate findings. Try again with a different account.</p>
        </div>
      )}

      <section className="mt-12 rounded-[2rem] border bg-card p-7 sm:p-10">
        <h2 className="font-heading text-3xl font-semibold">There's more to your report.</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">Create a free account to see all your findings, save your report, and access it anytime.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <GlowButton onClick={onCreateAccount}>Create My Free Account <ArrowRight className="h-4 w-4" /></GlowButton>
          <p className="text-sm text-muted-foreground">Already have an account? <button onClick={onSignIn} className="font-medium text-primary hover:underline">Sign in</button></p>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border-2 border-primary/20 bg-primary/5 p-7 sm:p-10">
        {showSavingsCTA ? (
          <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Would you say {money(totalSavings)} for $5?</h2>
        ) : (
          <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Get your full report for $5.</h2>
        )}
        <p className="mt-3 max-w-2xl text-muted-foreground">Get the full breakdown and the exact action steps for every opportunity we found.</p>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {PAID_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 shrink-0 text-primary" /> {feature}</li>
          ))}
        </ul>
        <div className="mt-8">
          <GlowButton onClick={onPurchase}>Get My Full Report — $5</GlowButton>
          <p className="mt-3 text-xs text-muted-foreground">One-time payment. No subscription.</p>
        </div>
      </section>
    </main>
  );
}