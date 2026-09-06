/* Configuration health check.
 *
 * Reports whether the site is wired up correctly, so a failed registration can
 * be diagnosed without digging through deployment logs.
 *
 * Reports only booleans and error text — never the value of a token or key.
 * Airtable's own error messages are truncated and passed through, because
 * "invalid permissions" and "base not found" need different fixes.
 */
"use strict";

const has = name => Boolean(process.env[name] && process.env[name].trim());

async function diagnose() {
  const store = process.env.STORE === "airtable" ? "airtable" : "file";
  const payments = process.env.PAYMENTS_ENABLED === "true";

  const checks = {
    store,
    airtableTokenSet: has("AIRTABLE_TOKEN"),
    airtableBaseIdSet: has("AIRTABLE_BASE_ID"),
    airtableTable: process.env.AIRTABLE_TABLE || "Registrations",
    paymentsEnabled: payments,
    stripeSecretKeySet: has("STRIPE_SECRET_KEY"),
    stripeWebhookSecretSet: has("STRIPE_WEBHOOK_SECRET"),
    stripeKeyMode: has("STRIPE_SECRET_KEY")
      ? (/_test_/.test(process.env.STRIPE_SECRET_KEY) ? "test" : "live")
      : null,
  };

  const problems = [];

  if (store === "file") {
    problems.push(
      "STORE is not set to 'airtable'. On Vercel the file store cannot persist anything — registrations would be lost."
    );
  }

  if (store === "airtable") {
    if (!checks.airtableTokenSet) problems.push("AIRTABLE_TOKEN is not set.");
    if (!checks.airtableBaseIdSet) problems.push("AIRTABLE_BASE_ID is not set.");

    // The only check that proves token, base ID and permissions all agree.
    if (checks.airtableTokenSet && checks.airtableBaseIdSet) {
      const url =
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}` +
        `/${encodeURIComponent(checks.airtableTable)}?maxRecords=1`;
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
        });
        checks.airtableReachable = res.ok;
        if (!res.ok) {
          const detail = (await res.text()).slice(0, 300);
          checks.airtableError = `${res.status} ${detail}`;
          if (res.status === 401) problems.push("Airtable rejected the token (401). It is wrong, revoked, or expired.");
          else if (res.status === 403) problems.push("Airtable returned 403. The token is valid but lacks access to this base, or is missing data.records:read / data.records:write.");
          else if (res.status === 404) problems.push(`Airtable returned 404. Check AIRTABLE_BASE_ID, and that a table named "${checks.airtableTable}" exists.`);
          else problems.push(`Airtable returned ${res.status}.`);
        }
      } catch (err) {
        checks.airtableReachable = false;
        checks.airtableError = String(err.message).slice(0, 300);
        problems.push("Could not reach the Airtable API at all.");
      }
    }
  }

  if (payments && !checks.stripeSecretKeySet) {
    problems.push("PAYMENTS_ENABLED is true but STRIPE_SECRET_KEY is not set — every registration will fail. Either add the key or set PAYMENTS_ENABLED to false.");
  }
  if (payments && !checks.stripeWebhookSecretSet) {
    problems.push("PAYMENTS_ENABLED is true but STRIPE_WEBHOOK_SECRET is not set. Checkout will work, but paid registrations will never be marked confirmed.");
  }
  if (payments && checks.stripeKeyMode === "live") {
    problems.push("STRIPE_SECRET_KEY is a LIVE key. Real cards will be charged into whichever account it belongs to.");
  }

  return { ok: problems.length === 0, checks, problems };
}

module.exports = { diagnose };
