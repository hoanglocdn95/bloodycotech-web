import { experienceCatalog } from "../lib/experience-catalog";
import type { D1Database } from "./env";

const known = new Map<string, (typeof experienceCatalog)[number]>(experienceCatalog.map((item) => [item.id, item]));

export type PublicExperience = {
  id: string;
  kind: string;
  icon: string;
  title: { vi: string; en: string };
  description: { vi: string; en: string };
  target: { energy: number; pressure: number; openness: number; focus: number; warmth: number; playfulness: number };
};

export type AdminExperience = PublicExperience & { enabled: boolean; sortOrder: number };

type ExperienceRow = {
  id: string;
  kind: string;
  icon: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  energy: number;
  pressure: number;
  openness: number;
  focus: number;
  warmth: number;
  playfulness: number;
  enabled: number;
  sort_order: number;
};

const schema = `CREATE TABLE IF NOT EXISTS experiences (
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
)`;

export async function listPublished(db: D1Database): Promise<PublicExperience[]> {
  const rows = await listRows(db, true);
  return rows.map(toPublic);
}

export async function listAdmin(db: D1Database): Promise<AdminExperience[]> {
  const rows = await listRows(db, false);
  return rows.map(toAdmin);
}

export async function saveAdmin(db: D1Database, experiences: AdminExperience[]): Promise<void> {
  await ensureCatalog(db);
  const statements = experiences.map((item) => db.prepare(
    `UPDATE experiences
     SET icon = ?, title_vi = ?, title_en = ?, description_vi = ?, description_en = ?,
         energy = ?, pressure = ?, openness = ?, focus = ?, warmth = ?, playfulness = ?,
         enabled = ?, sort_order = ?
     WHERE id = ?`,
  ).bind(
    item.icon,
    item.title.vi,
    item.title.en,
    item.description.vi,
    item.description.en,
    item.target.energy,
    item.target.pressure,
    item.target.openness,
    item.target.focus,
    item.target.warmth,
    item.target.playfulness,
    item.enabled ? 1 : 0,
    item.sortOrder,
    item.id,
  ));
  await db.batch(statements);
}

export function parseAdminBody(body: unknown): AdminExperience[] | null {
  if (!isRecord(body) || !Array.isArray(body.experiences)) return null;
  if (body.experiences.length !== known.size) return null;
  const seen = new Set<string>();
  const parsed: AdminExperience[] = [];
  for (const item of body.experiences) {
    const experience = parseAdminExperience(item);
    if (!experience || seen.has(experience.id)) return null;
    seen.add(experience.id);
    parsed.push(experience);
  }
  for (const id of known.keys()) if (!seen.has(id)) return null;
  return parsed;
}

async function listRows(db: D1Database, publishedOnly: boolean): Promise<ExperienceRow[]> {
  await ensureCatalog(db);
  const query = publishedOnly
    ? "SELECT * FROM experiences WHERE enabled = 1 ORDER BY sort_order ASC, id ASC"
    : "SELECT * FROM experiences ORDER BY sort_order ASC, id ASC";
  const { results } = await db.prepare(query).all<ExperienceRow>();
  return results.filter((row) => known.has(row.id));
}

async function ensureCatalog(db: D1Database): Promise<void> {
  await db.prepare(schema).run();
  const count = await db.prepare("SELECT COUNT(*) AS total FROM experiences").first<{ total: number }>();
  if ((count?.total ?? 0) > 0) return;
  const statements = experienceCatalog.map((item, index) => db.prepare(
    `INSERT OR IGNORE INTO experiences
     (id, kind, icon, title_vi, title_en, description_vi, description_en,
      energy, pressure, openness, focus, warmth, playfulness, enabled, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
  ).bind(
    item.id,
    item.kind,
    item.icon,
    item.title.vi,
    item.title.en,
    item.description.vi,
    item.description.en,
    item.target.energy,
    item.target.pressure,
    item.target.openness,
    item.target.focus,
    item.target.warmth,
    item.target.playfulness,
    index,
  ));
  await db.batch(statements);
}

function toPublic(row: ExperienceRow): PublicExperience {
  const source = known.get(row.id);
  return {
    id: row.id,
    kind: source?.kind ?? row.kind,
    icon: row.icon,
    title: { vi: row.title_vi, en: row.title_en },
    description: { vi: row.description_vi, en: row.description_en },
    target: {
      energy: row.energy,
      pressure: row.pressure,
      openness: row.openness,
      focus: row.focus,
      warmth: row.warmth,
      playfulness: row.playfulness,
    },
  };
}

function toAdmin(row: ExperienceRow): AdminExperience {
  return { ...toPublic(row), enabled: row.enabled === 1, sortOrder: row.sort_order };
}

function parseAdminExperience(item: unknown): AdminExperience | null {
  if (!isRecord(item) || typeof item.id !== "string") return null;
  const source = known.get(item.id);
  if (!source) return null;
  const titleVi = cleanText(item.titleVi, 120);
  const titleEn = cleanText(item.titleEn, 120);
  const descriptionVi = cleanText(item.descriptionVi, 600);
  const descriptionEn = cleanText(item.descriptionEn, 600);
  const icon = cleanText(item.icon, 8);
  const energy = score(item.energy);
  const pressure = score(item.pressure);
  const openness = score(item.openness);
  const focus = score(item.focus);
  const warmth = score(item.warmth);
  const playfulness = score(item.playfulness);
  if (!titleVi || !titleEn || !descriptionVi || !descriptionEn || !icon) return null;
  if (energy === null || pressure === null || openness === null || focus === null || warmth === null || playfulness === null) return null;
  if (typeof item.enabled !== "boolean") return null;
  if (typeof item.sortOrder !== "number" || !Number.isInteger(item.sortOrder) || item.sortOrder < 0 || item.sortOrder > 999) return null;
  return {
    id: source.id,
    kind: source.kind,
    icon,
    title: { vi: titleVi, en: titleEn },
    description: { vi: descriptionVi, en: descriptionEn },
    target: { energy, pressure, openness, focus, warmth, playfulness },
    enabled: item.enabled,
    sortOrder: item.sortOrder,
  };
}

function score(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < 0 || rounded > 100) return null;
  return rounded;
}

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  let result = "";
  for (const char of value.trim()) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 32 || code === 127) continue;
    result += char;
  }
  if (!result || result.length > max) return null;
  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
