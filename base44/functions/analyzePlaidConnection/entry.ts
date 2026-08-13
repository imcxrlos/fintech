import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { plaidRequest, syncAllTransactions, getRecurringTransactions } from "../../shared/plaid.ts";
import { analyzeTransactions, extractResearchTargets, mergeResearchFindings } from "../../shared/transactionAnalysis.ts";

export default async function(req) {
  try {
    const { publicToken } = await req.json();
    if (!publicToken) return Response.json({ error: "A Plaid public token is required" }, { status: 400 });
    const exchange = await plaidRequest("/item/public_token/exchange", { public_token: publicToken });
    const accessToken = exchange.access_token;
    const itemId = exchange.item_id;
    const { transactions, cursor } = await syncAllTransactions(accessToken);
    const accountData = await plaidRequest("/accounts/get", { access_token: accessToken });

    // Prefer Plaid's purpose-built /transactions/recurring/get when the product is enabled.
    // If unavailable for this account, fall back silently to rules-based detection.
    let plaidRecurring = null;
    try {
      const recurringResp = await getRecurringTransactions(accessToken);
      plaidRecurring = recurringResp?.outflow_streams || [];
      console.log("[analyzePlaidConnection] /transactions/recurring/get available —", plaidRecurring.length, "outflow streams");
    } catch (recurringError) {
      console.log("[analyzePlaidConnection] /transactions/recurring/get unavailable, using rules-based detection:", recurringError.message);
      plaidRecurring = null;
    }

    const baseResult = analyzeTransactions(transactions, accountData.accounts || [], plaidRecurring);

    try {
      const base44 = createClientFromRequest(req);
      let userId = null;
      try { const currentUser = await base44.auth.me(); if (currentUser) userId = currentUser.id; } catch (_e) {}
      try {
        await base44.asServiceRole.entities.PlaidItem.create({
          item_id: itemId,
          access_token: accessToken,
          cursor,
          user_id: userId,
          products: ["transactions"],
          status: "active",
        });
      } catch (itemError) {
        console.error("[analyzePlaidConnection] store item failed:", itemError.message);
      }

      const { merchants, employers } = extractResearchTargets(transactions);

      if (merchants.length > 0 || employers.length > 0) {
        const merchantList = merchants.join(", ");
        const employerList = employers.join(", ");
        const prompt = `You are a financial research assistant. Based on the following list of merchants where this user has made purchases${employers.length > 0 ? ` and employers detected from payroll deposits` : ""}, search the web for ACTIVE, currently-open opportunities that this person may be eligible for.

1. ACTIVE class action settlements where consumers can file a claim for money back from these merchants.
2. ACTIVE product recalls — safety recalls, refund programs, or replacement programs related to products from these merchants.
3. Wage-related opportunities — active wage theft settlements, unpaid overtime class actions, or labor board actions${employers.length > 0 ? " related to these employers" : ""}.

Only include opportunities that are:
- Currently open and accepting claims (not expired)
- Verifiable through an official source (court website, CPSC.gov, FTC.gov, NLRB.gov, or official settlement site)
- Relevant to the merchants or employers listed

For each opportunity provide: merchant, category ("settlement", "recall", or "wage"), title, description (1-2 sentences), potential_amount (estimated dollar recovery, 0 if unknown), deadline (filing deadline if known, empty string if not), source_url (official URL), and next_steps (array of 2-4 concrete steps).

If you find no active verifiable opportunities for a merchant, skip it. Do NOT fabricate — only return real, currently-open opportunities verified through web search.

Merchants: ${merchantList || "None detected"}
Employers: ${employerList || "None detected"}`;

        const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt,
          add_context_from_internet: true,
          model: "gemini_3_flash",
          response_json_schema: {
            type: "object",
            properties: {
              opportunities: {
                type: "array",
                items: {
                  type: "object",
                  "properties": {
                    merchant: { type: "string" },
                    category: { type: "string", enum: ["settlement", "recall", "wage"] },
                    title: { type: "string" },
                    description: { type: "string" },
                    potential_amount: { type: "number" },
                    deadline: { type: "string" },
                    source_url: { type: "string" },
                    next_steps: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
          },
        });

        return Response.json(mergeResearchFindings(baseResult, llmResponse));
      }
    } catch (_researchError) {
      // LLM research failed — return rule-based findings only
    }

    return Response.json(baseResult);
  } catch (error) {
    const status = /not yet ready|PRODUCT_NOT_READY/i.test(error.message) ? 202 : 500;
    return Response.json({ error: status === 202 ? "Plaid is still preparing transaction history. Please try this scan again shortly." : error.message }, { status });
  }
}