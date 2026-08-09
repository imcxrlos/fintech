import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LandingHeader({ onStart }) {
  return <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 lg:px-8">
    <Link to="/" className="font-heading text-xl font-semibold tracking-[0.18em]">CXRLOS</Link>
    <div className="flex items-center gap-3">
      <Link to="/login" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">Sign in</Link>
      <Button onClick={onStart} className="h-10 rounded-full px-5 text-sm">Find My Savings</Button>
    </div>
  </header>;
}