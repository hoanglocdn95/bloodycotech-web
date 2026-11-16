CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  icon TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_vi TEXT NOT NULL,
  description_en TEXT NOT NULL,
  energy INTEGER NOT NULL,
  pressure INTEGER NOT NULL,
  openness INTEGER NOT NULL,
  focus INTEGER NOT NULL,
  warmth INTEGER NOT NULL,
  playfulness INTEGER NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL
);
