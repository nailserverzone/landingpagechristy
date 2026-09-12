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
  // Bump this whenever an image under assets/ is replaced. It is appended to
  // every image URL, so a changed photo is a different URL and no browser or CDN
  // can serve a stale copy — or a stale 404 from before the file existed.
  const ASSET_V = "2";

  const DEPOSIT_CENTS = 30000; // $300 holds a room; balance is charged later

  // The retreat is capped at 10 women, but the rooms sleep 14 between them — so
  // the cap has to be enforced across the whole retreat, not just per room.
  const MAX_GUESTS = 10;

  const RETREAT_ROOMS = [
    {
      id: "new-master", house: "Newer Lake House", houseShort: "Newer House", houseTag: "HOUSE ONE",
      name: "Downstairs Master Suite", bath: "private", capacity: 2,
      priceCents: 99500, unit: "/ person", cta: "Reserve this room",
      photo: "new-master.jpg",   // dark blue comforter
      photoNote: "Photo to come — dark blue comforter",
      specs: [["Bed", "Master bed"], ["Sleeps", "1–2 women"], ["Bathroom", "Private, with walk-in closet"]],
    },
    {
      id: "new-king", house: "Newer Lake House", houseShort: "Newer House", houseTag: "HOUSE ONE",
      name: "King Room", bath: "shared", capacity: 2,
      priceCents: 79500, unit: "/ person", cta: "Reserve this room",
      photo: "new-king.jpg",     // light green comforter
      photoNote: "Photo to come — light green comforter",
      specs: [["Bed", "King"], ["Sleeps", "1–2 women"], ["Bathroom", "Shared, with walk-in closet"]],
    },
    {
      id: "new-bunk", house: "Newer Lake House", houseShort: "Newer House", houseTag: "HOUSE ONE",
      name: "Bunk Room", bath: "shared", capacity: 4,
      priceCents: 79500, unit: "/ bed", cta: "Reserve a bed",
      photo: "new-bunk.jpg",     // the bunks
      photoNote: "Photo: bunk room",
      specs: [["Beds", "Four bunk beds"], ["Sleeps", "Up to 4 women"], ["Bathroom", "Shared"]],
    },
    {
      id: "old-master", house: "Older Lake House", houseShort: "Older House", houseTag: "HOUSE TWO",
      name: "Master Suite", bath: "private", capacity: 2,
      priceCents: 99500, unit: "/ person", cta: "Reserve this room",
      photo: "old-master.jpg",   // queen/full, tan comforter
      photoNote: "Photo: master suite",
      specs: [["Bed", "Queen or full"], ["Sleeps", "1–2 women"], ["Bathroom", "Private"]],
    },
    {
      id: "old-loft", house: "Older Lake House", houseShort: "Older House", houseTag: "HOUSE TWO",
      name: "Loft King", bath: "shared", capacity: 2,
      priceCents: 79500, unit: "/ person", cta: "Reserve this room",
      photo: "old-loft.jpg",     // king, tan-brown comforter
      photoNote: "Photo: loft king",
      specs: [["Bed", "King, in the loft"], ["Sleeps", "1–2 women"], ["Bathroom", "Shared, downstairs"]],
    },
    {
      id: "old-twin", house: "Older Lake House", houseShort: "Older House", houseTag: "HOUSE TWO",
      name: "Full & Twin Room", bath: "shared", capacity: 2,
      priceCents: 79500, unit: "/ person", cta: "Reserve a bed",
      photo: "old-twin.jpg",     // the little boat bed
      photoNote: "Photo: full & twin room",
      specs: [["Beds", "One full, one twin"], ["Sleeps", "2 women"], ["Bathroom", "Shared"]],
    },
  ];

  const WAITLIST_ID = "waitlist";
  const WAITLIST_LABEL = "Add me to the waitlist";

  // Confirmed by Danielle Russo on 8 Sept 2026: no rooms booked yet.
  // Set a room to "hold" or "full" as bookings come in.
  const AVAILABILITY = {
    "new-master": "available", "new-king": "available", "new-bunk": "available",
    "old-master": "available", "old-loft": "available", "old-twin": "available",
  };
  const AVAILABILITY_LABELS = { available: "AVAILABLE", hold: "ON HOLD", full: "FULL" };
  const availabilityOf = id => AVAILABILITY[id] || "available";

  const money = cents => `$${(cents / 100).toLocaleString("en-US")}`;

  // The label shown in the registration select, derived so it can never drift
  // out of sync with the price on the room card. Rooms sold by the bed say so,
  // matching the client-approved wording.
  const roomLabel = r =>
    `${r.houseShort} — ${r.name}${r.cta.includes("bed") ? " bed" : ""} · ${r.bath} bath · ${money(r.priceCents)}`;

  const findRoom = id => RETREAT_ROOMS.find(r => r.id === id) || null;

  // Rooms that are full are still listed on the page, but are not offered in
  // the form — the waitlist is the only route once a room is gone.
  const roomOptions = () => [
    ...RETREAT_ROOMS.filter(r => availabilityOf(r.id) !== "full")
                    .map(r => ({ id: r.id, label: roomLabel(r) })),
    { id: WAITLIST_ID, label: WAITLIST_LABEL },
  ];

  return {
    ASSET_V, DEPOSIT_CENTS, MAX_GUESTS, RETREAT_ROOMS, WAITLIST_ID, WAITLIST_LABEL,
    AVAILABILITY_LABELS, availabilityOf, money, roomLabel, findRoom, roomOptions,
  };
});
