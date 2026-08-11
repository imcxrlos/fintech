export const money = (value, decimals = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: decimals }).format(value || 0);

export const totalSavings = (summary = {}) =>
  (summary.potentialSavings || 0) + (summary.potentialRecovery || 0);

export function findingSavingsValue(finding = {}) {
  if (finding.annualImpact) return finding.annualImpact;
  if (finding.annualCost) return finding.annualCost;
  if (finding.recovery) return finding.recovery;
  if (finding.amount) return finding.amount;
  return 0;
}

export function sortFindingsByValue(findings = []) {
  return [...findings].sort((a, b) => findingSavingsValue(b) - findingSavingsValue(a));
}