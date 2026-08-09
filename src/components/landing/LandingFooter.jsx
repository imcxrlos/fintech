import React from "react";
import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
export default function LandingFooter() {
  return <footer className="relative z-10 border-t border-foreground/10 bg-background/75 backdrop-blur-xl"><div className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted-foreground lg:px-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2"><LockKeyhole className="h-4 w-4" />Securely connected through Plaid.</p><div className="flex gap-5"><Link to="/privacy" className="hover:text-foreground">Privacy</Link><Link to="/terms" className="hover:text-foreground">Terms</Link></div></div><p className="mt-7 border-t pt-6 text-xs leading-5">An experimental product from Mastery Labs LLC. Informational analysis only—not financial, legal, tax, or credit advice. Findings and potential savings are not guaranteed.</p></div></footer>;
}