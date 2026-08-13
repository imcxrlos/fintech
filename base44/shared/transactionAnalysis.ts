const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const daysBetween = (a, b) => Math.round(Math.abs(new Date(a) - new Date(b)) / 86400000);
const yearlyMultiplier = { weekly: 52, monthly: 12, annual: 1 };
const cleanText = (value = "") => value.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

// ---- Merchant normalization ----
// Turns raw Plaid strings like "ELEVENLABS.IOELEVENLABS.IO" into "Elevenlabs"
export function normalizeMerchantName(raw) {
  if (!raw) return "";
  let s = String(raw).trim();
  // collapse exact doubled repeats (e.g. "ELEVENLABS.IOELEVENLABS.IO")
  if (s.length >= 6 && s.length % 2 === 0) {
    const half = s.length / 2;
    if (s.slice(0, half).toLowerCase() === s.slice(half).toLowerCase()) s = s.slice(0, half);
  }
  // strip trailing domain suffixes
  s = s.replace(/\.(io|com|net|org|co|app|ai|dev|cloud)$/i, "");
  // collapse doubled token runs like "elevenlabs elevenlabs"
  s = s.replace(/\b([a-z0-9]+)\s+\1\b/gi, "$1");
  // strip stray dots between alphanumerics
  s = s.replace(/\./g, " ");
  s = s.replace(/[^a-zA-Z0-9 &]/g, " ").replace(/\s+/g, " ").trim();
  // title case
  s = s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  return s;
}

function merchantKey(raw) {
  return normalizeMerchantName(raw).toLowerCase().replace(/\s+/g, " ").trim() || "unknown";
}

// ---- Plaid personal_finance_category signals ----
const EXCLUDED_PF_PRIMARY = new Set([
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "LOAN_PAYMENTS",
  "INCOME",
  "BANK_FEES",
  "REFUNDS_AND_REVERSALS",
]);

// Detailed PF categories that strongly indicate a discretionary, cancellable subscription
const SUBSCRIPTION_PF_DETAILED = [
  "ENTERTAINMENT_STREAMING_SERVICES",
  "GENERAL_SERVICES_SOFTWARE_AND_APPLICATIONS",
  "GENERAL_SERVICES_WEB_HOSTING_AND_DOMAINS",
  "GENERAL_SERVICES_CLOUD_COMPUTING",
  "GENERAL_SERVICES_ONLINE_SERVICES",
  "GENERAL_SERVICES_DIGITAL_SUBSCRIPTIONS",
];

const SUBSCRIPTION_PF_PRIMARY_HINTS = ["ENTERTAINMENT", "GENERAL_SERVICES"];

// Debt / payment description indicators — applied only when Plaid did not provide a merchant_name
const DEBT_PAYMENT_PATTERN = /\b(credit\s*crd|credit card|crd pmt|card payment|loan pmt|loan|mortgage|web pay|e-pay|epay|e-payment|online payment|bill pay|balance|autopay|payment to|payment from|pay to|pmt to|transfer to|transfer from|zelle|ach transfer)\b/i;

function detectExclusion(tx) {
  const { pfPrimary, pfDetailed, hasMerchantName, rawName } = tx;
  if (EXCLUDED_PF_PRIMARY.has(pfPrimary)) {
    if (pfPrimary === "TRANSFER_IN" || pfPrimary === "TRANSFER_OUT") return "transfer";
    if (pfPrimary === "LOAN_PAYMENTS") return "debt";
    if (pfPrimary === "INCOME") return "income";
    if (pfPrimary === "BANK_FEES") return "fee";
    if (pfPrimary === "REFUNDS_AND_REVERSALS") return "refund";
  }
  // Rent / mortgage (specific detailed values only, so home security under RENT_AND_UTILITIES stays a bill)
  if (pfPrimary === "RENT_AND_UTILITIES" && /(_RENT|_MORTGAGE)$/.test(pfDetailed || "")) return "rent_mortgage";
  // Secondary description-based debt detection — only when no reliable merchant_name
  if (!hasMerchantName && DEBT_PAYMENT_PATTERN.test(rawName)) return "debt";
  return null;
}

export function normalizeTransactions(transactions, accounts) {
  const accountMap = Object.fromEntries((accounts || []).map((account) => [account.account_id, account]));
  return transactions
    .filter((item) => !item.pending && Number(item.amount) > 0)
    .map((item) => {
      const acct = accountMap[item.account_id] || {};
      const pf = item.personal_finance_category || {};
      const merchantRaw = item.merchant_name || item.name || "";
      const tx = {
        id: item.transaction_id,
        merchant: normalizeMerchantName(merchantRaw) || "Unknown merchant",
        merchantKey: merchantKey(merchantRaw),
        hasMerchantName: Boolean(item.merchant_name),
        rawName: item.name || item.merchant_name || "",
        amount: Number(item.amount),
        date: item.authorized_date || item.date,
        account: `${acct.name || acct.official_name || "Account"} ••••${acct.mask || ""}`,
        accountId: item.account_id,
        accountType: acct.type || "",
        accountSubtype: acct.subtype || "",
        paymentChannel: item.payment_channel || "",
        transactionType: item.transaction_type || "",
        pfPrimary: pf.primary || "",
        pfDetailed: pf.detailed || "",
        category: pf.primary || (item.category && item.category[0]) || "OTHER",
        description: item.name || item.merchant_name || "Transaction",
        source: "plaid",
      };
      tx.exclusion = detectExclusion(tx);
      return tx;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
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
    const stable = amounts.filter((amount) => typicalAmount > 0 && Math.abs(amount - typicalAmount) / typicalAmount <= 0.25).length / amounts.length;
    if (stable < 0.6) return [];
    const last = items[items.length - 1];
    return [{
      merchant: last.merchant,
      merchantKey: last.merchantKey,
      frequency,
      currentAmount: last.amount,
      typicalAmount,
      firstObserved: items[0].date,
      lastObserved: last.date,
      count: items.length,
      pfPrimary: last.pfPrimary,
      pfDetailed: last.pfDetailed,
      category: last.category,
      exclusion: last.exclusion,
      hasMerchantName: last.hasMerchantName,
      transactions: items,
      amountStability: stable,
      plaidConfirmed: false,
    }];
  });
}

// When Plaid /transactions/recurring/get is available, mark rules-based streams Plaid confirmed
function mergePlaidRecurring(rulesBased, plaidStreams) {
  if (!Array.isArray(plaidStreams) || !plaidStreams.length) return rulesBased;
  const plaidKeys = new Set(plaidStreams.map((s) => merchantKey(s.merchant_name || s.name || "")));
  return rulesBased.map((stream) => (plaidKeys.has(stream.merchantKey) ? { ...stream, plaidConfirmed: true } : stream));
}

function classifyRecurringType(stream) {
  if (stream.exclusion === "debt") return "debt";
  if (stream.exclusion === "transfer") return "transfer";
  if (stream.exclusion === "income") return "income";
  if (stream.exclusion === "refund") return "refund";
  if (stream.exclusion === "rent_mortgage") return "rent_mortgage";
  if (stream.exclusion === "fee") return "fee";
  if (stream.pfPrimary === "RENT_AND_UTILITIES") return "bill";
  if (stream.pfPrimary === "INSURANCE") return "insurance";
  return null; // subscription candidate
}

function subscriptionConfidence(stream) {
  if (stream.plaidConfirmed) return "High";
  if (SUBSCRIPTION_PF_DETAILED.includes(stream.pfDetailed)) return "High";
  if (SUBSCRIPTION_PF_PRIMARY_HINTS.includes(stream.pfPrimary)) return "Medium";
  return "Low"; // uncertain — omitted from subscription findings
}

function subscriptionAnalyzer(recurring) {
  return recurring
    .filter((item) => classifyRecurringType(item) === null)
    .filter((item) => subscriptionConfidence(item) !== "Low")
    .map((item) => {
      const confidence = subscriptionConfidence(item);
      return {
        type: "subscription",
        title: item.merchant,
        merchant: item.merchant,
        badge: confidence === "High" ? "Recurring subscription detected" : "Possible subscription",
        amount: item.currentAmount,
        frequency: item.frequency,
        monthlyCost: item.currentAmount * (yearlyMultiplier[item.frequency] / 12),
        annualCost: item.currentAmount * yearlyMultiplier[item.frequency],
        confidence,
        firstObserved: item.firstObserved,
        lastObserved: item.lastObserved,
        reason: `${item.count} recurring charges were observed at an approximately ${item.frequency} cadence.`,
        nextSteps: [
          `Log into your ${item.merchant} account and review your current plan and usage.`,
          `If you no longer use this service, cancel it directly with ${item.merchant} or through your account settings.`,
          `Check if a lower tier or free alternative exists that still meets your needs.`,
          `If you cancel, you could save approximately $${Math.round(item.currentAmount * yearlyMultiplier[item.frequency])} per year.`,
        ],
      };
    });
}

// Informational recurring expenses (bills, insurance, debt, rent/mortgage) — NOT framed as cancellable savings
function recurringExpenseAnalyzer(recurring) {
  const keepTypes = new Set(["debt", "bill", "insurance", "rent_mortgage"]);
  const labelMap = {
    debt: { badge: "Recurring debt payment", reason: `${"count"} recurring credit card / loan payments were detected.` },
    bill: { badge: "Recurring bill detected", reason: `${"count"} recurring household-service charges were detected.` },
    insurance: { badge: "Recurring insurance premium", reason: `${"count"} recurring insurance premium charges were detected.` },
    rent_mortgage: { badge: "Recurring rent / mortgage", reason: `${"count"} recurring rent or mortgage payments were detected.` },
  };
  return recurring
    .filter((item) => keepTypes.has(classifyRecurringType(item)))
    .map((item) => {
      const t = classifyRecurringType(item);
      const label = labelMap[t];
      return {
        type: t,
        title: item.merchant,
        merchant: item.merchant,
        badge: label.badge,
        amount: item.currentAmount,
        frequency: item.frequency,
        monthlyCost: item.currentAmount * (yearlyMultiplier[item.frequency] / 12),
        annualCost: item.currentAmount * yearlyMultiplier[item.frequency],
        confidence: item.amountStability >= 0.8 ? "High" : "Medium",
        firstObserved: item.firstObserved,
        lastObserved: item.lastObserved,
        reason: label.reason.replace("count", item.count),
      };
    });
}

function priceIncreaseAnalyzer(recurring) {
  return recurring.flatMap((item) => {
    if (item.exclusion) return []; // skip debt/transfer/income/etc — a payment amount changing is not a "price increase"
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
  const feePatterns = /\bfee\b|overdraft|\bnsf\b|insufficient fund|maintenance|service charge|\batm\b|late fee|monthly fee|annual fee|foreign transaction|wire fee|statement fee|replacement fee|excess activity|minimum balance|return item|paper statement|account fee/;
  const feeTxns = transactions.filter((t) => feePatterns.test(t.merchantKey) || feePatterns.test(cleanText(t.description)));
  if (feeTxns.length === 0) return [];

  const groups = {};
  feeTxns.forEach((t) => {
    const key = `${t.merchantKey}__${t.amount.toFixed(2)}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  const findings = [];
  const oneOffFees = [];

  Object.values(groups).forEach((items) => {
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (items.length >= 2) {
      const total = items.reduce((sum, t) => sum + t.amount, 0);
      const merchant = items[0].merchant;
      const intervals = items.slice(1).map((item, index) => daysBetween(item.date, items[index].date));
      const typicalInterval = intervals.length ? median(intervals) : 0;
      const frequency = typicalInterval >= 330 ? "annual" : typicalInterval >= 24 && typicalInterval <= 40 ? "monthly" : typicalInterval >= 5 && typicalInterval <= 10 ? "weekly" : null;
      const annualImpact = frequency ? Math.round(total * (yearlyMultiplier[frequency] / items.length)) : Math.round(total);
      findings.push({
        type: "fee",
        title: merchant,
        merchant,
        badge: "Recurring bank fee",
        amount: items[items.length - 1].amount,
        date: items[items.length - 1].date,
        recovery: total,
        count: items.length,
        annualImpact,
        frequency,
        reason: `Your bank charged ${items.length} of these fees totaling $${total.toFixed(2)} — a recurring pattern of charges worth questioning.`,
        nextSteps: [
          `Contact your bank and request courtesy waivers for these ${items.length} fees — banks often refund recurring charges for customers in good standing.`,
          `Ask why these fees are being charged and whether your account type should waive them based on your balance or activity.`,
          `If these are maintenance or minimum-balance fees, ask about switching to a no-fee account tier.`,
          `If the bank won't adjust, consider moving to a no-fee bank — these recurring fees cost roughly $${annualImpact} per year.`,
        ],
      });
    } else {
      oneOffFees.push(items[0]);
    }
  });

  oneOffFees.slice(0, 6).forEach((item) => {
    findings.push({
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
    });
  });

  return findings;
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

export function analyzeTransactions(transactions, accounts, plaidRecurringStreams = null) {
  const normalized = normalizeTransactions(transactions, accounts);
  let recurring = recurringPaymentDetector(normalized);
  recurring = mergePlaidRecurring(recurring, plaidRecurringStreams);

  const subscriptionFindings = subscriptionAnalyzer(recurring);
  const otherRecurringFindings = recurringExpenseAnalyzer(recurring);
  const increases = priceIncreaseAnalyzer(recurring);
  const duplicates = overchargeAnalyzer(normalized);
  const fees = bankFeeAnalyzer(normalized);
  const medical = medicalBillingAnalyzer(normalized);

  const recurringAnnual = [...subscriptionFindings, ...otherRecurringFindings].reduce((sum, item) => sum + (item.annualCost || 0), 0);
  const potentialSavings = increases.reduce((sum, item) => sum + item.annualImpact, 0)
    + subscriptionFindings.reduce((sum, item) => sum + (item.annualCost || 0), 0);
  const potentialRecovery = duplicates.reduce((sum, item) => sum + item.recovery, 0) + fees.reduce((sum, item) => sum + item.recovery, 0);

  return {
    summary: { currentRecurringSpending: recurringAnnual, potentialSavings, potentialRecovery, transactionsAnalyzed: normalized.length, accountsAnalyzed: (accounts || []).length },
    findings: [...increases, ...duplicates, ...fees, ...medical, ...subscriptionFindings, ...otherRecurringFindings],
    modules: { settlements: [], productAlerts: [] },
  };
}