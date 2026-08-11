import React from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import FlowShell from "./FlowShell";
import GlowButton from "@/components/landing/GlowButton";

const PAID_FEATURES = [
  "All detected findings",
  "Full savings breakdown",
  "Exact recommended actions",
  "Merchant & contact information",
  "Refund, cancellation & dispute guidance",
  "Potential settlement opportunities",
  "Downloadable PDF report",
];

export default function Checkout({ paying, onPay, onBack, onMaybeLater }) {
  return (
    <FlowShell stepLabel="Checkout" onBack={onBack}>
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Your full Save It report is ready.
      </h1>

      <div className="mt-8 flex items-end gap-3">
        <span className="font-heading text-6xl font-semibold text-primary">$5</span>
        <div className="pb-2">
          <p className="text-sm font-semibold text-foreground">one-time payment</p>
          <p className="text-sm text-muted-foreground">No subscription. No recurring charges.</p>
        </div>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {PAID_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {feature}
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <GlowButton onClick={onPay} disabled={paying}>
          {paying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing…
            </>
            ) : (
              <>
                Unlock My Full Report — $5 <ArrowRight className="h-4 w-4" />
              </>
            )}
        </GlowButton>
        <button onClick={onMaybeLater} className="mt-4 block text-sm font-medium text-muted-foreground hover:text-foreground">
          Maybe later
        </button>
      </div>
    </FlowShell>
  );
}