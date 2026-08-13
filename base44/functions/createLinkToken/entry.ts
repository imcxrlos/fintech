import { plaidRequest, deriveWebhookUrl } from "../../shared/plaid.ts";

export default async function(req) {
  try {
    const { clientUserId } = await req.json();
    if (!clientUserId) return Response.json({ error: "A scan session is required" }, { status: 400 });

    const body = {
      user: { client_user_id: String(clientUserId) },
      client_name: "Savings Scan",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    };

    const webhookUrl = deriveWebhookUrl(req);
    if (webhookUrl) body.webhook = webhookUrl;

    const data = await plaidRequest("/link/token/create", body);
    return Response.json({ linkToken: data.link_token, expiration: data.expiration });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}