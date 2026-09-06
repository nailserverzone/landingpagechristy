"use strict";
const { paymentsEnabled } = require("../lib/registrations.js");

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ paymentsEnabled: paymentsEnabled() });
};
