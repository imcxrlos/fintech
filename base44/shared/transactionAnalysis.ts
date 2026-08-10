const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const cleanMerchant = (value = "Unknown merchant") => value.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\b\d{3,}\b/g, "").replace(/\s+/g, " ").trim();
const daysBetween = (a, b) => Math.round(Math.abs(new Date(a) - new Date(b)) / 86400000);
const yearlyMultiplier = { weekly: 52, monthly: 12, annual: 1 };

export function normalizeTransactions(transactions, accounts) {
  const accountMap = Object.fromEntries(accounts.map((account) => [account.account_id, `${account.name || account.official_name || "Account"} ••••${account.mask || ""}`]));
  return transactions.filter((item) => !item.pending && Number(item.amount) > 0).map((item) => ({
    id: item.transaction_id,
    merchant: item.merchant_name || item.name || "Unknown merchant",
    merchantKey: cleanMerchant(item.merchant_name || item.name),
    amount: Number(item.amount),
    date: item.authorized_date || item.date,
    account: accountMap[item.account_id] || "Connected account",
    accountId: item.account_id,
    type: item.payment_channel || item.transaction_type || "transaction",
    category: item.personal_finance_category?.primary || item.category?.[0] || "OTHER",
    description: item.name || item.merchant_name || "Transaction",
    source: "plaid",
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
}

function recurringPaymentDetector(transactions) {
  const groups = transactions.reduce((result, item) => {
    if (!result[item.merchantKey]) result[item.merchantKey] = [];
    result[item.merchantKey].push(item);
    return result;
  }, {});
  return Object.values(groups).flatMap((items) => {
    if (items.length < 2) return [];
    const intervals = items.slice(1).map((item, index) => daysBetween(item.date, items[index].date));
    const typicalInterval = median(intervals);
    const frequency = typicalInterval >= 330 ? "annual" : typicalInterval >= 24 && typicalInterval <= 40 ? "monthly" : typicalInterval >= 5 && typicalInterval <= 10 ? "weekly" : null;
    if (!frequency) return [];
    const amounts = items.map((item) => item.amount);
    const typicalAmount = median(amounts);
    const stable = amounts.filter((amount) => Math.abs(amount - typicalAmount) / typicalAmount <= 0.25).length / amounts.length;
    if (stable < 0.6) return [];
    return [{ merchant: items.at(-1).merchant, frequency, currentAmount: items.at(-1).amount, typicalAmount, firstObserved: items[0].date, lastObserved: items.at(-1).date, count: items.length, category: items.at(-1).category, transactions: items, confidence: stable >= 0.8 ? "High" : "Medium" }];
  });
}

const billTerms = /UTILITIES|TELECOMMUNICATION|INSURANCE|RENT|MORTGAGE|GAS|ELECTRIC|WATER|INTERNET|PHONE/;

function subscriptionAnalyzer(recurring) {
  return recurring.filter((item) => !billTerms.test(item.category)).map((item) => ({
    type: "subscription", title: item.merchant, badge: "Recurring subscription detected", amount: item.currentAmount,
    frequency: item.frequency, monthlyCost: item.currentAmount * (yearlyMultiplier[item.frequency] / 12), annualCost: item.currentAmount * yearlyMultiplier[item.frequency],
    confidence: item.confidence, firstObserved: item.firstObserved, lastObserved: item.lastObserved,
    reason: `${item.count} similarly timed charges were observed at an approximately ${item.frequency} cadence.`,
    nextSteps: [
      `Log into your ${item.merchant} account and review your current plan and usage.`,
      `If you no longer use this service, cancel it directly with ${item.merchant} or through your account settings.`,
      `Check if a lower tier or free alternative exists that still meets your needs.`,
      `If you cancel, you could save approximately $${Math.round(item.currentAmount * yearlyMultiplier[item.frequency])} per year.`,
    ],
  }));
}

function billAnalyzer(recurring) {
  return recurring.filter((item) => billTerms.test(item.category)).map((item) => ({
    type: "bill", title: item.merchant, badge: "Recurring bill detected", amount: item.currentAmount, frequency: item.frequency,
    monthlyCost: item.currentAmount * (yearlyMultiplier[item.frequency] / 12), annualCost: item.currentAmount * yearlyMultiplier[item.frequency],
    confidence: item.confidence, firstObserved: item.firstObserved, lastObserved: item.lastObserved,
    reason: `${item.count} recurring household-service charges were detected.`,
    nextSteps: [
      `Review your ${item.merchant} bill for any unexplained charges or rate changes.`,
      `Contact ${item.merchant} to ask about discounts, promotions, or loyalty rates.`,
      `Compare rates with competing providers to see if you could save.`,
      `Consider bundling services or adjusting your plan to reduce costs.`,
    ],
  }));
}

function priceIncreaseAnalyzer(recurring) {
  return recurring.flatMap((item) => {
    if (item.transactions.length < 3) return [];
    const previous = median(item.transactions.slice(0, -1).map((transaction) => transaction.amount));
    const increase = item.currentAmount - previous;
    if (increase < 1 || increase / previous < 0.05) return [];
    const annualImpact = increase * yearlyMultiplier[item.frequency];
    return [{
      type: "increase", title: item.merchant, badge: "Potential price increase", amount: item.currentAmount,
      previousAmount: previous, increase, annualImpact, frequency: item.frequency,
      reason: `The latest charge is ${Math.round((increase / previous) * 100)}% above the previous observed median.`,
      nextSteps: [
        `Contact ${item.merchant} and ask about the recent price increase.`,
        `The latest charge is ${Math.round((increase / previous) * 100)}% higher than the previous median of $${previous.toFixed(2)}.`,
        `Ask about grandfathered pricing, a loyalty discount, or a lower-tier plan.`,
        `If they won't adjust, consider switching to a competitor — annual impact: +$${Math.round(annualImpact)}.`,
      ],
    }];
  });
}

function overchargeAnalyzer(transactions) {
  const findings = [];
  for (let i = 0; i < transactions.length; i += 1) {
    for (let j = i + 1; j < transactions.length; j += 1) {
      const first = transactions[i]; const second = transactions[j];
      if (first.merchantKey === second.merchantKey && Math.abs(first.amount - second.amount) < 0.01 && daysBetween(first.date, second.date) <= 3) {
        findings.push({
          type: "duplicate", title: "Potential duplicate charge", merchant: second.merchant, badge: "Worth reviewing",
          amount: second.amount, recovery: second.amount,
          reason: `Two matching ${second.merchant} charges were detected within ${daysBetween(first.date, second.date)} day${daysBetween(first.date, second.date) === 1 ? "" : "s"}.`,
          nextSteps: [
            `Contact ${second.merchant} directly and request a refund for the duplicate $${second.amount} charge.`,
            `Reference both transaction dates when speaking with customer support.`,
            `If the merchant doesn't resolve it within 5 business days, dispute the charge with your bank.`,
            `Keep screenshots of both charges as evidence for the dispute.`,
          ],
        });
        break;
      }
    }
  }
  return findings;
}

function bankFeeAnalyzer(transactions) {
  const feePatterns = /\bfee\b|overdraft|\bnsf\b|insufficient fund|maintenance|service charge|\batm\b|late fee|monthly fee|annual fee|foreign transaction|wire fee|statement fee|replacement fee|excess activity|minimum balance|return item/;
  return transactions
    .filter((t) => feePatterns.test(t.merchantKey) || feePatterns.test(cleanMerchant(t.description)))
    .map((item) => ({
      type: "fee",
      title: item.merchant,
      merchant: item.merchant,
      badge: "Bank fee detected",
      amount: item.amount,
      date: item.date,
      recovery: item.amount,
      reason: `A $${item.amount.toFixed(2)} fee was charged by ${item.merchant} on ${item.date}.`,
      nextSteps: [
        `Contact your bank and request a courtesy waiver for this $${item.amount.toFixed(2)} fee — first-time waivers are common.`,
        `Check if your account type should waive this fee based on your balance or activity.`,
        `If fees are recurring, consider switching to a no-fee account or a different bank.`,
        `If the fee seems like an error, file a formal dispute through your bank's app or website.`,
      ],
    }));
}

function medicalBillingAnalyzer(transactions) {
  const medicalPatterns = /hospital|clinic|medical|dental|vision|pharmacy|lab|physician|urgent care|imaging|radiolog|health partner|wellness center|chiro|physical therap|optometr|pediatr|dermatolog|cardiolog|orthoped/;
  const medicalTxns = transactions.filter((t) => medicalPatterns.test(t.merchantKey) || medicalPatterns.test(t.category));
  if (medicalTxns.length === 0) return [];
  const amounts = medicalTxns.map((t) => t.amount);
  const typical = median(amounts);
  return medicalTxns
    .filter((item) => item.amount >= 150)
    .filter((item) => {
      const unusual = typical > 0 && item.amount > typical * 2;
      const isHigh = item.amount >= 500;
      return unusual || isHigh;
    })
    .slice(0, 5)
    .map((item) => {
      const unusual = typical > 0 && item.amount > typical * 2;
      return {
        type: "medical",
        title: item.merchant,
        merchant: item.merchant,
        badge: unusual ? "Unusual medical charge" : "Medical charge flagged",
        amount: item.amount,
        date: item.date,
        reason: unusual
          ? `This $${item.amount.toFixed(2)} charge is significantly higher than your typical medical-related charges (median: $${Math.round(typical)}).`
          : `A $${item.amount.toFixed(2)} medical-related charge was detected on ${item.date}.`,
        nextSteps: [
          `Request an itemized bill from ${item.merchant} and review every line item carefully.`,
          `Compare the charge against your explanation of benefits (EOB) from your insurer.`,
          `If amounts don't match or services seem incorrect, contact the provider's billing office.`,
          `File an appeal with your insurer if the charge was denied or adjusted.`,
        ],
      };
    });
}

export function extractResearchTargets(rawTransactions) {
  const merchants = [...new Set(
    rawTransactions
      .filter((t) => !t.pending && Number(t.amount) > 5)
      .map((t) => t.merchant_name || t.name)
      .filter(Boolean)
      .map((m) => m.trim())
  )].slice(0, 25);

  const payrollPatterns = /payroll|direct deposit|salary|pay check|paycheck|employer deposit|pay roll/;
  const employers = [...new Set(
    rawTransactions
      .filter((t) => Number(t.amount) < 0 && (payrollPatterns.test(t.name || "") || payrollPatterns.test(t.merchant_name || "")))
      .map((t) => (t.merchant_name || t.name || "").replace(/payroll|direct deposit|salary|pay check|paycheck|employer deposit|pay roll/gi, "").trim())
      .filter(Boolean)
      .filter((name) => name.length > 2)
  )].slice(0, 5);

  return { merchants, employers };
}

export function mergeResearchFindings(baseResult, research) {
  if (!research?.opportunities?.length) return baseResult;

  const mapped = research.opportunities.filter(Boolean).map((opp) => {
    if (opp.category === "settlement") {
      return {
        type: "settlement",
        title: opp.title || `${opp.merchant} settlement opportunity`,
        merchant: opp.merchant,
        badge: "Settlement opportunity",
        amount: opp.potential_amount || 0,
        reason: opp.description,
        deadline: opp.deadline,
        sourceUrl: opp.source_url,
        nextSteps: (opp.next_steps && opp.next_steps.length) ? opp.next_steps : [
          `Review the settlement details${opp.source_url ? ` at ${opp.source_url}` : " on the official settlement website"}.`,
          `Check if you're eligible based on your purchase history with ${opp.merchant}.`,
          `File a claim before the deadline${opp.deadline ? ` on ${opp.deadline}` : ""}.`,
          `Keep your proof of purchase or bank statements as evidence.`,
        ],
      };
    }
    if (opp.category === "recall") {
      return {
        type: "recall",
        title: opp.title || `${opp.merchant} product recall`,
        merchant: opp.merchant,
        badge: "Product recall",
        reason: opp.description,
        sourceUrl: opp.source_url,
        nextSteps: (opp.next_steps && opp.next_steps.length) ? opp.next_steps : [
          `Check if your product is affected${opp.source_url ? ` at ${opp.source_url}` : " on the recall website"}.`,
          `Follow the manufacturer's instructions for repair, replacement, or refund.`,
          `Keep your proof of purchase for any claim.`,
          `Stop using the product immediately if there's a safety concern.`,
        ],
      };
    }
    if (opp.category === "wage") {
      return {
        type: "wage",
        title: opp.title || `${opp.merchant} wage-related opportunity`,
        merchant: opp.merchant,
        badge: "Wage-related opportunity",
        amount: opp.potential_amount || 0,
        reason: opp.description,
        sourceUrl: opp.source_url,
        nextSteps: (opp.next_steps && opp.next_steps.length) ? opp.next_steps : [
          `Review the details${opp.source_url ? ` at ${opp.source_url}` : " at the official source"}.`,
          `Check if you're eligible based on your employment history.`,
          `File a claim or contact the relevant labor board if applicable.`,
          `Keep records of your employment dates and pay stubs.`,
        ],
      };
    }
    return null;
  }).filter(Boolean);

  const settlementFindings = mapped.filter((f) => f.type === "settlement");
  const recallFindings = mapped.filter((f) => f.type === "recall");
  const additionalRecovery = [...settlementFindings, ...mapped.filter((f) => f.type === "wage")].reduce((sum, f) => sum + (f.amount || 0), 0);

  return {
    ...baseResult,
    summary: {
      ...baseResult.summary,
      potentialRecovery: (baseResult.summary.potentialRecovery || 0) + additionalRecovery,
    },
    findings: [...baseResult.findings, ...mapped],
    modules: { settlements: settlementFindings, productAlerts: recallFindings },
  };
}

export function analyzeTransactions(transactions, accounts) {
  const normalized = normalizeTransactions(transactions, accounts);
  const recurring = recurringPaymentDetector(normalized);
  const recurringFindings = [...subscriptionAnalyzer(recurring), ...billAnalyzer(recurring)];
  const increases = priceIncreaseAnalyzer(recurring);
  const duplicates = overchargeAnalyzer(normalized);
  const fees = bankFeeAnalyzer(normalized);
  const medical = medicalBillingAnalyzer(normalized);
  const recurringAnnual = recurringFindings.reduce((sum, item) => sum + item.annualCost, 0);
  const potentialSavings = increases.reduce((sum, item) => sum + item.annualImpact, 0);
  const potentialRecovery = duplicates.reduce((sum, item) => sum + item.recovery, 0) + fees.reduce((sum, item) => sum + item.recovery, 0);
  return {
    summary: { currentRecurringSpending: recurringAnnual, potentialSavings, potentialRecovery, transactionsAnalyzed: normalized.length, accountsAnalyzed: accounts.length },
    findings: [...increases, ...duplicates, ...fees, ...medical, ...recurringFindings],
    modules: { settlements: [], productAlerts: [] },
  };
}