import { plaidRequest } from "../../shared/plaid.ts";

export default async function(req) {
  try {
    const { clientUserId } = await req.json();
    if (!clientUserId) return Response.json({ error: "A scan session is required" }, { status: 400 });
    const data = await plaidRequest("/link/token/create", {
      user: { client_user_id: String(clientUserId) },
      client_name: "CXRLOS",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });
    return Response.json({ linkToken: data.link_token, expiration: data.expiration });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}