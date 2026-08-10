import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import ScanModal from "@/components/scan/ScanModal";
import PreviewDashboard from "@/components/report/PreviewDashboard";
import MoneyHidingSection from "@/components/landing/MoneyHidingSection";
import DiscoveryGrid from "@/components/landing/DiscoveryGrid";
import ComparisonSection from "@/components/landing/ComparisonSection";
import ActionableSection from "@/components/landing/ActionableSection";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import CloudBackdrop from "@/components/landing/CloudBackdrop";

export default function Home() {
  const navigate = useNavigate();
  const [scanOpen, setScanOpen] = useState(false);
  const [stage, setStage] = useState("ready");
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

  const saveReportAndRedirect = (path) => {
    sessionStorage.setItem("pendingReport", JSON.stringify(report));
    navigate(path);
  };

  const startPlaid = async () => {
    setError(""); setStage("connecting");
    try {
      const clientUserId = sessionStorage.getItem("money_scan_id") || crypto.randomUUID();
      sessionStorage.setItem("money_scan_id", clientUserId);
      const response = await base44.functions.invoke("createLinkToken", { clientUserId });
      if (!window.Plaid) throw new Error("The secure connection is still loading. Please try again.");
      const handler = window.Plaid.create({
        token: response.data.linkToken,
        onSuccess: async (publicToken) => {
          setStage("analyzing");
          try {
            const result = await base44.functions.invoke("analyzePlaidConnection", { publicToken });
            const authed = await base44.auth.isAuthenticated();
            if (authed) {
              const totalSavings = (result.data.summary.potentialSavings || 0) + (result.data.summary.potentialRecovery || 0);
              await base44.entities.Report.create({
                summary: result.data.summary,
                findings: result.data.findings,
                potential_savings: totalSavings,
              });
              navigate("/report");
            } else {
              setReport(result.data);
              setScanOpen(false);
              setStage("ready");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          } catch (scanError) {
            setError(scanError.response?.data?.error || scanError.message);
            setStage("ready");
          }
        },
        onExit: (plaidError) => {
          setStage("ready");
          if (plaidError) setError(plaidError.display_message || "The connection was not completed.");
        },
      });
      handler.open();
    } catch (connectionError) {
      setError(connectionError.response?.data?.error || connectionError.message);
      setStage("ready");
    }
  };

  const begin = () => { setError(""); setScanOpen(true); };
  const reset = () => { setReport(null); setScanOpen(true); };

  const handleCreateAccount = () => saveReportAndRedirect("/register?returnTo=/report");
  const handleSignIn = () => saveReportAndRedirect("/login?returnTo=/report");
  const handlePurchase = () => saveReportAndRedirect("/register?returnTo=/report");

  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      {report ? (
        <>
          <LandingHeader onStart={begin} />
          <PreviewDashboard
            report={report}
            onCreateAccount={handleCreateAccount}
            onSignIn={handleSignIn}
            onPurchase={handlePurchase}
          />
        </>
      ) : (
        <div className="relative">
          <CloudBackdrop />
          <LandingHeader onStart={begin} />
          <Hero onStart={begin} />
          <MoneyHidingSection />
          <DiscoveryGrid />
          <ComparisonSection />
          <ActionableSection />
          <FinalCTA onStart={begin} />
          <LandingFooter />
        </div>
      )}
      <ScanModal open={scanOpen} stage={stage} error={error} onClose={() => setScanOpen(false)} onConnect={startPlaid} />
    </div>
  );
}