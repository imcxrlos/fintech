import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Check, Loader2, FileText, LogOut, ArrowLeft, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlowButton from "@/components/landing/GlowButton";
import ReportSummary from "@/components/report/ReportSummary";
import FindingCard from "@/components/report/FindingCard";
import { getActionSteps } from "@/lib/findingActions";
import { downloadReportPdf } from "@/lib/reportPdf";

const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);

const PAID_FEATURES = [
  "Full potential savings breakdown",
  "Step-by-step action items",
  "Relevant merchant/contact information",
  "Refund, cancellation, or dispute guidance",
  "Relevant settlement opportunities",
  "Downloadable PDF report",
];

export default function Report() {
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const pending = sessionStorage.getItem("pendingReport");
      if (pending) {
        try {
          const data = JSON.parse(pending);
          const totalSavings = (data.summary.potentialSavings || 0) + (data.summary.potentialRecovery || 0);
          const saved = await base44.entities.Report.create({
            summary: data.summary,
            findings: data.findings,
            potential_savings: totalSavings,
            is_paid: data.is_paid || false,
          });
          sessionStorage.removeItem("pendingReport");
          setReport(saved);
          const list = await base44.entities.Report.list("-created_date", 20);
          setReports(list);
        } catch {
          setLoading(false);
          return;
        }
      } else {
        try {
          const list = await base44.entities.Report.list("-created_date", 20);
          setReports(list);
          if (list.length > 0) setReport(list[0]);
        } catch {
          // ignore
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const handlePurchase = async () => {
    setPaying(true);
    // Payment flow will be wired once payment integration is approved
    setTimeout(() => setPaying(false), 500);
  };

  const handleLogout = async () => {
    await base44.auth.logout("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#ffffff" }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4" style={{ background: "#ffffff" }}>
        <p className="font-heading text-3xl font-semibold">No saved reports yet</p>
        <p className="mt-2 text-muted-foreground">Run a scan to see your money report here.</p>
        <GlowButton onClick={() => navigate("/")} className="mt-6">Find My Savings</GlowButton>
      </div>
    );
  }

  const totalSavings = report.potential_savings || 0;
  const showSavingsCTA = totalSavings > 5;

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-4 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Your saved report</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Your Money Report</h1>
          <p className="mt-3 text-muted-foreground">{report.summary.transactionsAnalyzed} transactions across {report.summary.accountsAnalyzed} connected accounts analyzed.</p>
        </div>

        {report.is_paid && (
          <div className="mt-6 flex flex-wrap gap-3">
            <GlowButton onClick={() => downloadReportPdf(report)}>
              <Download className="h-4 w-4" /> Download PDF
            </GlowButton>
            <Button variant="outline" onClick={() => navigate("/")}>
              <Plus className="h-4 w-4" /> New scan
            </Button>
          </div>
        )}

        <div className="mt-10"><ReportSummary summary={report.summary} /></div>

        <div className="mt-10">
          <h2 className="mb-5 font-heading text-2xl font-semibold">All findings ({report.findings.length})</h2>
          {report.findings.length > 0 ? (
            <div className="grid gap-4">
              {report.findings.map((finding, i) => <FindingCard key={`${finding.type}-${finding.title}-${i}`} finding={finding} />)}
            </div>
          ) : (
            <div className="rounded-2xl border bg-card p-10 text-center">
              <p className="font-heading text-xl font-semibold">No findings detected</p>
              <p className="mt-2 text-sm text-muted-foreground">This scan didn't find actionable savings opportunities.</p>
            </div>
          )}
        </div>

        {!report.is_paid ? (
          <section className="mt-12 rounded-[2rem] border-2 border-primary/20 bg-primary/5 p-7 sm:p-10">
            {showSavingsCTA ? (
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Would you save {money(totalSavings)} for $5?</h2>
            ) : (
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Get your full report for $5.</h2>
            )}
            <p className="mt-3 max-w-2xl text-muted-foreground">Get the full breakdown and the exact action steps for every opportunity we found.</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {PAID_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 shrink-0 text-primary" /> {feature}</li>
              ))}
            </ul>
            <div className="mt-8">
              <GlowButton onClick={handlePurchase} disabled={paying}>
                {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : "Get My Full Report — $5"}
              </GlowButton>
              <p className="mt-3 text-xs text-muted-foreground">One-time payment. No subscription.</p>
            </div>
          </section>
        ) : (
          <section className="mt-12">
            <h2 className="mb-5 font-heading text-2xl font-semibold">Action steps for every finding</h2>
            <div className="grid gap-4">
              {report.findings.map((finding, i) => (
                <div key={i} className="rounded-2xl border bg-card p-5 sm:p-6">
                  <h3 className="font-heading text-xl font-semibold">{finding.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {getActionSteps(finding).map((step, j) => (
                      <li key={j} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                        <span className="font-semibold text-primary">{j + 1}.</span> {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {reports.length > 1 && (
          <section className="mt-12 border-t pt-8">
            <h2 className="mb-4 font-heading text-2xl font-semibold">Report history</h2>
            <div className="grid gap-3">
              {reports.map((r, i) => (
                <button key={r.id} onClick={() => setReport(r)} className="flex items-center justify-between rounded-xl border bg-card p-4 text-left hover:border-primary/30">
                  <div>
                    <p className="font-medium">Report {reports.length - i}</p>
                    <p className="text-sm text-muted-foreground">{new Date(r.created_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}