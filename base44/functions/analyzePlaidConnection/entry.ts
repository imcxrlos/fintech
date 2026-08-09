import { plaidRequest } from "../../shared/plaid.ts";
import { analyzeTransactions } from "../../shared/transactionAnalysis.ts";

export default async function(req) {
  try {
    const { publicToken } = await req.json();
    if (!publicToken) return Response.json({ error: "A Plaid public token is required" }, { status: 400 });
    const exchange = await plaidRequest("/item/public_token/exchange", { public_token: publicToken });
    const accessToken = exchange.access_token;
    let cursor = null;
    let hasMore = true;
    let transactions = [];
    let rounds = 0;
    while (hasMore && rounds < 10) {
      const sync = await plaidRequest("/transactions/sync", { access_token: accessToken, cursor, count: 500 });
      transactions = transactions.concat(sync.added || [], sync.modified || []);
      cursor = sync.next_cursor;
      hasMore = Boolean(sync.has_more);
      rounds += 1;
    }
    const accountData = await plaidRequest("/accounts/get", { access_token: accessToken });
    return Response.json(analyzeTransactions(transactions, accountData.accounts || []));
  } catch (error) {
    const status = /not yet ready|PRODUCT_NOT_READY/i.test(error.message) ? 202 : 500;
    return Response.json({ error: status === 202 ? "Plaid is still preparing transaction history. Please try this scan again shortly." : error.message }, { status });
  }
}