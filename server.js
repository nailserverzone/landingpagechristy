/* Local development server.
 *
 * Serves the static site and mounts the same handlers the Vercel functions in
 * /api use, so `npm start` behaves like the deployed site. In production this
 * file is not run — Vercel serves the static files and invokes /api directly.
 */
"use strict";

require("dotenv").config();

const express = require("express");
const { getStore } = require("./lib/store.js");
const { paymentsEnabled, createRegistration, applyWebhook, lookupBySession } = require("./lib/registrations.js");

const PORT = process.env.PORT || 4242;
const ORIGIN = process.env.PUBLIC_ORIGIN || `http://localhost:${PORT}`;

const app = express();

// Mounted before the JSON parser so the raw bytes survive for Stripe's
// signature check.
app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const { status, body } = await applyWebhook(req.body, req.headers["stripe-signature"]);
  res.status(status).json(body);
});

app.use(express.json({ limit: "64kb" }));

app.get("/api/config", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ paymentsEnabled: paymentsEnabled() });
});

app.post("/api/checkout", async (req, res) => {
  try {
    const { status, body } = await createRegistration(req.body, req);
    res.status(status).json(body);
  } catch (err) {
    console.error("checkout failed:", err);
    res.status(500).json({ error: "Could not submit your registration. Please try again." });
  }
});

app.get("/api/registration", async (req, res) => {
  const { status, body } = await lookupBySession(req.query.session_id);
  res.status(status).json(body);
});

app.use(express.static(__dirname, { extensions: ["html"] }));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Coaching (home) → ${ORIGIN}/`);
    console.log(`Retreat         → ${ORIGIN}/retreat.html`);
    console.log(`Storage         → ${getStore().name}`);
    if (paymentsEnabled()) {
      console.log(`Payments        → LIVE. stripe listen --forward-to ${ORIGIN}/api/webhook`);
    } else {
      console.log("Payments        → placeholder. Registrations captured, no card charged.");
    }
  });
}

module.exports = app;
