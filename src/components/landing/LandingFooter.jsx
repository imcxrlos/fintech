import React from "react";
import { LockKeyhole } from "lucide-react";
export default function LandingFooter() {
  return <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><p className="flex items-center gap-2"><LockKeyhole className="h-4 w-4" />Securely connected through Plaid.</p><p>We never see your bank password.</p></footer>;
}