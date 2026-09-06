"use strict";
const { createRegistration } = require("../lib/registrations.js");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { status, body: out } = await createRegistration(body, req);
    res.status(status).json(out);
  } catch (err) {
    console.error("checkout failed:", err);
    res.status(500).json({ error: "Could not submit your registration. Please try again." });
  }
};
