import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import ScanComplete from "./ScanComplete";
import SavingsTeaser from "./SavingsTeaser";
import Checkout from "./Checkout";
import PaymentSuccess from "./PaymentSuccess";
import NonPurchaser from "./NonPurchaser";

export default function SaveFlow({ report: initialReport, authed, onRestart }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("complete");
  const [report, setReport] = useState(initialReport);
  const [paying, setPaying] = useState(false);

  const persist = (r) => sessionStorage.setItem("pendingReport", JSON.stringify(r));

  const handlePay = async () => {
    setPaying(true);
    const paid = { ...report, is_paid: true };
    setReport(paid);
    persist(paid);
    if (authed && report.id) {
      try {
        await base44.entities.Report.update(report.id, { is_paid: true });
      } catch {
        /* non-blocking; report is marked paid in session */
      }
    }
    setPaying(false);
    setStep("success");
  };

  const handleCreateAccount = () => {
    persist(report);
    navigate("/register?returnTo=/report");
  };

  const handleViewReport = () => navigate("/report");

  const renderStep = () => {
    switch (step) {
      case "complete":
        return (
          <ScanComplete
            report={report}
            authed={authed}
            onContinue={() => setStep("results")}
            onRestart={onRestart}
            onCreateAccount={handleCreateAccount}
          />
        );
      case "results":
        return <SavingsTeaser report={report} onContinue={() => setStep("checkout")} onBack={() => setStep("complete")} />;
      case "checkout":
        return (
          <Checkout
            paying={paying}
            onPay={handlePay}
            onBack={() => setStep("results")}
            onMaybeLater={() => setStep("later")}
          />
        );
      case "success":
        return <PaymentSuccess authed={authed} onCreateAccount={handleCreateAccount} onViewReport={handleViewReport} />;
      case "later":
        return (
          <NonPurchaser
            authed={authed}
            onCreateAccount={handleCreateAccount}
            onViewReport={handleViewReport}
            onBackToResults={() => setStep("results")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
}