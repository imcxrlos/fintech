import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { waitUntil } from "base44:runtime";
import { verifyPlaidWebhook, syncAllTransactions } from "../../shared/plaid.ts";

export default async function(req) {
  let rawBody = "";
  try {
    rawBody = await req.text();
    const authHeader = req.headers.get("Plaid-Verification") || "";
    await verifyPlaidWebhook(rawBody, authHeader);
  } catch (verifyError) {
    console.error("[plaidWebhook] verification failed:", verifyError.message);
    return Response.json({ ok: false, reason: "verification_failed" }, { status: 200 });
  }

  try {
    const event = JSON.parse(rawBody);
    const webhookType = event.webhook_type;
    const webhookCode = event.webhook_code;
    const itemId = event.item_id;
    console.log(`[plaidWebhook] type=${webhookType} code=${webhookCode} item=${itemId}`);

    if (
      webhookType === "TRANSACTIONS" &&
      ["SYNC_UPDATES_AVAILABLE", "INITIAL_UPDATE", "HISTORICAL_UPDATE"].includes(webhookCode) &&
      itemId
    ) {
      waitUntil(processTransactionUpdate(req, itemId));
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[plaidWebhook] handling error:", error.message);
    return Response.json({ ok: false }, { status: 200 });
  }
}

async function processTransactionUpdate(req, itemId) {
  try {
    const base44 = createClientFromRequest(req);
    const items = await base44.asServiceRole.entities.PlaidItem.filter({ item_id: itemId }, "-created_date", 1);
    const plaidItem = items[0];
    if (!plaidItem) {
      console.warn("[plaidWebhook] no PlaidItem found for item", itemId);
      return;
    }
    const { transactions, cursor } = await syncAllTransactions(plaidItem.access_token, plaidItem.cursor || null);
    await base44.asServiceRole.entities.PlaidItem.update(plaidItem.id, { cursor });
    console.log(`[plaidWebhook] synced ${transactions.length} transactions for item ${itemId}`);
  } catch (error) {
    console.error("[plaidWebhook] sync error for item", itemId, ":", error.message);
  }
}