/* Retreat dates — the only file to edit when dates change.
 *
 * To add a retreat:   add an entry to RETREAT_DATES below.
 * To close one off:   change its `status` to "full".
 *
 * Nothing else needs touching. The page picks the next retreat that is still
 * open and has not already finished, and lists any later ones beneath it. Dates
 * in the past disappear on their own, so a retreat that has been and gone never
 * needs removing by hand.
 *
 * Loaded both by the browser (as a plain script, exposing globals) and by the
 * server (via require), the same way rooms.js is.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

  // `start` and `end` are inclusive, written as plain YYYY-MM-DD.
  // `status` is "open" or "full".
  //
  // Keep them in date order. Nothing breaks if they are not — they get sorted —
  // but an ordered list is easier to read at a glance.
  const RETREAT_DATES = [
    { start: "2026-11-13", end: "2026-11-15", status: "open" },
  ];

  const PLACE = "Lake Hamilton, Hot Springs, Arkansas";

  const MONTHS = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

  /* Parsed at noon UTC rather than midnight. A date-only string is parsed as
   * UTC midnight, which in any negative-offset timezone — including Arkansas —
   * is still the previous evening locally, so a retreat would read as "past" a
   * few hours early. Noon has half a day of slack either way. */
  const parse = ymd => {
    const [y, m, d] = String(ymd).split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12));
  };

  const isValid = r =>
    r && /^\d{4}-\d{2}-\d{2}$/.test(r.start) && /^\d{4}-\d{2}-\d{2}$/.test(r.end) &&
    !Number.isNaN(parse(r.start).getTime()) && !Number.isNaN(parse(r.end).getTime());

  /* "November 13–15, 2026" when one month, "October 30 – November 1, 2026"
   * across a boundary, "December 30, 2026 – January 1, 2027" across a year. */
  const formatRange = r => {
    const a = parse(r.start), b = parse(r.end);
    const [ay, am, ad] = [a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()];
    const [by, bm, bd] = [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()];
    if (ay !== by) return `${MONTHS[am]} ${ad}, ${ay} – ${MONTHS[bm]} ${bd}, ${by}`;
    if (am !== bm) return `${MONTHS[am]} ${ad} – ${MONTHS[bm]} ${bd}, ${by}`;
    if (ad === bd) return `${MONTHS[am]} ${ad}, ${ay}`;
    return `${MONTHS[am]} ${ad}–${bd}, ${ay}`;
  };

  const formatShort = r => {
    const a = parse(r.start), b = parse(r.end);
    const am = MONTHS[a.getUTCMonth()].slice(0, 3);
    const bm = MONTHS[b.getUTCMonth()].slice(0, 3);
    const same = a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear();
    return same
      ? `${am} ${a.getUTCDate()}–${b.getUTCDate()}, ${b.getUTCFullYear()}`
      : `${am} ${a.getUTCDate()} – ${bm} ${b.getUTCDate()}, ${b.getUTCFullYear()}`;
  };

  const decorate = r => ({
    ...r,
    label: formatRange(r),
    short: formatShort(r),
    place: PLACE,
    isFull: r.status === "full",
  });

  /* Every retreat that has not finished yet, soonest first. A retreat counts as
   * upcoming through its own last day, so the page does not go blank on the
   * Sunday morning of the retreat itself. `now` is injectable for testing. */
  const upcomingRetreats = (now = new Date()) =>
    RETREAT_DATES
      .filter(isValid)
      .filter(r => parse(r.end).getTime() >= now.getTime() - 12 * 3600 * 1000)
      .sort((a, b) => parse(a.start) - parse(b.start))
      .map(decorate);

  /* The one the page leads with: the soonest upcoming retreat still taking
   * bookings. Returns null when every upcoming retreat is full, or when the
   * list has run out — both cases the page must handle rather than inventing
   * a date. */
  const nextOpenRetreat = (now = new Date()) =>
    upcomingRetreats(now).find(r => !r.isFull) || null;

  /* The others worth showing beneath it — upcoming, but not the headline one.
   * Full ones are included so a guest can see the retreat is running again
   * rather than assuming it has stopped. */
  const otherUpcomingRetreats = (now = new Date()) => {
    const lead = nextOpenRetreat(now);
    return upcomingRetreats(now).filter(r => !lead || r.start !== lead.start);
  };

  /* The guest-facing line. Callers need no branching: when there is no open
   * date this reads as "coming soon" rather than a blank or a stale date. */
  const dateLine = (now = new Date()) => {
    const r = nextOpenRetreat(now);
    return r ? `${r.label} · ${PLACE}` : `New dates coming soon · ${PLACE}`;
  };

  const retreatDatesAnnounced = (now = new Date()) => Boolean(nextOpenRetreat(now));

  return {
    RETREAT_DATES, PLACE,
    upcomingRetreats, nextOpenRetreat, otherUpcomingRetreats,
    dateLine, retreatDatesAnnounced, formatRange, formatShort,
  };
});
