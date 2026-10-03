/* Payment routing: which mode the site is in, and that a payment link can only
 * ever point at Stripe. Run with `npm test`.
 */
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const REG = path.join(__dirname, "..", "lib", "registrations.js");
const LINK = "https://buy.stripe.com/28E9AVcrZ40U0ky1af5wI05";

let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); console.log("  ok   " + name); pass++; }
  catch (e) { console.log("  FAIL " + name + "\n       " + e.message); fail++; } };

const fresh = env => {
  for (const k of ["STRIPE_PAYMENT_LINK", "PAYMENTS_ENABLED", "STRIPE_SECRET_KEY"]) delete process.env[k];
  Object.assign(process.env, env);
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  return require(REG);
};

console.log("\n-- which payment mode is active --");
t("nothing configured means nothing is charged", () => assert.equal(fresh({}).depositMode(), "none"));
t("a payment link means link mode",              () => assert.equal(fresh({ STRIPE_PAYMENT_LINK: LINK }).depositMode(), "link"));
t("PAYMENTS_ENABLED means the full API",         () => assert.equal(fresh({ PAYMENTS_ENABLED: "true" }).depositMode(), "api"));
t("the link wins when both are set",             () => assert.equal(fresh({ STRIPE_PAYMENT_LINK: LINK, PAYMENTS_ENABLED: "true" }).depositMode(), "link"));

console.log("\n-- a payment link must be Stripe's own domain --");
// A mistyped or tampered value must never send a paying guest somewhere else.
for (const bad of ["http://buy.stripe.com/x", "https://evil.com/x", "https://buystripe.com/x",
                   "https://buy.stripe.com.evil.com/x", "javascript:alert(1)", "not a url", "   "]) {
  t("rejects " + JSON.stringify(bad), () => {
    const m = fresh({ STRIPE_PAYMENT_LINK: bad });
    assert.equal(m.paymentLink(), null);
    assert.equal(m.depositMode(), "none", "must fall back to charging nothing");
  });
}
t("accepts a real Stripe link", () => assert.ok(fresh({ STRIPE_PAYMENT_LINK: LINK }).paymentLink()));
t("tolerates stray whitespace", () => assert.ok(fresh({ STRIPE_PAYMENT_LINK: `  ${LINK}  ` }).paymentLink()));

console.log("\n-- a registration redirects to Stripe carrying its own id --");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "reg-"));
process.env.STORE = "file";
process.env.DATA_FILE = path.join(dir, "registrations.json");
fs.writeFileSync(process.env.DATA_FILE, "[]");

const m = fresh({ STRIPE_PAYMENT_LINK: LINK });
const body = {
  roomId: "old-twin", name: "Dana Example", email: "dana@example.com",
  mobile: "5015550123", ecname: "Sam Example", ecphone: "5015550124", policies: true,
};

m.createRegistration(body, { headers: { host: "retreat.coachmarvel.com" } }).then(res => {
  t("the request succeeds", () => assert.equal(res.status, 200));
  t("it redirects to the link Christy supplied", () => {
    const u = new URL(res.body.url);
    assert.equal(u.origin + u.pathname, LINK);
  });
  t("carrying the registration id, so Christy can match the payment", () => {
    const u = new URL(res.body.url);
    assert.equal(u.searchParams.get("client_reference_id"), res.body.registrationId);
  });
  t("and the guest's email, so she does not retype it", () => {
    assert.equal(new URL(res.body.url).searchParams.get("prefilled_email"), "dana@example.com");
  });
  t("no amount is ever put in the URL", () => {
    // The browser must not be able to influence what is charged.
    for (const k of new URL(res.body.url).searchParams.keys()) {
      assert.ok(!/amount|price|total|cents/i.test(k), "suspicious parameter: " + k);
    }
  });
  t("the row is saved awaiting payment, priced from rooms.js", () => {
    const rows = JSON.parse(fs.readFileSync(process.env.DATA_FILE, "utf8"));
    const row = rows.find(r => r.id === res.body.registrationId);
    assert.ok(row, "registration was not saved");
    assert.equal(row.status, "awaiting_payment");
    assert.equal(row.totalCents, 69500, "twin room should be $695");
  });

  console.log(`\n${pass} passed, ${fail} failed\n`);
  fs.rmSync(dir, { recursive: true, force: true });
  process.exit(fail ? 1 : 0);
});
