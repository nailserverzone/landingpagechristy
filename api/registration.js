"use strict";
const { lookupBySession } = require("../lib/registrations.js");

module.exports = async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const { status, body } = await lookupBySession(url.searchParams.get("session_id"));
  res.status(status).json(body);
};
