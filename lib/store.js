/* Where registrations are kept.
 *
 * Two backends behind one interface:
 *
 *   file      — a JSON file. Local development only. Vercel's filesystem is
 *               read-only and per-invocation, so on Vercel this would silently
 *               lose every registration. Never use it in production.
 *   airtable  — a normal Airtable base. Chosen because Christy can open it,
 *               read it, sort it and export it without anyone building her an
 *               admin panel. Free tier covers a retreat of ten guests many
 *               times over.
 *
 * Set STORE=airtable plus AIRTABLE_TOKEN / AIRTABLE_BASE_ID to switch.
 * Swapping in Postgres later means writing one more object with the same three
 * methods; nothing else in the codebase knows which backend is in use.
 */
"use strict";

const path = require("node:path");
const fs = require("node:fs");

const TABLE = process.env.AIRTABLE_TABLE || "Registrations";

// ── file backend ──────────────────────────────────────────────────────────────
const fileStore = () => {
  const FILE = process.env.DATA_FILE || path.join(process.cwd(), "data", "registrations.json");
  const readAll = () => {
    try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; }
  };
  const writeAll = rows => {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(rows, null, 2));
  };
  return {
    name: "file",
    async list() { return readAll(); },
    async save(row) {
      const rows = readAll();
      const i = rows.findIndex(r => r.id === row.id);
      if (i === -1) rows.push(row); else rows[i] = { ...rows[i], ...row };
      writeAll(rows);
      return row;
    },
    async get(id) { return readAll().find(r => r.id === id) || null; },
  };
};

// ── airtable backend ──────────────────────────────────────────────────────────
// Field names are Title Case to match what Christy sees as column headers.
const toFields = row => ({
  "Registration ID": row.id,
  "Status": row.status,
  "Name": row.name,
  "Email": row.email,
  "Mobile": row.mobile,
  "Mailing Address": row.address,
  "Emergency Contact": [row.ecname, row.ecphone].filter(Boolean).join(" · "),
  "Room": row.roomName,
  "Room ID": row.roomId,
  "Total (USD)": row.totalCents != null ? row.totalCents / 100 : undefined,
  "Deposit Paid (USD)": row.depositPaidCents != null ? row.depositPaidCents / 100 : undefined,
  "Roommate": row.roommate,
  "Dietary": row.diet,
  "Accessibility": row.access,
  "Health": row.health,
  "Massage": row.massage,
  "Apparel Size": row.size,
  "Heard Via": row.source,
  "Photo Consent": row.media === true ? "Yes" : row.media === false ? "No" : undefined,
  "Stripe Customer": row.stripeCustomerId,
  "Stripe Payment": row.stripePaymentIntentId,
  "Created": row.createdAt,
  "Confirmed": row.confirmedAt,
});

const fromFields = (f = {}) => ({
  id: f["Registration ID"],
  status: f["Status"],
  name: f["Name"],
  email: f["Email"],
  roomId: f["Room ID"],
  roomName: f["Room"],
  totalCents: f["Total (USD)"] != null ? Math.round(f["Total (USD)"] * 100) : undefined,
});

const airtableStore = () => {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) {
    throw new Error("STORE=airtable needs AIRTABLE_TOKEN and AIRTABLE_BASE_ID");
  }
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(TABLE)}`;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const call = async (suffix, init) => {
    const res = await fetch(url + suffix, { ...init, headers });
    if (!res.ok) throw new Error(`Airtable ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return res.json();
  };

  // Airtable keys rows by its own record id, so a row has to be looked up by
  // our Registration ID before it can be updated.
  const findRecordId = async id => {
    const q = `?filterByFormula=${encodeURIComponent(`{Registration ID}='${id}'`)}&maxRecords=1`;
    const data = await call(q, { method: "GET" });
    return data.records?.[0]?.id || null;
  };

  const strip = obj => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""));

  return {
    name: "airtable",
    async list() {
      const out = [];
      let offset;
      do {
        const q = `?pageSize=100${offset ? `&offset=${offset}` : ""}`;
        const data = await call(q, { method: "GET" });
        out.push(...(data.records || []).map(r => fromFields(r.fields)));
        offset = data.offset;
      } while (offset);
      return out;
    },
    async save(row) {
      const recordId = await findRecordId(row.id);
      const fields = strip(toFields(row));
      if (recordId) {
        await call(`/${recordId}`, { method: "PATCH", body: JSON.stringify({ fields }) });
      } else {
        await call("", { method: "POST", body: JSON.stringify({ records: [{ fields }] }) });
      }
      return row;
    },
    async get(id) {
      const q = `?filterByFormula=${encodeURIComponent(`{Registration ID}='${id}'`)}&maxRecords=1`;
      const data = await call(q, { method: "GET" });
      const rec = data.records?.[0];
      return rec ? fromFields(rec.fields) : null;
    },
  };
};

let cached;
const getStore = () => {
  if (!cached) cached = process.env.STORE === "airtable" ? airtableStore() : fileStore();
  return cached;
};

module.exports = { getStore };
