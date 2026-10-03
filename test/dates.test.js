const assert = require("assert");
const path = require("path").join(__dirname, "..", "retreat-dates.js");
let pass = 0, fail = 0;
const t = (n, fn) => { try { fn(); console.log("  ok   " + n); pass++; }
  catch (e) { console.log("  FAIL " + n + "\n       " + e.message); fail++; } };

const load = list => {
  delete require.cache[path];
  const m = require(path);
  if (list) { m.RETREAT_DATES.length = 0; m.RETREAT_DATES.push(...list); }
  return m;
};
const D = s => new Date(s + "T12:00:00Z");

console.log("\n-- formatting --");
{ const m = load();
  t("same month",    () => assert.equal(m.formatRange({start:"2026-11-13",end:"2026-11-15"}), "November 13–15, 2026"));
  t("across months", () => assert.equal(m.formatRange({start:"2026-10-30",end:"2026-11-01"}), "October 30 – November 1, 2026"));
  t("across years",  () => assert.equal(m.formatRange({start:"2026-12-30",end:"2027-01-01"}), "December 30, 2026 – January 1, 2027"));
  t("single day",    () => assert.equal(m.formatRange({start:"2026-11-13",end:"2026-11-13"}), "November 13, 2026"));
  t("short form",    () => assert.equal(m.formatShort({start:"2026-11-13",end:"2026-11-15"}), "Nov 13–15, 2026"));
}

console.log("\n-- picks the next open date --");
{ const m = load([
    {start:"2026-11-13",end:"2026-11-15",status:"open"},
    {start:"2027-03-05",end:"2027-03-07",status:"open"},
    {start:"2027-06-11",end:"2027-06-13",status:"open"},
  ]);
  t("leads with the soonest", () => assert.equal(m.nextOpenRetreat(D("2026-10-03")).label, "November 13–15, 2026"));
  t("lists the other two",    () => assert.deepEqual(m.otherUpcomingRetreats(D("2026-10-03")).map(r=>r.short), ["Mar 5–7, 2027","Jun 11–13, 2027"]));
  t("dateLine uses the lead", () => assert.ok(m.dateLine(D("2026-10-03")).startsWith("November 13–15, 2026 ·")));
}

console.log("\n-- past dates fall away on their own --");
{ const m = load([
    {start:"2026-11-13",end:"2026-11-15",status:"open"},
    {start:"2027-03-05",end:"2027-03-07",status:"open"},
  ]);
  t("during the retreat it is still the lead", () => assert.equal(m.nextOpenRetreat(D("2026-11-14")).short, "Nov 13–15, 2026"));
  t("on the final day it is still the lead",   () => assert.equal(m.nextOpenRetreat(D("2026-11-15")).short, "Nov 13–15, 2026"));
  t("the day after it rolls on",               () => assert.equal(m.nextOpenRetreat(D("2026-11-17")).short, "Mar 5–7, 2027"));
  t("past one is dropped from the list",       () => assert.ok(!m.upcomingRetreats(D("2026-11-17")).some(r=>r.short.includes("Nov"))));
}

console.log("\n-- marking one full --");
{ const m = load([
    {start:"2026-11-13",end:"2026-11-15",status:"full"},
    {start:"2027-03-05",end:"2027-03-07",status:"open"},
  ]);
  t("skips the full one",        () => assert.equal(m.nextOpenRetreat(D("2026-10-03")).short, "Mar 5–7, 2027"));
  t("but still shows it",        () => assert.ok(m.otherUpcomingRetreats(D("2026-10-03")).some(r=>r.isFull && r.short.includes("Nov"))));
}

console.log("\n-- nothing open --");
{ const m = load([{start:"2026-11-13",end:"2026-11-15",status:"full"}]);
  t("nextOpenRetreat is null",    () => assert.equal(m.nextOpenRetreat(D("2026-10-03")), null));
  t("dateLine says coming soon",  () => assert.ok(m.dateLine(D("2026-10-03")).startsWith("New dates coming soon")));
  t("announced is false",         () => assert.equal(m.retreatDatesAnnounced(D("2026-10-03")), false));
}
{ const m = load([]);
  t("empty list is safe",         () => assert.equal(m.nextOpenRetreat(D("2026-10-03")), null));
  t("empty list: coming soon",    () => assert.ok(m.dateLine(D("2026-10-03")).includes("coming soon")));
}

console.log("\n-- bad input is skipped, not crashed on --");
{ const m = load([
    {start:"not-a-date",end:"2027-01-01",status:"open"},
    {start:"2027/03/05",end:"2027-03-07",status:"open"},
    null,
    {start:"2027-06-11",end:"2027-06-13",status:"open"},
  ]);
  t("only the valid one survives", () => assert.equal(m.upcomingRetreats(D("2026-10-03")).length, 1));
  t("and it is the right one",     () => assert.equal(m.nextOpenRetreat(D("2026-10-03")).short, "Jun 11–13, 2027"));
}

console.log("\n-- out of order input --");
{ const m = load([
    {start:"2027-06-11",end:"2027-06-13",status:"open"},
    {start:"2026-11-13",end:"2026-11-15",status:"open"},
  ]);
  t("sorted regardless", () => assert.equal(m.nextOpenRetreat(D("2026-10-03")).short, "Nov 13–15, 2026"));
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
