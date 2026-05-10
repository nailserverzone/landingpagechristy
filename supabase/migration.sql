-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Gifts table
CREATE TABLE IF NOT EXISTS gifts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT UNIQUE NOT NULL,
  template_id         TEXT NOT NULL DEFAULT 'pastel-pink',
  recipient_name      TEXT NOT NULL,
  occasion            TEXT NOT NULL,
  occasion_year       INT NOT NULL,
  letter_html         TEXT,
  playlist_url        TEXT,
  audio_url           TEXT,
  gift_card_image_url TEXT,
  gift_card_code      TEXT,
  gift_card_brand     TEXT,
  photos              TEXT[] DEFAULT '{}',
  views               INT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT now(),
  is_active           BOOLEAN DEFAULT TRUE
);

-- Index on slug for fast lookup
CREATE INDEX IF NOT EXISTS gifts_slug_idx ON gifts(slug);

-- Row Level Security
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- Anyone can read active gifts (for the /gift/[slug] page)
CREATE POLICY "Public read active gifts"
  ON gifts FOR SELECT
  USING (is_active = TRUE);

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access"
  ON gifts FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Storage: Create public bucket for gift assets
-- Run this in Supabase Dashboard > Storage or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gift-assets', 'gift-assets', true);
