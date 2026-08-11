import React from "react";
import { ArrowRight } from "lucide-react";
import FlowShell from "./FlowShell";
import GlowButton from "@/components/landing/GlowButton";
import { money, totalSavings } from "@/lib/findingValue";

export default function ScanComplete({ report, authed, onContinue, onRestart, onCreateAccount }) {
  const savings = totalSavings(report.summary);
  const opportunities = report.findings.length;
  const accounts = report.summary.accountsAnalyzed || 0;
  const transactions = report.summary.transactionsAnalyzed || 0;
  const isZero = opportunities === 0 && savings === 0;

  if (isZero) {
    return (
      <FlowShell stepLabel="Scan complete">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Your scan is complete.</h1>
        <p className="mt-4 max-w-md text-lg leading-7 text-muted-foreground">
          We didn't find any actionable savings opportunities in the accounts we analyzed.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Stat value={accounts} label="Accounts connected" />
          <Stat value={transactions} label="Transactions analyzed" />
        </div>
        <div className="mt-10">
          <GlowButton onClick={onRestart}>
            Connect Another Account <ArrowRight className="h-4 w-4" />
          </GlowButton>
          {!authed && (
            <button
              onClick={onCreateAccount}
              className="mt-4 block text-sm font-medium text-primary hover:underline"
            >
              Create free account
            </button>
          )}
        </div>
      </FlowShell>
    );
  }

  return (
    <FlowShell stepLabel="Scan complete">
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Your scan is complete.</h1>
      <p className="mt-4 max-w-md text-lg leading-7 text-muted-foreground">
        We analyzed <strong className="text-foreground">{accounts} accounts</strong> and found{" "}
        <strong className="text-foreground">{opportunities} potential savings opportunities.</strong>
      </p>

      <div className="mt-10 rounded-[2rem] border bg-primary/5 p-8 text-center sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Potential annual savings</p>
        <p className="mt-2 font-heading text-6xl font-semibold tracking-tight text-primary sm:text-7xl">{money(savings)}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Stat value={opportunities} label="Opportunities found" accent />
        <Stat value={transactions} label="Transactions analyzed" />
      </div>

      <div className="mt-10">
        <GlowButton onClick={onContinue}>
          See My Savings <ArrowRight className="h-4 w-4" />
        </GlowButton>
      </div>
    </FlowShell>
  );
}

function Stat({ value, label, accent }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-primary/20 bg-primary/5" : "bg-card"}`}>
      <p className="font-heading text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}