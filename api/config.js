"use strict";
const { depositMode } = require("../lib/registrations.js");

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const mode = depositMode();
  // `paymentsEnabled` is what the page asks: "will this form take a deposit?"
  // Both live modes answer yes, so the copy and the button match reality.
  res.status(200).json({ paymentsEnabled: mode !== "none", mode });
};
