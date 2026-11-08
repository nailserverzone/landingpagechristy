/* Room availability: what counts as a bed being taken, and when a room or the
 * whole retreat closes. Run with `npm test`.
 */
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const REG = path.join(__dirname, "..", "lib", "registrations.js");
const ROOMS = path.join(__dirname, "..", "rooms.js");

let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); console.log("  ok   " + name); pass++; }
  catch (e) { console.log("  FAIL " + name + "\n       " + e.message); fail++; } };

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "avail-"));
const file = path.join(dir, "rows.json");

// Load the module against a store seeded with the given rows.
const withRows = rows => {
  fs.writeFileSync(file, JSON.stringify(rows));
  process.env.STORE = "file";
  process.env.DATA_FILE = file;
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  return require(REG);
};
const row = (roomId, status, i) => ({ id: "reg_" + roomId + i, roomId, status });

const { RETREAT_ROOMS, MAX_GUESTS } = require(ROOMS);
const BUNK = RETREAT_ROOMS.find(r => r.id === "new-bunk");   // capacity 4
const TWIN = RETREAT_ROOMS.find(r => r.id === "old-twin");   // capacity 2

(async () => {
  console.log("\n-- nothing booked --");
  {
    const a = await withRows([]).availability();
    t("every room is available", () => {
      for (const r of RETREAT_ROOMS) assert.equal(a.rooms[r.id].state, "available", r.id);
    });
    t("no guests counted", () => assert.equal(a.guests.taken, 0));
  }

  console.log("\n-- an unpaid registration still holds the bed --");
  {
    // This is the point of the change: with a Payment Link nothing reports
    // back, so a row sits at awaiting_payment and must still take the bed.
    const a = await withRows([row("old-twin", "awaiting_payment", 1)]).availability();
    t("one of two beds gone", () => assert.equal(a.rooms["old-twin"].left, TWIN.capacity - 1));
    t("and it counts as a guest", () => assert.equal(a.guests.taken, 1));
  }

  console.log("\n-- a room fills --");
  {
    const rows = Array.from({ length: TWIN.capacity }, (_, i) => row("old-twin", "awaiting_payment", i));
    const a = await withRows(rows).availability();
    t("that room is full", () => assert.equal(a.rooms["old-twin"].state, "full"));
    t("others are untouched", () => assert.equal(a.rooms["new-king"].state, "available"));
  }

  console.log("\n-- the last bed in a room reads as a hold --");
  {
    const rows = Array.from({ length: BUNK.capacity - 1 }, (_, i) => row("new-bunk", "confirmed", i));
    const a = await withRows(rows).availability();
    t("one bed left shows as hold", () => assert.equal(a.rooms["new-bunk"].state, "hold"));
    t("and it is one bed", () => assert.equal(a.rooms["new-bunk"].left, 1));
  }

  console.log("\n-- statuses that do NOT hold a bed --");
  // Anything outside the holding set frees the bed, so a typo in the sheet
  // cannot quietly take a room off sale. "cancelled" is how Christy frees one.
  for (const status of ["waitlist", "cancelled", "refunded", "", "Awaiting Payment"]) {
    const a = await withRows([row("old-twin", status, 1)]).availability();
    t(`${JSON.stringify(status)} frees the bed`,
      () => assert.equal(a.rooms["old-twin"].left, TWIN.capacity));
  }

  console.log("\n-- the whole retreat fills --");
  {
    // Spread MAX_GUESTS across rooms that can hold them.
    const rows = [];
    for (const r of RETREAT_ROOMS) {
      for (let i = 0; i < r.capacity && rows.length < MAX_GUESTS; i++) rows.push(row(r.id, "confirmed", i));
    }
    const a = await withRows(rows).availability();
    t(`${MAX_GUESTS} guests means the retreat is full`, () => assert.equal(a.retreatFull, true));
    t("every room reads full, even ones with beds spare", () => {
      for (const r of RETREAT_ROOMS) assert.equal(a.rooms[r.id].state, "full", r.id);
    });
  }

  console.log("\n-- the server refuses a room that has gone --");
  {
    const rows = Array.from({ length: TWIN.capacity }, (_, i) => row("old-twin", "awaiting_payment", i));
    const m = withRows(rows);
    const body = {
      roomId: "old-twin", name: "Dana Example", email: "dana@example.com",
      mobile: "5015550123", ecname: "Sam Example", ecphone: "5015550124", policies: true,
    };
    const res = await m.createRegistration(body, { headers: { host: "x.test" } });
    t("returns 409, not a booking", () => assert.equal(res.status, 409));
    t("and says which room", () => assert.ok(/Full & Twin/.test(res.body.error), res.body.error));
  }

  console.log(`\n${pass} passed, ${fail} failed\n`);
  fs.rmSync(dir, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
})();
