import React from "react";
import { Check, ArrowRight } from "lucide-react";
import FlowShell from "./FlowShell";
import GlowButton from "@/components/landing/GlowButton";

export default function PaymentSuccess({ authed, onCreateAccount, onViewReport }) {
  return (
    <FlowShell stepLabel="Unlocked">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Check className="h-7 w-7 text-primary" />
      </div>
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Your report is unlocked and ready for you.
      </h1>
      {authed ? (
        <>
          <p className="mt-4 max-w-md text-lg leading-7 text-muted-foreground">
            Everything's ready. Jump into your full report to see every finding and exactly what to do next.
          </p>
          <div className="mt-10">
            <GlowButton onClick={onViewReport}>
              View My Full Report <ArrowRight className="h-4 w-4" />
            </GlowButton>
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 max-w-md text-lg leading-7 text-muted-foreground">
            Create your free Save It account to save your report, access it anytime, and download it.
          </p>
          <div className="mt-10">
            <GlowButton onClick={onCreateAccount}>
              Create My Free Account <ArrowRight className="h-4 w-4" />
            </GlowButton>
          </div>
        </>
      )}
    </FlowShell>
  );
}