# 🎁 Digital Gift Box

An interactive, animated digital gift experience for Etsy sellers. Buyers fill out a form after purchase and receive a unique shareable URL. Recipients open a beautifully animated gift box containing photos, a personal letter, music, a gift card, and an ID badge.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Database | Supabase (Postgres) |
| Storage | Supabase Storage |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo>
cd digital-gift-box
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration SQL in `supabase/migration.sql` via the SQL Editor in your Supabase Dashboard
3. Create a public Storage bucket named **`gift-assets`**:
   - Go to Storage → New Bucket
   - Name: `gift-assets`
   - Enable **Public bucket**
4. Copy your project URL and keys

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
  page.tsx                    # Landing / home page
  create/page.tsx             # Multi-step gift creation wizard
  gift/[slug]/
    page.tsx                  # Server component — fetches gift data
    GiftExperience.tsx        # Client — animated gift box experience
  api/
    upload/route.ts           # File upload endpoint → Supabase Storage
    gifts/route.ts            # POST: create a new gift
    gifts/[slug]/route.ts     # GET: fetch gift by slug

components/
  GiftBox/
    BoxClosed.tsx             # Animated closed box (floating, shaking)
    BoxOpen.tsx               # Open box shell with floating lid
    BoxInterior.tsx           # Blue shreds + all 5 items positioned
    ItemModal.tsx             # Shared fullscreen modal (blur backdrop, ESC close)
    items/
      GiftCardItem.tsx        # Gift card thumbnail + modal
      LetterItem.tsx          # Envelope animation + letter reveal
      IdBadgeItem.tsx         # ID badge thumbnail + modal
      CameraItem.tsx          # Camera thumbnail + photo lightbox + swipe
      CdItem.tsx              # CD thumbnail + Spotify/YouTube/audio player

  CreateForm/
    StepIndicator.tsx         # 5-step progress bar
    TemplateSelector.tsx      # 4 box theme cards
    RecipientForm.tsx         # Name, occasion, year inputs
    LetterForm.tsx            # Letter textarea + character counter
    AssetUploader.tsx         # Photo, gift card, audio upload sections
    Preview.tsx               # Read-only summary before submit
    ShareLink.tsx             # Copy link + QR code on success

  ui/
    Button.tsx                # Primary / secondary / ghost button
    Input.tsx                 # Text input + textarea with label/error
    FileDropzone.tsx          # Drag-and-drop file upload zone

lib/
  supabase.ts                 # Supabase client factory
  utils.ts                    # cn(), generateSlug(), formatBytes()
  confetti.ts                 # canvas-confetti burst on box open

types/
  gift.ts                     # Gift interface, FormState, CreateGiftPayload

supabase/
  migration.sql               # DB schema + RLS policies
```

---

## Supabase Storage Policy

The `gift-assets` bucket should be **public** (read-only for everyone). Write access is controlled by the Service Role key used in API routes. The storage folder structure is:

```
gift-assets/
  {giftId}/
    photo/         ← uploaded photos
    gift-card/     ← gift card image
    audio/         ← audio file
```

---

## Etsy Integration

Etsy does not support direct API webhooks for purchases on the hobby/standard plan. Two approaches work well:

### Option A — Thank You Page URL (Simplest)

1. In your Etsy listing → Edit → "Add a message to buyers" (or custom "Thank you" page URL)
2. Set the URL to: `https://your-domain.com/create`
3. After purchase, buyers are directed to your `/create` page to fill out the gift form

**Limitations:** Etsy's built-in redirect is basic; no pre-filled buyer data.

### Option B — Zapier Automation (Recommended)

Use Zapier to connect Etsy orders to your app:

1. Create a Zap: **Etsy → New Order** (trigger)
2. Action: **Webhooks by Zapier → POST** to `https://your-domain.com/api/gifts`
3. Map fields:
   ```json
   {
     "recipient_name": "{{buyer_name}}",
     "occasion": "Birthday",
     "occasion_year": 2025,
     "template_id": "pastel-pink",
     "letter_html": "",
     "photos": [],
     "playlist_url": "",
     "audio_url": "",
     "gift_card_image_url": "",
     "gift_card_code": "",
     "gift_card_brand": ""
   }
   ```
4. The API returns `{ slug }` — Zapier can then send the URL to the buyer via email

### Option C — Order Confirmation Code Field

Add a field in your form for buyers to enter their Etsy order number. This allows light validation that they made a purchase. You can cross-reference via the Etsy API if you have a developer account.

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

---

## Cleanup: Orphaned Uploads

Files uploaded during the form but abandoned (user didn't finish) are orphaned in Supabase Storage. To clean them up:

**Option A — Supabase Edge Function (scheduled cron)**

Create an Edge Function that runs daily:
```sql
-- Find gift IDs referenced in storage but not in gifts table
-- Delete objects older than 24h in paths not matching any gift.id
```

**Option B — Vercel Cron Job**

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cleanup",
    "schedule": "0 3 * * *"
  }]
}
```

Create `/api/cleanup/route.ts` that deletes storage objects older than 24h whose folder name doesn't match any `gifts.id`.

---

## Box Templates

| Template | ID | Description |
|----------|----|-------------|
| Pastel Pink | `pastel-pink` | Soft pink, romantic |
| Midnight Blue | `midnight-blue` | Dark, elegant |
| Warm Cream | `warm-cream` | Cozy, warm tones |
| Confetti | `confetti` | Fun, celebratory |

---

## Demo

Visit `/gift/demo` to see the full experience without a database connection.

---

## License

MIT — free to use for personal and commercial projects.
