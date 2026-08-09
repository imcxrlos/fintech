import React from "react";
import { Link } from "react-router-dom";

export default function LegalLayout({ title, updated, children }) {
  return <div className="min-h-screen bg-background"><header className="border-b bg-card"><div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5"><Link to="/" className="flex items-center gap-3 text-sm font-semibold"><span className="h-3 w-3 rounded-full bg-primary" />Return home</Link><nav className="flex gap-5 text-sm text-muted-foreground"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></nav></div></header><main className="mx-auto max-w-4xl px-5 py-16 sm:py-24"><p className="eyebrow">Mastery Labs LLC</p><h1 className="mt-5 font-heading text-5xl sm:text-6xl">{title}</h1><p className="mt-4 text-sm text-muted-foreground">Last updated: {updated}</p><div className="legal-copy mt-12">{children}</div></main></div>;
}