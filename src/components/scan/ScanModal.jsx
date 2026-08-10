import React, { useState, useEffect, useCallback } from "react";
import { Landmark, Loader2, ShieldCheck, X } from "lucide-react";
import GlowButton from "@/components/landing/GlowButton";

export default function ScanModal({ open, stage, error, onClose, onConnect }) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const busy = stage === "connecting" || stage === "analyzing";

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const t = setTimeout(() => { setVisible(false); setClosing(false); }, 260);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    if (busy) return;
    onClose();
  }, [busy, onClose]);

  if (!visible) return null;

  const enterClass = closing ? "" : "animate-scan-fade-in";
  const panelClass = closing
    ? "animate-scan-fade-out"
    : "animate-scan-rise";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm ${enterClass}`}>
      <div className={`w-full max-w-lg rounded-[2rem] border bg-card p-7 shadow-2xl sm:p-9 ${panelClass}`}>
        <div className="flex justify-between">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Landmark className="h-6 w-6" /></div>
          <button onClick={handleClose} disabled={busy} aria-label="Close"><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <h2 className="mt-6 font-heading text-3xl font-normal tracking-tight sm:mt-7 sm:text-4xl">Let us look everywhere.</h2>
        <p className="mt-4 leading-7 text-muted-foreground">We'll scan your transactions for recurring charges, price increases, unusual bills, duplicate charges, and other potential savings opportunities.</p>
        <div className="my-7 rounded-2xl border bg-muted/50 p-4 text-sm"><p className="flex gap-2 font-medium"><ShieldCheck className="h-5 w-5 text-primary" />Private by design</p><p className="mt-2 pl-7 text-muted-foreground">Plaid handles the secure connection. We never receive your bank password.</p></div>
        {error && <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <GlowButton onClick={onConnect} disabled={busy} fullWidth>{busy ? <><Loader2 className="h-4 w-4 animate-spin" />{stage === "analyzing" ? "Analyzing everything…" : "Opening Plaid…"}</> : "Connect your accounts"}</GlowButton>
        <p className="mt-4 text-center text-xs text-muted-foreground">Checking, savings, credit cards, and other supported transaction accounts.</p>
      </div>
    </div>
  );
}