import { secrets } from "base44:runtime";

const hosts = {
  sandbox: "https://sandbox.plaid.com",
  development: "https://development.plaid.com",
  production: "https://production.plaid.com",
};

export async function plaidRequest(path, body) {
  const environment = secrets.get("PLAID_ENV") || "sandbox";
  const host = hosts[environment];
  if (!host) throw new Error("PLAID_ENV must be sandbox, development, or production");

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