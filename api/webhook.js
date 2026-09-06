"use strict";
const { applyWebhook } = require("../lib/registrations.js");

// Stripe signs the exact bytes it sent, so the body must not be parsed before
// verification. This turns Vercel's automatic parsing off.
module.exports.config = { api: { bodyParser: false } };

const rawBody = req => new Promise((resolve, reject) => {
  const chunks = [];
  req.on("data", c => chunks.push(c));
  req.on("end", () => resolve(Buffer.concat(chunks)));
  req.on("error", reject);
});

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const raw = await rawBody(req);
    const { status, body } = await applyWebhook(raw, req.headers["stripe-signature"]);
    res.status(status).json(body);
  } catch (err) {
    console.error("webhook failed:", err);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};
