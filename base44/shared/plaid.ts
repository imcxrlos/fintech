import { secrets } from "base44:runtime";

const hosts = {
  sandbox: "https://sandbox.plaid.com",
  development: "https://development.plaid.com",
  production: "https://production.plaid.com",
};

export function getEnvironment() {
  const environment = secrets.get("PLAID_ENV") || "sandbox";
  if (!hosts[environment]) throw new Error("PLAID_ENV must be sandbox, development, or production");
  return environment;
}

export function deriveWebhookUrl(req) {
  try {
    const url = new URL(req.url);
    return `${url.origin}/functions/plaidWebhook`;
  } catch (_e) {
    return "";
  }
}

export async function plaidRequest(path, body) {
  const host = hosts[getEnvironment()];
  const response = await fetch(`${host}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: secrets.get("PLAID_CLIENT_ID"),
      secret: secrets.get("PLAID_SECRET"),
      ...body,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_message || "Plaid request failed");
  return data;
}

export async function syncAllTransactions(accessToken, cursor = null) {
  let nextCursor = cursor;
  let hasMore = true;
  const transactions = [];
  let rounds = 0;
  while (hasMore && rounds < 10) {
    const sync = await plaidRequest("/transactions/sync", {
      access_token: accessToken,
      cursor: nextCursor,
      count: 500,
    });
    for (const tx of sync.added || []) transactions.push(tx);
    for (const tx of sync.modified || []) transactions.push(tx);
    nextCursor = sync.next_cursor;
    hasMore = Boolean(sync.has_more);
    rounds += 1;
  }
  return { transactions, cursor: nextCursor };
}

// Plaid's recurring-transaction streams endpoint. Returns outflow_streams when the
// "Recurring Transactions" product is enabled on the item; throws otherwise (caught upstream).
export async function getRecurringTransactions(accessToken) {
  return plaidRequest("/transactions/recurring/get", { access_token: accessToken });
}

function b64urlDecode(b64url) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return atob(padded);
}

function b64urlToJson(b64url) {
  return JSON.parse(b64urlDecode(b64url));
}

function b64urlToBuf(b64url) {
  const bin = b64urlDecode(b64url);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export async function verifyPlaidWebhook(rawBody, authHeader) {
  if (!authHeader) throw new Error("Missing Plaid-Verification header");
  const parts = authHeader.split(".");
  if (parts.length !== 3) throw new Error("Malformed verification token");
  const [headerB64, payloadB64, sigB64] = parts;
  const header = b64urlToJson(headerB64);
  const payload = b64urlToJson(payloadB64);

  const host = hosts[getEnvironment()];
  const jwksRes = await fetch(`${host}/.well-known/jwks.json`);
  if (!jwksRes.ok) throw new Error("Failed to fetch Plaid JWKS");
  const jwks = await jwksRes.json();
  const key = (jwks.keys || []).find((k) => k.kid === header.kid);
  if (!key) throw new Error("No matching Plaid verification key");

  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    key,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBuf = b64urlToBuf(sigB64);
  const dataBuf = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, sigBuf, dataBuf);
  if (!valid) throw new Error("Invalid webhook signature");

  const clientId = secrets.get("PLAID_CLIENT_ID");
  if (payload.iss && payload.iss !== "plaid") throw new Error("Invalid webhook issuer");
  if (payload.aud && clientId && payload.aud !== clientId) throw new Error("Invalid webhook audience");
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Expired webhook token");

  if (payload.request_body_checksum) {
    const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawBody));
    const hashHex = Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    if (hashHex !== payload.request_body_checksum) throw new Error("Webhook body checksum mismatch");
  }

  return payload;
}