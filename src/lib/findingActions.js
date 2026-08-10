const money = (value) => `$${(value || 0).toFixed(0)}`;

export function getActionSteps(finding) {
  if (finding.nextSteps && finding.nextSteps.length > 0) {
    return finding.nextSteps;
  }
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
    case "fee":
      return [
        `Contact your bank and request a courtesy waiver for this $${finding.amount} fee.`,
        `Check if your account type should waive this fee based on your balance or activity.`,
        `If fees are recurring, consider switching to a no-fee account.`,
        `If the fee seems like an error, file a formal dispute with your bank.`,
      ];
    case "medical":
      return [
        `Request an itemized bill from ${finding.merchant} and review every line item.`,
        `Compare the charge against your explanation of benefits (EOB) from your insurer.`,
        `If amounts don't match or services seem incorrect, contact the provider's billing office.`,
        `File an appeal with your insurer if the charge was denied or adjusted.`,
      ];
    case "settlement":
      return [
        `Review the settlement details${finding.sourceUrl ? ` at ${finding.sourceUrl}` : " on the official settlement website"}.`,
        `Check if you're eligible based on your purchase history.`,
        `File a claim before the deadline${finding.deadline ? ` on ${finding.deadline}` : ""}.`,
        `Keep your proof of purchase or bank statements as evidence.`,
      ];
    case "recall":
      return [
        `Check if your product is affected${finding.sourceUrl ? ` at ${finding.sourceUrl}` : " on the recall website"}.`,
        `Follow the manufacturer's instructions for repair, replacement, or refund.`,
        `Keep your proof of purchase for any claim.`,
        `Stop using the product immediately if there's a safety concern.`,
      ];
    case "wage":
      return [
        `Review the details${finding.sourceUrl ? ` at ${finding.sourceUrl}` : " at the official source"}.`,
        `Check if you're eligible based on your employment history.`,
        `File a claim or contact the relevant labor board if applicable.`,
        `Keep records of your employment dates and pay stubs.`,
      ];
    default:
      return ["Review this finding and contact the merchant if needed."];
  }
}