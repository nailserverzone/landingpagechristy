# Be Your Own Superhero™ Retreat

Landing page and deposit registration for the retreat on **September 18–20, 2026**,
Lake Hamilton, Hot Springs, Arkansas.

> ⚠️ **Concept demo.** The page carries a visible watermark and is not the final
> client site. Nothing here should take real money until the items under
> [Before going live](#before-going-live) are settled.

## Running it

```bash
npm install
cp .env.example .env
npm start                  # http://localhost:4242
```

**Payments are off by default.** The form collects the full registration and
charges nothing — Christy is handed the details and arranges the deposit
herself. That is the correct state until her Stripe account is live, so no keys
are needed to run the site.

Turn payments on only when her account is verified:

```bash
PAYMENTS_ENABLED=true      # in .env, alongside the two Stripe keys
```

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
| Guest pays $300 | Stripe redirects back to `/?reserved=1` |
| `checkout.session.completed` | Webhook flips the registration to `confirmed` and records the Stripe IDs |
| Balance, later | Charge the saved card off-session using the stored `stripeCustomerId` |

Two things are deliberate and worth preserving if this moves to another host:

- **The browser never sends an amount.** It sends a room `id`; the server prices
  it from `rooms.js`. A tampered request cannot change what is charged.
- **The card is saved at deposit time** (`setup_future_usage: "off_session"`),
  so the remaining $495 or $695 can be charged later without asking the guest
  to enter their details again.

## Layout

The site is two pages that link to each other — the retreat, and the existing
coaching landing page the brand already had.

| File | Purpose |
| --- | --- |
| `index.html` | Retreat page — loads React, Babel, `rooms.js`, `app.jsx` |
| `app.jsx` | The retreat page as React components |
| `coaching.html` | Coaching page — "Free 1-Hour Coaching Call" |
| `coaching.jsx` | The coaching page as React components |
| `styles.css` | Design system — tokens, layout, the single 900px breakpoint |
| `rooms.js` | **Source of truth** for rooms, prices and capacity; used by both browser and server |
| `server.js` | Static serving, `/api/checkout`, `/api/webhook` |
| `assets/retreat/web/` | Lake photography, 1600px q82 |

## Before going live

Carried over from the design handoff, plus what surfaced while building:

- [ ] **Set real room availability** in `rooms.js` (`AVAILABILITY`). Everything is
      marked available as a placeholder — publishing as-is offers rooms that may
      already be taken.
- [ ] **Confirm the prices.** `$795` / `$995` / `$300` are working figures.
- [ ] **Christy creates and verifies her own Stripe account**, then invites the
      developer as a team member. The account must be hers — the deposits land
      in whichever bank account it is tied to.
- [ ] Flip `PAYMENTS_ENABLED=true` once that account is live.
- [ ] **Confirm the refund and cancellation policy in writing** — the handoff is
      explicit that this precedes taking any payment.
- [ ] **Replace the JSON file store with a real database.** Capacity is checked
      and then written in two steps, so two guests submitting at once can
      oversell the last bed. That needs a transaction.
- [ ] **Room photography.** Each room card names the shot it is waiting for.
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
