import { jsPDF } from "jspdf";

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);

export function downloadReportPdf(report) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Your Save It Report", 20, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 20, y);
  y += 12;

  doc.setTextColor(40);
  const s = report.summary || {};
  doc.setFontSize(11);
  const overview = [
    `Accounts analyzed: ${s.accountsAnalyzed ?? 0}`,
    `Transactions analyzed: ${s.transactionsAnalyzed ?? 0}`,
    `Potential annual savings: ${money(s.potentialSavings)}`,
    `Potential recovery: ${money(s.potentialRecovery)}`,
  ];
  overview.forEach((line) => {
    doc.text(line, 20, y);
    y += 7;
  });
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Findings (${report.findings?.length || 0})`, 20, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  (report.findings || []).forEach((f, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}. ${f.title || f.merchant || "Finding"}`, 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    if (f.reason) {
      const lines = doc.splitTextToSize(f.reason, 170);
      doc.text(lines, 24, y);
      y += 6 * lines.length;
    }
    if (f.nextSteps && f.nextSteps.length) {
      const steps = doc.splitTextToSize(`Next steps: ${f.nextSteps.join(" ")}`, 170);
      doc.text(steps, 24, y);
      y += 6 * steps.length;
    }
    y += 5;
  });

  doc.save("save-it-report.pdf");
}