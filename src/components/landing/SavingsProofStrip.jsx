import React from "react";
import { ArrowDownUp, BadgeDollarSign, CircleDollarSign, CopyCheck, RefreshCcw } from "lucide-react";

const items = [
  { icon: RefreshCcw, label: "Recurring charges" },
  { icon: ArrowDownUp, label: "Bill increases" },
  { icon: CopyCheck, label: "Duplicate charges" },
  { icon: CircleDollarSign, label: "Potential overcharges" },
  { icon: BadgeDollarSign, label: "Refund opportunities" },
];
export default function SavingsProofStrip() {
  const loop = [...items, ...items];
  return <section className="relative z-10 overflow-hidden border-y border-foreground/10 bg-card/45 py-5 backdrop-blur-xl" aria-label="Savings opportunities"><div className="proof-track flex w-max gap-3 px-3">{loop.map(({ icon: Icon, label }, index) => <div key={`${label}-${index}`} className="flex shrink-0 items-center gap-3 rounded-full border border-foreground/10 bg-card/75 px-5 py-3 text-sm font-medium shadow-sm backdrop-blur-xl"><Icon className="h-4 w-4 text-primary" /><span>{label}</span></div>)}</div></section>;
}