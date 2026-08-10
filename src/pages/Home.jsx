import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import ScanModal from "@/components/scan/ScanModal";
import ReportDashboard from "@/components/report/ReportDashboard";
import UpgradeModal from "@/components/report/UpgradeModal";
import OpportunitySection from "@/components/landing/OpportunitySection";
import SimplicitySection from "@/components/landing/SimplicitySection";
import LandingFooter from "@/components/landing/LandingFooter";
import CloudBackdrop from "@/components/landing/CloudBackdrop";

export default function Home() {
  const [scanOpen, setScanOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [stage, setStage] = useState("ready");
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

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
            setReport(result.data); setScanOpen(false); setStage("ready"); window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (scanError) { setError(scanError.response?.data?.error || scanError.message); setStage("ready"); }
        },
        onExit: (plaidError) => { setStage("ready"); if (plaidError) setError(plaidError.display_message || "The connection was not completed."); },
      });
      handler.open();
    } catch (connectionError) { setError(connectionError.response?.data?.error || connectionError.message); setStage("ready"); }
  };

  const begin = () => { setError(""); setScanOpen(true); };
  const reset = () => { setReport(null); setScanOpen(true); };
  return <div className="min-h-screen" style={{ background: "#ffffff" }}>{report ? <><LandingHeader onStart={begin} /><ReportDashboard report={report} onDownload={() => setUpgradeOpen(true)} onNewScan={reset} /></> : <div className="relative"><CloudBackdrop /><LandingHeader onStart={begin} /><Hero onStart={begin} /><OpportunitySection /><SimplicitySection onStart={begin} /><LandingFooter /></div>}<ScanModal open={scanOpen} stage={stage} error={error} onClose={() => setScanOpen(false)} onConnect={startPlaid} /><UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} /></div>;
}