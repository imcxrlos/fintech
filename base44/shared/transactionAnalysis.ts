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

function subscriptionAnalyzer(recurring) {
  const billTerms = /UTILITIES|TELECOMMUNICATION|INSURANCE|RENT|MORTGAGE|GAS|ELECTRIC|WATER|INTERNET|PHONE/;
  return recurring.filter((item) => !billTerms.test(item.category)).map((item) => ({
    type: "subscription", title: item.merchant, badge: "Recurring subscription detected", amount: item.currentAmount,
    frequency: item.frequency, monthlyCost: item.currentAmount * (yearlyMultiplier[item.frequency] / 12), annualCost: item.currentAmount * yearlyMultiplier[item.frequency],
    confidence: item.confidence, firstObserved: item.firstObserved, lastObserved: item.lastObserved,
    reason: `${item.count} similarly timed charges were observed at an approximately ${item.frequency} cadence.`,
  }));
}

function billAnalyzer(recurring) {
  const billTerms = /UTILITIES|TELECOMMUNICATION|INSURANCE|RENT|MORTGAGE|GAS|ELECTRIC|WATER|INTERNET|PHONE/;
  return recurring.filter((item) => billTerms.test(item.category)).map((item) => ({
    type: "bill", title: item.merchant, badge: "Recurring bill detected", amount: item.currentAmount, frequency: item.frequency,
    monthlyCost: item.currentAmount * (yearlyMultiplier[item.frequency] / 12), annualCost: item.currentAmount * yearlyMultiplier[item.frequency],
    confidence: item.confidence, firstObserved: item.firstObserved, lastObserved: item.lastObserved,
    reason: `${item.count} recurring household-service charges were detected.`,
  }));
}

function priceIncreaseAnalyzer(recurring) {
  return recurring.flatMap((item) => {
    if (item.transactions.length < 3) return [];
    const previous = median(item.transactions.slice(0, -1).map((transaction) => transaction.amount));
    const increase = item.currentAmount - previous;
    if (increase < 1 || increase / previous < 0.05) return [];
    const annualImpact = increase * yearlyMultiplier[item.frequency];
    return [{ type: "increase", title: item.merchant, badge: "Potential price increase", amount: item.currentAmount, previousAmount: previous, increase, annualImpact, frequency: item.frequency, reason: `The latest charge is ${Math.round((increase / previous) * 100)}% above the previous observed median.` }];
  });
}

function overchargeAnalyzer(transactions) {
  const findings = [];
  for (let i = 0; i < transactions.length; i += 1) {
    for (let j = i + 1; j < transactions.length; j += 1) {
      const first = transactions[i]; const second = transactions[j];
      if (first.merchantKey === second.merchantKey && Math.abs(first.amount - second.amount) < 0.01 && daysBetween(first.date, second.date) <= 3) {
        findings.push({ type: "duplicate", title: "Potential duplicate charge", merchant: second.merchant, badge: "Worth reviewing", amount: second.amount, recovery: second.amount, reason: `Two matching ${second.merchant} charges were detected within ${daysBetween(first.date, second.date)} day${daysBetween(first.date, second.date) === 1 ? "" : "s"}.` });
        break;
      }
    }
  }
  return findings;
}

export function analyzeTransactions(transactions, accounts) {
  const normalized = normalizeTransactions(transactions, accounts);
  const recurring = recurringPaymentDetector(normalized);
  const recurringFindings = [...subscriptionAnalyzer(recurring), ...billAnalyzer(recurring)];
  const increases = priceIncreaseAnalyzer(recurring);
  const duplicates = overchargeAnalyzer(normalized);
  const recurringAnnual = recurringFindings.reduce((sum, item) => sum + item.annualCost, 0);
  const potentialSavings = increases.reduce((sum, item) => sum + item.annualImpact, 0);
  const potentialRecovery = duplicates.reduce((sum, item) => sum + item.recovery, 0);
  return { summary: { currentRecurringSpending: recurringAnnual, potentialSavings, potentialRecovery, transactionsAnalyzed: normalized.length, accountsAnalyzed: accounts.length }, findings: [...increases, ...duplicates, ...recurringFindings], modules: { settlements: [], productAlerts: [] } };
}