import React from "react";
import { ArrowRight } from "lucide-react";
import FlowShell from "./FlowShell";
import GlowButton from "@/components/landing/GlowButton";

export default function NonPurchaser({ authed, onCreateAccount, onViewReport, onBackToResults }) {
  return (
    <FlowShell stepLabel="Keep your results" onBack={onBackToResults}>
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Want to keep your results?
      </h1>
      <p className="mt-4 max-w-md text-lg leading-7 text-muted-foreground">
        Create a free Save It account to save your scan, connect additional accounts, and access deeper insights as you
        continue using Save It.
      </p>
      <div className="mt-10">
        {authed ? (
          <GlowButton onClick={onViewReport}>
            View My Report <ArrowRight className="h-4 w-4" />
          </GlowButton>
        ) : (
          <GlowButton onClick={onCreateAccount}>
            Create Free Account <ArrowRight className="h-4 w-4" />
          </GlowButton>
        )}
        <button onClick={onBackToResults} className="mt-4 block text-sm font-medium text-muted-foreground hover:text-foreground">
          Back to results
        </button>
      </div>
    </FlowShell>
  );
}