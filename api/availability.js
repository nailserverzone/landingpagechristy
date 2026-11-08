"use strict";
const { availability } = require("../lib/registrations.js");

/* Live room availability, read from the registration store on every request.
 *
 * Never cached: a stale answer here means the page offers a bed that has gone,
 * and the guest only finds out after filling the form. */
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    res.status(200).json(await availability());
  } catch (err) {
    // The page falls back to showing every room as available, which is the
    // same behaviour it had before this endpoint existed. The server still
    // refuses an oversold room at submit time, so a wrong label cannot become
    // a wrong booking.
    console.error("availability failed:", err);
    res.status(200).json({ rooms: null, error: "unavailable" });
  }
};
