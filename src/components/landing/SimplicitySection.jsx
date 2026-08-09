import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import CloudBackdrop from "@/components/landing/CloudBackdrop";

const points = ["No categories to choose.", "No filters to configure.", "No spreadsheet to build."];
export default function SimplicitySection({ onStart }) {
  return <section id="how-it-works" className="relative overflow-hidden border-y bg-foreground py-24 text-background lg:py-32"><CloudBackdrop dark /><div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8"><div><p className="eyebrow text-background/60">Just connect and let us look</p><h2 className="mt-5 max-w-xl font-heading text-5xl leading-[1.02] tracking-[-0.035em] sm:text-6xl">You don't have to look for it. We do.</h2></div><div className="rounded-[2rem] border border-background/15 bg-background/5 p-7 backdrop-blur-sm sm:p-9"><div className="space-y-5">{points.map((point) => <p key={point} className="flex items-center gap-3 text-lg"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground"><Check className="h-4 w-4" /></span>{point}</p>)}</div><p className="mt-8 border-t border-background/15 pt-7 font-heading text-3xl">We scan it all.</p><Button onClick={onStart} variant="secondary" className="mt-7 h-12 rounded-full px-6">Find My Savings <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div></section>;
}