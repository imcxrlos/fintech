const money = (value) => `$${(value || 0).toFixed(0)}`;

export function getActionSteps(finding) {
  switch (finding.type) {
    case "subscription":
    case "bill":
      return [
        `Review your ${finding.title} ${finding.frequency} charge of $${finding.amount}.`,
        `If you no longer use this service, cancel it directly with ${finding.title} or through your account settings.`,
        `Annual cost if continued: ${money(finding.annualCost)}. If you cancel, that's your potential savings.`,
        `Check if a lower tier or free alternative exists that still meets your needs.`,
      ];
    case "increase": {
      const pct = finding.previousAmount ? Math.round((finding.increase / finding.previousAmount) * 100) : 0;
      return [
        `Contact ${finding.title} about the recent price increase.`,
        `The latest charge is ${pct}% higher than the previous observed median.`,
        `Annual impact: +${money(finding.annualImpact)}. Ask about grandfathered pricing or a discount.`,
        `Consider switching to a competitor or downgrading to a lower-tier plan.`,
      ];
    }
    case "duplicate":
      return [
        `This appears to be a duplicate charge of $${finding.amount} from ${finding.merchant}.`,
        `Contact ${finding.merchant} directly and request a refund for the duplicate.`,
        `If the merchant doesn't resolve it within 5 business days, dispute the charge with your bank.`,
        `Reference both transaction dates when filing the dispute.`,
      ];
    default:
      return ["Review this finding and contact the merchant if needed."];
  }
}