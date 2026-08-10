import React from "react";
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
export default function ReportSummary({ summary }) {
  const items = [
    { label: "Potential annual savings", value: money(summary.potentialSavings), accent: true },
    { label: "Current recurring spending", value: money(summary.currentRecurringSpending) },
    { label: "Potential recovery", value: money(summary.potentialRecovery) },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-[0_16px_56px_-20px_rgba(0,0,0,0.15)]">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className={`mt-3 font-heading text-3xl font-semibold ${item.accent ? "text-primary" : ""}`}>{item.value}</p>
          {item.accent && <p className="mt-2 text-xs text-muted-foreground">Estimated from supported transaction patterns, not guaranteed.</p>}
        </div>
      ))}
    </div>
  );
}