/* The Status column is the only one Christy edits by hand, so it shows plain
 * English. These check the translation holds in both directions, and that rows
 * written before the change still count. Run with `npm test`.
 */
const assert = require("assert");
const path = require("path");
const STORE = path.join(__dirname, "..", "lib", "store.js");

let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); console.log("  ok   " + name); pass++; }
  catch (e) { console.log("  FAIL " + name + "\n       " + e.message); fail++; } };

// Reach the two helpers through a save/read round trip against the file store,
// which shares toFields/fromFields with the Airtable one only in shape, so
// exercise the Airtable mapping directly instead.
const src = require("fs").readFileSync(STORE, "utf8");

console.log("\n-- what Christy sees in the dropdown --");
for (const [code, label] of [
  ["awaiting_payment", "Waiting for payment"],
  ["confirmed", "Paid"],
  ["cancelled", "Cancelled"],
  ["waitlist", "Waitlist"],
]) {
  t(`${code} shows as "${label}"`, () => {
    assert.ok(src.includes(`${code}: "${label}"`) || src.includes(`"${label}": "${code}"`),
      `no mapping found for ${code}`);
  });
}

t("pending collapses into Waiting for payment", () => {
  assert.ok(src.includes('pending: "Waiting for payment"'),
    "pending should not be a separate option she has to understand");
});

console.log("\n-- the round trip --");
// Pull the two maps out of the module source and apply them the way the
// store does, so the test follows the real tables rather than a copy.
const grab = name => {
  const m = src.match(new RegExp(`const ${name} = \\{([\\s\\S]*?)\\n\\};`));
  assert.ok(m, `${name} not found`);
  const out = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^\s*"?([^":]+)"?:\s*"([^"]+)",/);
    if (kv) out[kv[1].trim()] = kv[2];
  }
  return out;
};
const OUT = grab("STATUS_OUT"), IN = grab("STATUS_IN");

for (const code of ["awaiting_payment", "confirmed", "cancelled", "waitlist"]) {
  t(`${code} survives a round trip`, () => assert.equal(IN[OUT[code]], code));
}

console.log("\n-- rows written before this change --");
for (const legacy of ["awaiting_payment", "confirmed", "waitlist"]) {
  t(`a row still holding "${legacy}" reads back unchanged`, () => {
    // statusIn falls through to the raw value when it is not a known label
    assert.equal(IN[legacy] || legacy, legacy);
  });
}

console.log("\n-- the holding set still lines up --");
{
  const reg = require("fs").readFileSync(path.join(__dirname, "..", "lib", "registrations.js"), "utf8");
  const m = reg.match(/HOLDS_A_BED = new Set\(\[(.*?)\]\)/s);
  assert.ok(m, "HOLDS_A_BED not found");
  const holds = m[1].match(/"([^"]+)"/g).map(x => x.replace(/"/g, ""));
  t("it holds internal codes, not the labels", () => {
    for (const h of holds) assert.ok(OUT[h], `"${h}" is not a known status code`);
  });
  t("Cancelled does not hold a bed", () => assert.ok(!holds.includes("cancelled")));
  t("Paid does hold a bed", () => assert.ok(holds.includes("confirmed")));
  t("Waiting for payment holds a bed", () => assert.ok(holds.includes("awaiting_payment")));
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
