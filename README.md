# Be Your Own Superhero™ Retreat

Landing page and deposit registration for the retreat on **November 13–15, 2026**,
Lake Hamilton, Hot Springs, Arkansas.

> Nothing here should take real money until the items under
> [Before going live](#before-going-live) are settled — in particular the
> confirmed prices and Christy's own Stripe account.

## Running it

```bash
npm install
cp .env.example .env
npm start                  # http://localhost:4242
```

## The three payment modes

The first one that applies wins, so switching is a matter of setting or
clearing one variable.

| Mode | Set this | What happens |
| --- | --- | --- |
| **link** | `STRIPE_PAYMENT_LINK` | Registration is saved, then the guest is redirected to a Payment Link Christy made in her own dashboard. No API key, no webhook, no access to her account. |
| **api** | `PAYMENTS_ENABLED=true` + both keys | Full Stripe Checkout: priced server-side, webhook confirms, card saved for the balance. |
| **none** | neither | Registration is saved, nothing is charged, Christy follows up. |

**Link mode is what is live now.** It is deliberately the simpler trade: Stripe
never reports back, so rows stay `awaiting_payment` and Christy ticks them off
against her dashboard by hand. The registration id is passed as Stripe's
`client_reference_id`, so each payment shows the id of the row it belongs to —
that is what makes reconciliation a lookup rather than a guess.

`STRIPE_PAYMENT_LINK` is rejected unless it is an `https://` URL on
`buy.stripe.com` (or another `stripe.com` host). A mistyped or hijacked value
cannot send a paying guest to somebody else's page — the site falls back to
collecting registrations and charging nothing, and `/api/health` says so.

Switching to the full integration later means adding the keys and clearing
`STRIPE_PAYMENT_LINK`. Nothing else changes.

The page itself is static — React 18 + Babel standalone, no build step. The
server exists only to price the deposit and take the payment.

### Stripe keys (only once payments go live)

The environment this was built in blocks Stripe's domains, so the sandbox has
to be created from a machine with normal network access:

```bash
stripe sandbox create --email you@example.com   # no registration, test mode only
```

Put the key it prints in `.env` as `STRIPE_SECRET_KEY`. A restricted key
(`rk_test_…`) is preferable to a secret key (`sk_test_…`).

### Webhooks

Fulfilment happens in the webhook, not on the success page, so a guest who
closes the tab still gets their room. In one terminal:

```bash
npm run stripe:listen
```

That prints a `whsec_…` — put it in `.env` as `STRIPE_WEBHOOK_SECRET`.

Test the full flow with card `4242 4242 4242 4242`, any future expiry, any CVC.

## How the deposit works

| Step | What happens |
| --- | --- |
| Guest submits the form | Server validates and saves the registration |
| …with payments **off** | Saved as `awaiting_payment`, no card touched, Christy follows up |
| …with payments **on** | Saved as `pending`, guest goes to Stripe Checkout |
| Guest pays $300 | Stripe redirects back to `/retreat.html?reserved=1` |
| `checkout.session.completed` | Webhook flips the registration to `confirmed` and records the Stripe IDs |
| Balance, later | Charge the saved card off-session using the stored `stripeCustomerId` |

Two things are deliberate and worth preserving if this moves to another host:

- **The browser never sends an amount.** It sends a room `id`; the server prices
  it from `rooms.js`. A tampered request cannot change what is charged.
- **The card is saved at deposit time** (`setup_future_usage: "off_session"`),
  so the remaining $495 or $695 can be charged later without asking the guest
  to enter their details again.

## Layout

The coaching page is the site's front door; the retreat is a page beneath it.

| File | Purpose |
| --- | --- |
| `index.html` | **Homepage** — the coaching page, loads `coaching.jsx` |
| `coaching.jsx` | Coaching page, plus the retreat popup |
| `retreat.html` | Retreat page, loads `rooms.js`, `validate.js`, `app.jsx` |
| `app.jsx` | The retreat page as React components |
| `styles.css` | Design system — tokens, layout, the single 900px breakpoint |
| `rooms.js` | **Source of truth** for rooms, prices, capacity and availability |
| `validate.js` | Form rules, shared by browser and server so they cannot disagree |
| `lib/store.js` | Storage adapter — `file` locally, `airtable` in production |
| `lib/registrations.js` | Validation, capacity and Stripe logic |
| `api/*.js` | Vercel serverless functions |
| `server.js` | Local dev server; mounts the same handlers as `api/` |
| `vercel.json` | Redirects `/coaching.html` to `/`, caches assets |
| `assets/retreat/web/` | Lake photography, 1600px q82 |

## Deploying to Vercel

The site is static files plus four serverless functions. Vercel picks both up
with no build step.

Set these in **Project → Settings → Environment Variables**:

| Variable | Value |
| --- | --- |
| `STORE` | `airtable` |
| `AIRTABLE_TOKEN` | token from airtable.com/create/tokens |
| `AIRTABLE_BASE_ID` | `appbLQN9lRI4xjixW` |
| `STRIPE_PAYMENT_LINK` | Christy's Payment Link, `https://buy.stripe.com/…` |
| `PAYMENTS_ENABLED` | `false` — unused while the payment link is set |

Leave `PUBLIC_ORIGIN` unset on Vercel — the request host is used instead, so
preview deployments return to themselves rather than to production.

### The Airtable base

Already created, in the **Christy Retreat** workspace:

- Base: **Be Your Own Superhero Retreat** — `appbLQN9lRI4xjixW`
- Table: **Registrations** — `tblmRwl93fO65y2Xf`
- https://airtable.com/appbLQN9lRI4xjixW

All 23 columns match the names in `lib/store.js`. A record shaped exactly as
that file writes was accepted with `typecast` off, so the ISO timestamps, the
`Status` select, the currency fields and the phone format are all confirmed
compatible.

**Do not rename the columns** — `lib/store.js` addresses them by name, so a
rename silently stops the site writing to that column. Adding columns is safe.

Still to do:

1. Create a personal access token at airtable.com/create/tokens with
   `data.records:read` and `data.records:write` on this base, and set it as
   `AIRTABLE_TOKEN` in Vercel.
2. Share the base with Christy as a **Collaborator**, so she can read and export
   registrations herself.

`Status` moves `awaiting_payment` → `confirmed`, or `waitlist` for waitlisters.

### vercel.json

Vercel validates this file against a strict schema and **fails the whole
deployment** if it contains any key the schema does not define — including a
`comment` key, since JSON has no comments. Put explanation in this README, never
in the file.

Rules currently set:

- `/assets/(.*)` revalidates hourly rather than being cached as `immutable`.
  Nothing under `assets/` is content-hashed, so a replaced photo keeps its
  filename; `immutable` would pin the old one in every browser for a year.
- `/api/(.*)` is `no-store`, because `/api/config` decides whether the page
  offers a checkout at all.

Image URLs also carry `?v=` from `ASSET_V` in `rooms.js`. Bump it whenever a file
under `assets/` is replaced.

## When something breaks

`/api/health` reports whether the site is wired up correctly:

    https://your-site.vercel.app/api/health

It returns `ok: true`, or a `problems` list naming exactly what is wrong — a
rejected Airtable token, a missing base ID, payments switched on without a
Stripe key. It actually calls Airtable, so it proves the token, base ID and
permissions all agree rather than just checking the variables exist.

It reports booleans and error text only — never the value of a token or key.

**Environment variables do not take effect until the next deployment.** After
changing any of them in Vercel, redeploy, or `/api/health` will keep reporting
the old configuration.

## Before going live

Carried over from the design handoff, plus what surfaced while building:

- [ ] **Set real room availability** in `rooms.js` (`AVAILABILITY`). Everything is
      marked available as a placeholder — publishing as-is offers rooms that may
      already be taken.
- [x] ~~Announce the new dates~~ — November 13–15 2026, confirmed by Christy on
      29 September 2026.
- [ ] **Confirm the master suite price.** Danielle asked on 27 September for
      "the master suite" to be $885, but there are two: `new-master`
      (Downstairs Master Suite, $995) and `old-master` (Master Suite, $795).
      Unresolved, so both are unchanged.
- [x] ~~Twin room price~~ — $695 per bed as of 29 September 2026.
- [ ] Set `STRIPE_PAYMENT_LINK` in Vercel to the link Christy supplied, then
      redeploy. Until then the site collects registrations and charges nothing.
- [ ] Optional, later: two more Payment Links so guests can pay in full up
      front ($795 and $995 tiers), and Stripe invoices for the balance.
- [x] ~~Confirm the refund and cancellation policy~~ — supplied by Danielle Russo
      on 15 September 2026 and now live in `REFUND_POLICY` in `rooms.js`, shown
      both in the Investment section and the FAQ.
- [ ] **Close the capacity race.** Capacity is checked and then written in two
      steps, so two guests submitting at once can still oversell the last bed.
      Airtable cannot do this atomically; it needs a conditional write or a
      short lock. Low risk at ten guests, real at scale.
- [x] ~~Room photography~~ — all six rooms have real photographs as of
      19 September 2026. `old-master` and `old-loft` were matched by judgement
      and are still worth confirming with Danielle.
- [ ] Send the guest's confirmation email and notify Christy (`server.js`, in the
      webhook handler).
- [ ] Wire the newsletter form to a real provider.
- [ ] Add a mobile nav menu — links are hidden below 1040px and only the CTA remains.
- [ ] Serve responsive `srcset` / AVIF instead of single 1600px JPEGs.
- [ ] Confirm licensing for the stock photography before it ships.

## Notes

The retreat caps at **10 women**, but the six rooms sleep 14 between them, so the
cap is enforced across the whole retreat rather than per room (`MAX_GUESTS` in
`rooms.js`).
