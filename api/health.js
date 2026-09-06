"use strict";
const { diagnose } = require("../lib/health.js");

module.exports = async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const report = await diagnose();
    res.status(report.ok ? 200 : 503).json(report);
  } catch (err) {
    res.status(500).json({ ok: false, problems: [String(err.message)] });
  }
};
