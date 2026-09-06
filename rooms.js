/* Room inventory and pricing — the single source of truth.
 *
 * Loaded both by the browser (as a plain script, exposing globals) and by the
 * server (via require). The server prices every checkout from this file; the
 * browser only ever sends a room `id`, never an amount.
 *
 * Prices are WORKING FIGURES pending Christy's confirmation. `capacity` is how
 * many guests the room can hold; a real booking system decrements against it.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DEPOSIT_CENTS = 30000; // $300 holds a room; balance is charged later

  // The retreat is capped at 10 women, but the rooms sleep 14 between them — so
  // the cap has to be enforced across the whole retreat, not just per room.
  const MAX_GUESTS = 10;

  const RETREAT_ROOMS = [
    {
      id: "new-master", house: "Newer Lake House", houseShort: "Newer House", houseTag: "HOUSE ONE",
      name: "Downstairs Master Suite", bath: "private", capacity: 2,
      priceCents: 99500, unit: "/ person", cta: "Reserve this room",
      photoNote: "Photo: downstairs master suite",
      specs: [["Bed", "Master bed"], ["Sleeps", "1–2 women"], ["Bathroom", "Private, with walk-in closet"]],
    },
    {
      id: "new-king", house: "Newer Lake House", houseShort: "Newer House", houseTag: "HOUSE ONE",
      name: "King Room", bath: "shared", capacity: 2,
      priceCents: 79500, unit: "/ person", cta: "Reserve this room",
      photoNote: "Photo: king room",
      specs: [["Bed", "King"], ["Sleeps", "1–2 women"], ["Bathroom", "Shared, with walk-in closet"]],
    },
    {
      id: "new-bunk", house: "Newer Lake House", houseShort: "Newer House", houseTag: "HOUSE ONE",
      name: "Bunk Room", bath: "shared", capacity: 4,
      priceCents: 79500, unit: "/ bed", cta: "Reserve a bed",
      photoNote: "Photo: bunk room",
      specs: [["Beds", "Four bunk beds"], ["Sleeps", "Up to 4 women"], ["Bathroom", "Shared"]],
    },
    {
      id: "old-master", house: "Older Lake House", houseShort: "Older House", houseTag: "HOUSE TWO",
      name: "Master Suite", bath: "private", capacity: 2,
      priceCents: 99500, unit: "/ person", cta: "Reserve this room",
      photoNote: "Photo: master suite",
      specs: [["Bed", "Master bed"], ["Sleeps", "1–2 women"], ["Bathroom", "Private"]],
    },
    {
      id: "old-loft", house: "Older Lake House", houseShort: "Older House", houseTag: "HOUSE TWO",
      name: "Loft King", bath: "shared", capacity: 2,
      priceCents: 79500, unit: "/ person", cta: "Reserve this room",
      photoNote: "Photo: loft king",
      specs: [["Bed", "King, in the loft"], ["Sleeps", "1–2 women"], ["Bathroom", "Shared, downstairs"]],
    },
    {
      id: "old-twin", house: "Older Lake House", houseShort: "Older House", houseTag: "HOUSE TWO",
      name: "Full & Twin Room", bath: "shared", capacity: 2,
      priceCents: 79500, unit: "/ person", cta: "Reserve a bed",
      photoNote: "Photo: full & twin room",
      specs: [["Beds", "One full, one twin"], ["Sleeps", "2 women"], ["Bathroom", "Shared"]],
    },
  ];

  const WAITLIST_ID = "waitlist";
  const WAITLIST_LABEL = "Add me to the waitlist";

  const money = cents => `$${(cents / 100).toLocaleString("en-US")}`;

  // The label shown in the registration select, derived so it can never drift
  // out of sync with the price on the room card. Rooms sold by the bed say so,
  // matching the client-approved wording.
  const roomLabel = r =>
    `${r.houseShort} — ${r.name}${r.cta.includes("bed") ? " bed" : ""} · ${r.bath} bath · ${money(r.priceCents)}`;

  const findRoom = id => RETREAT_ROOMS.find(r => r.id === id) || null;

  const roomOptions = () => [
    ...RETREAT_ROOMS.map(r => ({ id: r.id, label: roomLabel(r) })),
    { id: WAITLIST_ID, label: WAITLIST_LABEL },
  ];

  return { DEPOSIT_CENTS, MAX_GUESTS, RETREAT_ROOMS, WAITLIST_ID, WAITLIST_LABEL, money, roomLabel, findRoom, roomOptions };
});
