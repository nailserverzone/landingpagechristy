/* Be Your Own Superhero™ Retreat — registration + deposit server.
 *
 * Serves the static page and handles the $300 deposit through Stripe Checkout.
 *
 * Deliberate choices worth keeping if this moves to another host:
 *  - The browser sends a room `id`, never an amount. Prices come from rooms.js
 *    server-side, so a tampered request can't change what is charged.
 *  - The registration row is written BEFORE redirecting to Stripe, with status
 *    "pending". The webhook flips it to "confirmed". The success page never
 *    confirms anything — a guest closing the tab must not lose their booking.
 *  - The deposit saves the card (`setup_future_usage: off_session`) so the
 *    remaining balance can be charged later without asking the guest again.
 *
 * The JSON file store is a stand-in. Production needs a real database with a
 * transaction around "check capacity, then reserve", or two guests hitting
 * submit together can oversell the last bed.
 */
"use strict";

require("dotenv").config();

const path = require("node:path");
const fs = require("node:fs");
const express = require("express");
const Stripe = require("stripe");

const { DEPOSIT_CENTS, MAX_GUESTS, WAITLIST_ID, money, findRoom } = require("./rooms.js");

const PORT = process.env.PORT || 4242;
const ORIGIN = process.env.PUBLIC_ORIGIN || `http://localhost:${PORT}`;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, "data", "registrations.json");

// Online payment is OFF until Christy's Stripe account is live. Registrations
// are still captured in full; she is emailed and arranges payment directly.
// Opt in explicitly with PAYMENTS_ENABLED=true — never default this on.
const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === "true";

if (PAYMENTS_ENABLED && !process.env.STRIPE_SECRET_KEY) {
  console.error("PAYMENTS_ENABLED=true but STRIPE_SECRET_KEY is missing.");
  process.exit(1);
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const app = express();

// ── tiny JSON store ───────────────────────────────────────────────────────────
const readAll = () => {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return []; }
};
const writeAll = rows => {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2));
};
const saveRegistration = row => {
  const rows = readAll();
  const i = rows.findIndex(r => r.id === row.id);
  if (i === -1) rows.push(row); else rows[i] = { ...rows[i], ...row };
  writeAll(rows);
  return row;
};

const confirmed = () => readAll().filter(r => r.status === "confirmed");
const bedsTaken = roomId => confirmed().filter(r => r.roomId === roomId).length;
const guestsBooked = () => confirmed().length;

// ── field handling ────────────────────────────────────────────────────────────
const REQUIRED = ["name", "email", "mobile", "ecname", "ecphone"];
const OPTIONAL = ["address", "roommate", "diet", "access", "health", "massage", "size", "source"];

const clean = v => (typeof v === "string" ? v.trim().slice(0, 2000) : "");

// Deliberately permissive: the point is to catch typos, not to police which
// addresses are real. Stripe re-validates before it sends any receipt.
const looksLikeEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ── webhook ───────────────────────────────────────────────────────────────────
// Mounted before express.json() so the raw body survives for signature checking.
app.post("/api/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return res.status(503).send("Payments are not enabled");

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], secret);
  } catch (err) {
    // A bad signature means the request did not come from Stripe. Never act on it.
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Both events matter: cards settle immediately, but delayed methods land on
  // async_payment_succeeded minutes or days later.
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    const id = session.metadata?.registrationId;

    if (id && session.payment_status === "paid") {
      saveRegistration({
        id,
        status: "confirmed",
        depositPaidCents: session.amount_total,
        stripeSessionId: session.id,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
        confirmedAt: new Date().toISOString(),
      });
      console.log(`✔ deposit confirmed for registration ${id}`);
      // TODO: send the guest their confirmation email and notify Christy.
    }
  }

  res.json({ received: true });
});

app.use(express.json({ limit: "64kb" }));

// ── create a checkout session ─────────────────────────────────────────────────
app.post("/api/checkout", async (req, res) => {
  try {
    const body = req.body || {};
    const roomId = clean(body.roomId);

    const missing = REQUIRED.filter(f => !clean(body[f]));
    if (missing.length) return res.status(400).json({ error: `Missing required field(s): ${missing.join(", ")}` });
    if (!looksLikeEmail(clean(body.email))) return res.status(400).json({ error: "That email address doesn't look right." });
    if (body.policies !== true) return res.status(400).json({ error: "The cancellation and participation policies must be accepted." });

    const details = {};
    for (const f of [...REQUIRED, ...OPTIONAL]) details[f] = clean(body[f]);
    details.media = body.media === true;

    const registrationId = `reg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    // Waitlist: record interest, take no money.
    if (roomId === WAITLIST_ID) {
      saveRegistration({
        id: registrationId, roomId: WAITLIST_ID, status: "waitlist",
        ...details, createdAt: new Date().toISOString(),
      });
      return res.json({ waitlisted: true, registrationId });
    }

    const room = findRoom(roomId);
    if (!room) return res.status(400).json({ error: "Unknown room selection." });
    if (guestsBooked() >= MAX_GUESTS) {
      return res.status(409).json({ error: "The retreat is full. Please choose the waitlist and you will be first to hear when a place opens." });
    }
    if (bedsTaken(room.id) >= room.capacity) {
      return res.status(409).json({ error: `${room.name} is now full. Please choose another room or join the waitlist.` });
    }

    const base = {
      id: registrationId, roomId: room.id, roomName: `${room.house} — ${room.name}`,
      totalCents: room.priceCents, depositDueCents: DEPOSIT_CENTS,
      ...details, createdAt: new Date().toISOString(),
    };

    // Placeholder mode: capture everything, charge nothing, hand off to Christy.
    if (!PAYMENTS_ENABLED) {
      saveRegistration({ ...base, status: "awaiting_payment" });
      console.log(`▸ registration held for ${details.name} (${room.name}) — payment to be arranged`);
      // TODO: email Christy the registration once a mail provider is connected.
      return res.json({ deferred: true, registrationId });
    }

    saveRegistration({ ...base, status: "pending" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: details.email,
      client_reference_id: registrationId,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: DEPOSIT_CENTS,
          product_data: {
            name: "Be Your Own Superhero™ Retreat — deposit",
            description:
              `${room.house} — ${room.name}. Holds your place for September 18–20, 2026. ` +
              `Applied to your ${money(room.priceCents)} total; the remaining ` +
              `${money(room.priceCents - DEPOSIT_CENTS)} is due before the retreat.`,
          },
        },
      }],
      // Saves the card so the balance can be charged later without the guest
      // re-entering their details.
      payment_intent_data: {
        setup_future_usage: "off_session",
        description: `Retreat deposit — ${details.name} — ${room.name}`,
      },
      metadata: { registrationId, roomId: room.id, guestName: details.name },
      success_url: `${ORIGIN}/?reserved=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ORIGIN}/?reserved=0#reserve`,
    });

    saveRegistration({ id: registrationId, stripeSessionId: session.id });
    res.json({ url: session.url, registrationId });
  } catch (err) {
    console.error("Checkout failed:", err);
    res.status(500).json({ error: "Could not start checkout. Please try again." });
  }
});

// The page asks on load whether it can take money. If this call fails — say the
// site is served as plain static files — the UI stays in placeholder mode,
// which is the safe way to be wrong.
app.get("/api/config", (_req, res) => res.json({ paymentsEnabled: PAYMENTS_ENABLED }));

// Lets the success banner name the guest without trusting the query string.
app.get("/api/registration", async (req, res) => {
  if (!stripe) return res.status(503).json({ error: "Payments are not enabled" });
  const sessionId = clean(req.query.session_id);
  if (!sessionId) return res.status(400).json({ error: "session_id required" });
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const row = readAll().find(r => r.id === session.metadata?.registrationId);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({ name: row.name, email: row.email, roomName: row.roomName, status: row.status });
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

app.use(express.static(__dirname, { extensions: ["html"] }));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Retreat site → ${ORIGIN}`);
    if (PAYMENTS_ENABLED) {
      console.log(`Payments     → LIVE. Webhooks: stripe listen --forward-to ${ORIGIN}/api/webhook`);
    } else {
      console.log("Payments     → placeholder. Registrations are captured; no card is charged.");
      console.log("               Set PAYMENTS_ENABLED=true once Christy's Stripe account is ready.");
    }
  });
}

module.exports = app;
