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
  const meshGradient = `radial-gradient(ellipse 55% 50% at 15% 12%, #cce8d6 0%, transparent 50%), radial-gradient(ellipse 50% 45% at 85% 8%, #d1d5f2 0%, transparent 50%), radial-gradient(ellipse 45% 40% at 50% 42%, #e8e0f1 0%, transparent 50%), radial-gradient(ellipse 50% 45% at 88% 55%, #d1d5f2 0%, transparent 50%), radial-gradient(ellipse 45% 40% at 12% 62%, #cce8d6 0%, transparent 50%), radial-gradient(ellipse 40% 35% at 55% 85%, #e8e0f1 0%, transparent 45%), radial-gradient(ellipse 35% 30% at 82% 82%, #d1d5f2 0%, transparent 40%), #eef2f5`;
  return <div className="min-h-screen" style={{ background: meshGradient }}>{report ? <><LandingHeader onStart={begin} /><ReportDashboard report={report} onDownload={() => setUpgradeOpen(true)} onNewScan={reset} /></> : <div className="relative"><LandingHeader onStart={begin} /><Hero onStart={begin} /><OpportunitySection /><SimplicitySection onStart={begin} /><LandingFooter /></div>}<ScanModal open={scanOpen} stage={stage} error={error} onClose={() => setScanOpen(false)} onConnect={startPlaid} /><UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} /></div>;
}