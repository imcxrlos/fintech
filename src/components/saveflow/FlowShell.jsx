import React from "react";
import { ArrowLeft } from "lucide-react";

export default function FlowShell({ children, onBack, stepLabel }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 pb-20 pt-7 sm:pt-9 lg:px-8">
        {(onBack || stepLabel) && (
          <div className="flex items-center justify-between">
            <div>
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}
            </div>
            {stepLabel && (
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{stepLabel}</span>
            )}
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center py-10">{children}</div>
      </div>
    </div>
  );
}