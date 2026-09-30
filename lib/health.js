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

const { depositMode, paymentLink } = require("./registrations.js");

const has = name => Boolean(process.env[name] && process.env[name].trim());

async function diagnose() {
  const store = process.env.STORE === "airtable" ? "airtable" : "file";
  const mode = depositMode();
  // In link mode the API keys are irrelevant, so the key warnings below must
  // not fire — they would send someone hunting for a problem that isn't there.
  const payments = mode === "api";

  const checks = {
    store,
    airtableTokenSet: has("AIRTABLE_TOKEN"),
    airtableBaseIdSet: has("AIRTABLE_BASE_ID"),
    airtableTable: process.env.AIRTABLE_TABLE || "Registrations",
    depositMode: mode,
    paymentLinkSet: has("STRIPE_PAYMENT_LINK"),
    paymentLinkValid: Boolean(paymentLink()),
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
  if (checks.paymentLinkSet && !checks.paymentLinkValid) {
    problems.push("STRIPE_PAYMENT_LINK is set but is not an https://buy.stripe.com/... URL, so it is being ignored and the site is taking no deposit. Check it was pasted whole.");
  }
  if (mode === "link" && process.env.PAYMENTS_ENABLED === "true") {
    problems.push("Both STRIPE_PAYMENT_LINK and PAYMENTS_ENABLED=true are set. The payment link wins; the Stripe keys are unused. Unset the link to go back to full Checkout.");
  }

  return { ok: problems.length === 0, checks, problems };
}

module.exports = { diagnose };
