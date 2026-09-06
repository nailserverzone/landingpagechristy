/* Registration form validation.
 *
 * Loaded by the browser (as a plain script) and by the API (via require), so a
 * field is judged by exactly the same rule in both places. The browser copy is
 * for fast feedback; the server copy is the one that actually decides, because
 * anything client-side can be bypassed.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {

  const text = v => (typeof v === "string" ? v.trim() : "");

  // Deliberately permissive. The job is catching typos, not deciding which
  // addresses are real — only sending mail can do that. Rejecting valid
  // addresses is worse than accepting a bad one, since a bad one just bounces.
  const isEmail = v => {
    const s = text(v);
    if (s.length < 6 || s.length > 254) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return false;
    if (s.includes("..")) return false;
    return true;
  };

  // Accepts the ways people actually type numbers — (501) 555-0100,
  // 501.555.0100, +1 501 555 0100 — and judges the digits, not the punctuation.
  const isPhone = v => {
    const s = text(v);
    if (/[A-Za-z]/.test(s)) return false;
    const digits = s.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  const isName = v => {
    const s = text(v);
    return s.length >= 2 && s.length <= 100;
  };

  // field -> [validator, message shown to the guest]
  const RULES = {
    name:    [isName,  "Please enter your full name."],
    email:   [isEmail, "That email address doesn't look right — please check it."],
    mobile:  [isPhone, "Please enter a phone number we can reach you on."],
    ecname:  [isName,  "Please give an emergency contact name."],
    ecphone: [isPhone, "Please give a phone number for your emergency contact."],
  };

  const REQUIRED = Object.keys(RULES);
  const OPTIONAL = ["address", "roommate", "diet", "access", "health", "massage", "size", "source"];
  const MAX_LEN = 2000;

  // Returns { field: message } — empty when the form is good.
  const validateRegistration = (data, { requirePolicies = true } = {}) => {
    const errors = {};
    const d = data || {};

    for (const [field, [ok, message]] of Object.entries(RULES)) {
      if (!text(d[field])) { errors[field] = "This field is required."; continue; }
      if (!ok(d[field])) errors[field] = message;
    }

    for (const field of OPTIONAL) {
      if (text(d[field]).length > MAX_LEN) errors[field] = `Please keep this under ${MAX_LEN} characters.`;
    }

    if (requirePolicies && d.policies !== true) {
      errors.policies = "Please confirm you agree to the cancellation and participation policies.";
    }
    return errors;
  };

  const firstError = errors => {
    const k = Object.keys(errors)[0];
    return k ? errors[k] : null;
  };

  return { text, isEmail, isPhone, isName, RULES, REQUIRED, OPTIONAL, MAX_LEN, validateRegistration, firstError };
});
