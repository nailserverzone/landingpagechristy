/* Registration logic, shared by the local Express server and the Vercel
 * functions in /api. Both call the same functions, so local behaviour and
 * deployed behaviour cannot drift apart.
 */
"use strict";

const Stripe = require("stripe");
const { DEPOSIT_CENTS, MAX_GUESTS, WAITLIST_ID, money, findRoom } = require("../rooms.js");
const { nextOpenRetreat } = require("../retreat-dates.js");
const { text, REQUIRED, OPTIONAL, validateRegistration, firstError } = require("../validate.js");
const { getStore } = require("./store.js");

// Online payment is OFF unless explicitly enabled, so a missing or misspelled
// env var can never result in the site quietly taking money it can't handle.
const paymentsEnabled = () => process.env.PAYMENTS_ENABLED === "true";

// A Stripe Payment Link Christy created in her own dashboard. Setting this is
// the whole of the payment setup — no API key, no webhook, no team access.
// It must be a Stripe-hosted URL: anything else would let a stray env var
// redirect paying guests to an attacker's page.
const paymentLink = () => {
  const raw = (process.env.STRIPE_PAYMENT_LINK || "").trim();
  if (!raw) return null;
  let u;
  try { u = new URL(raw); } catch { return null; }
  const ok = u.protocol === "https:" &&
    (u.hostname === "buy.stripe.com" || u.hostname.endsWith(".stripe.com"));
  return ok ? u : null;
};

/* Which of the three payment modes is configured.
 *   "api"  — full Stripe Checkout: prices server-side, webhook confirms, card
 *            saved for the balance. Needs PAYMENTS_ENABLED and a secret key.
 *   "link" — redirect to Christy's own Payment Link. Takes the deposit, but
 *            nothing reports back, so rows stay `awaiting_payment` until she
 *            ticks them off against her Stripe dashboard.
 *   "none" — collect the registration, charge nothing, Christy follows up.
 * `link` is checked first so that unsetting one variable switches modes. */
const depositMode = () => {
  if (paymentLink()) return "link";
  return paymentsEnabled() ? "api" : "none";
};

const stripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
};

const origin = req => {
  if (process.env.PUBLIC_ORIGIN) return process.env.PUBLIC_ORIGIN;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  return host ? `${proto}://${host}` : "http://localhost:4242";
};

const newId = () => `reg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const confirmedRows = rows => rows.filter(r => r.status === "confirmed");

/** Handles a registration submission. Returns { status, body }. */
async function createRegistration(body, req) {
  const store = getStore();
  const data = body || {};
  const roomId = text(data.roomId);
  const waitlisting = roomId === WAITLIST_ID;

  // The waitlist takes no money and holds no room, so the policy checkbox
  // (which is about cancellation terms) does not apply to it.
  const errors = validateRegistration(data, { requirePolicies: !waitlisting });
  if (Object.keys(errors).length) {
    return { status: 400, body: { error: firstError(errors), errors } };
  }

  const details = {};
  for (const f of [...REQUIRED, ...OPTIONAL]) details[f] = text(data[f]);
  details.media = data.media === true;

  const id = newId();

  if (waitlisting) {
    await store.save({ id, roomId: WAITLIST_ID, status: "waitlist", ...details, createdAt: new Date().toISOString() });
    return { status: 200, body: { waitlisted: true, registrationId: id } };
  }

  const room = findRoom(roomId);
  if (!room) return { status: 400, body: { error: "Please choose a room." } };

  const rows = await store.list();
  if (confirmedRows(rows).length >= MAX_GUESTS) {
    return { status: 409, body: { error: "The retreat is full. Please choose the waitlist and you will be first to hear when a place opens." } };
  }
  if (confirmedRows(rows).filter(r => r.roomId === room.id).length >= room.capacity) {
    return { status: 409, body: { error: `${room.name} is now full. Please choose another room or join the waitlist.` } };
  }

  const mode = depositMode();

  if (mode === "api" && !process.env.STRIPE_SECRET_KEY) {
    return {
      status: 503,
      body: {
        error: "Registration is temporarily unavailable. Please try again shortly.",
        code: "payments_enabled_without_key",
      },
    };
  }

  const base = {
    id, roomId: room.id, roomName: `${room.house} — ${room.name}`,
    totalCents: room.priceCents, depositDueCents: DEPOSIT_CENTS,
    ...details, createdAt: new Date().toISOString(),
  };

  // Placeholder mode: capture everything, charge nothing, hand off to Christy.
  if (mode === "none") {
    await store.save({ ...base, status: "awaiting_payment" });
    return { status: 200, body: { deferred: true, registrationId: id } };
  }

  // Payment Link mode. Nothing reports back from Stripe, so the row stays
  // `awaiting_payment` and Christy confirms it by hand. The registration id
  // rides along as client_reference_id so it appears beside the payment in her
  // dashboard — that is what turns reconciliation into a lookup, not a guess.
  if (mode === "link") {
    const url = paymentLink();
    url.searchParams.set("client_reference_id", id);
    if (details.email) url.searchParams.set("prefilled_email", details.email);
    await store.save({ ...base, status: "awaiting_payment", paymentMode: "link" });
    return { status: 200, body: { url: url.toString(), registrationId: id } };
  }

  await store.save({ ...base, status: "pending" });

  const site = origin(req);
  // Read at request time, not module load, so a date edit takes effect on the
  // next request rather than the next deploy.
  const lead = nextOpenRetreat();
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: details.email,
    client_reference_id: id,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: DEPOSIT_CENTS,
        product_data: {
          name: "Be Your Own Superhero™ Retreat — deposit",
          description:
            `${room.house} — ${room.name}. Holds your place for the retreat` +
            `${lead ? ` on ${lead.label}` : ", dates to be announced"}. ` +
            `Applied to your ${money(room.priceCents)} total; the remaining ` +
            `${money(room.priceCents - DEPOSIT_CENTS)} is due before the retreat.`,
        },
      },
    }],
    // Saves the card so the balance can be charged later without asking again.
    payment_intent_data: {
      setup_future_usage: "off_session",
      description: `Retreat deposit — ${details.name} — ${room.name}`,
    },
    metadata: { registrationId: id, roomId: room.id, guestName: details.name },
    success_url: `${site}/retreat.html?reserved=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/retreat.html?reserved=0#reserve`,
  });

  await store.save({ id, stripeSessionId: session.id });
  return { status: 200, body: { url: session.url, registrationId: id } };
}

/** Verifies and applies a Stripe webhook. `raw` must be the untouched body. */
async function applyWebhook(raw, signature) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return { status: 503, body: { error: "Payments are not enabled" } };

  let event;
  try {
    event = stripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    // A bad signature means this did not come from Stripe. Never act on it.
    return { status: 400, body: { error: `Webhook Error: ${err.message}` } };
  }

  // Cards settle at once; delayed methods arrive on the async event later.
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const s = event.data.object;
    const id = s.metadata?.registrationId;
    if (id && s.payment_status === "paid") {
      await getStore().save({
        id,
        status: "confirmed",
        depositPaidCents: s.amount_total,
        stripeSessionId: s.id,
        stripeCustomerId: typeof s.customer === "string" ? s.customer : null,
        stripePaymentIntentId: typeof s.payment_intent === "string" ? s.payment_intent : null,
        confirmedAt: new Date().toISOString(),
      });
      // TODO: email the guest her confirmation and notify Christy.
    }
  }
  return { status: 200, body: { received: true } };
}

/** Backs the success banner, so it names the guest without trusting the URL. */
async function lookupBySession(sessionId) {
  if (!sessionId) return { status: 400, body: { error: "session_id required" } };
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    const row = await getStore().get(session.metadata?.registrationId);
    if (!row) return { status: 404, body: { error: "Not found" } };
    return { status: 200, body: { name: row.name, email: row.email, roomName: row.roomName, status: row.status } };
  } catch {
    return { status: 404, body: { error: "Not found" } };
  }
}

module.exports = { paymentsEnabled, paymentLink, depositMode, createRegistration, applyWebhook, lookupBySession };
