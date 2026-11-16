import { experienceCatalog as catalogSource } from "./experience-catalog";

export type Locale = "vi" | "en";
export type ExperienceId = (typeof catalogSource)[number]["id"];
export type ExperienceKind = (typeof catalogSource)[number]["kind"];

export type DrawingPoint = { x: number; y: number; time: number };
export type DrawingStroke = {
  color: string;
  width: number;
  erase: boolean;
  points: DrawingPoint[];
};

export type AnalysisNumbers = {
  centerX: number;
  centerY: number;
  coverage: number;
  strokeCount: number;
  pointCount: number;
  pathLength: number;
  speed: number;
  colorVariety: number;
  dominantHue: number;
  saturation: number;
  brightness: number;
  symmetry: number;
  edgeUse: number;
  curvature: number;
  energy: number;
  pressure: number;
  openness: number;
  focus: number;
  warmth: number;
  playfulness: number;
};

export type LocalProfile = {
  version: 1;
  sessions: number;
  average: AnalysisNumbers;
  recent: AnalysisNumbers[];
  feedback: Partial<Record<ExperienceId, number>>;
  usage: Partial<Record<ExperienceId, number>>;
};

export type ExperienceDefinition = {
  id: ExperienceId;
  kind: ExperienceKind;
  icon: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  target: Pick<AnalysisNumbers, "energy" | "pressure" | "openness" | "focus" | "warmth" | "playfulness">;
};

const PROFILE_KEY = "bloodycotech:personal-profile:v1";
const signalKeys = ["energy", "pressure", "openness", "focus", "warmth", "playfulness"] as const;

const emptyNumbers: AnalysisNumbers = {
  centerX: 50,
  centerY: 50,
  coverage: 0,
  strokeCount: 0,
  pointCount: 0,
  pathLength: 0,
  speed: 0,
  colorVariety: 0,
  dominantHue: 220,
  saturation: 45,
  brightness: 72,
  symmetry: 50,
  edgeUse: 0,
  curvature: 0,
  energy: 50,
  pressure: 50,
  openness: 50,
  focus: 50,
  warmth: 50,
  playfulness: 50,
};

export const experienceCatalog: ExperienceDefinition[] = catalogSource.map((item) => ({
  id: item.id,
  kind: item.kind,
  icon: item.icon,
  title: { vi: item.title.vi, en: item.title.en },
  description: { vi: item.description.vi, en: item.description.en },
  target: {
    energy: item.target.energy,
    pressure: item.target.pressure,
    openness: item.target.openness,
    focus: item.target.focus,
    warmth: item.target.warmth,
    playfulness: item.target.playfulness,
  },
}));

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function rounded(value: number) {
  return Math.round(clamp(value) * 10) / 10;
}

function hexToHsv(hex: string) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3 ? clean.split("").map((item) => item + item).join("") : clean;
  const red = Number.parseInt(value.slice(0, 2), 16) / 255;
  const green = Number.parseInt(value.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }
  if (hue < 0) hue += 360;
  return { hue, saturation: max ? delta / max * 100 : 0, brightness: max * 100 };
}

export function analyzeDrawing(strokes: DrawingStroke[]): AnalysisNumbers {
  const visible = strokes.filter((stroke) => !stroke.erase && stroke.points.length > 0);
  const points = visible.flatMap((stroke) => stroke.points);
  if (!points.length) return { ...emptyNumbers };

  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;
  let sumX = 0;
  let sumY = 0;
  let pathLength = 0;
  let elapsed = 0;
  let turns = 0;
  let turnSamples = 0;
  let edgePoints = 0;

  for (const stroke of visible) {
    for (let index = 0; index < stroke.points.length; index += 1) {
      const point = stroke.points[index];
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
      sumX += point.x;
      sumY += point.y;
      if (point.x < 0.12 || point.x > 0.88 || point.y < 0.12 || point.y > 0.88) edgePoints += 1;
      if (index > 0) {
        const previous = stroke.points[index - 1];
        pathLength += Math.hypot(point.x - previous.x, point.y - previous.y);
        elapsed += Math.max(1, point.time - previous.time);
      }
      if (index > 1) {
        const a = stroke.points[index - 2];
        const b = stroke.points[index - 1];
        const first = Math.atan2(b.y - a.y, b.x - a.x);
        const second = Math.atan2(point.y - b.y, point.x - b.x);
        let delta = Math.abs(second - first);
        if (delta > Math.PI) delta = Math.PI * 2 - delta;
        turns += delta / Math.PI;
        turnSamples += 1;
      }
    }
  }

  const colors = visible.map((stroke) => hexToHsv(stroke.color));
  const hueX = colors.reduce((sum, item) => sum + Math.cos(item.hue * Math.PI / 180), 0);
  const hueY = colors.reduce((sum, item) => sum + Math.sin(item.hue * Math.PI / 180), 0);
  const dominantHue = (Math.atan2(hueY, hueX) * 180 / Math.PI + 360) % 360;
  const saturation = colors.reduce((sum, item) => sum + item.saturation, 0) / colors.length;
  const brightness = colors.reduce((sum, item) => sum + item.brightness, 0) / colors.length;
  const uniqueColors = new Set(visible.map((stroke) => stroke.color)).size;
  const centerX = sumX / points.length;
  const centerY = sumY / points.length;
  const coverage = (maxX - minX) * (maxY - minY);
  const speed = elapsed ? pathLength / elapsed * 1000 : 0;
  const curvature = turnSamples ? turns / turnSamples * 100 : 0;
  const edgeUse = edgePoints / points.length * 100;

  const leftCount = points.filter((point) => point.x < 0.5).length;
  const rightCount = points.length - leftCount;
  const symmetry = 100 - Math.abs(leftCount - rightCount) / points.length * 100;
  const warmDistance = Math.min(Math.abs(dominantHue - 35), 360 - Math.abs(dominantHue - 35));
  const warmth = 100 - warmDistance / 180 * 100;

  return {
    centerX: rounded(centerX * 100),
    centerY: rounded(centerY * 100),
    coverage: rounded(coverage * 100),
    strokeCount: visible.length,
    pointCount: points.length,
    pathLength: Math.round(pathLength * 100) / 100,
    speed: rounded(speed * 8),
    colorVariety: rounded(uniqueColors / 8 * 100),
    dominantHue: Math.round(dominantHue),
    saturation: rounded(saturation),
    brightness: rounded(brightness),
    symmetry: rounded(symmetry),
    edgeUse: rounded(edgeUse),
    curvature: rounded(curvature),
    energy: rounded(speed * 10 + Math.min(35, pathLength * 5) + Math.min(22, visible.length * 1.8)),
    pressure: rounded(curvature * 0.45 + Math.min(35, points.length / Math.max(1, coverage * 100) * 18) + (100 - brightness) * 0.2),
    openness: rounded(coverage * 115 + edgeUse * 0.35),
    focus: rounded(100 - coverage * 45 + symmetry * 0.22 - Math.min(30, uniqueColors * 4)),
    warmth: rounded(warmth * 0.65 + saturation * 0.2 + brightness * 0.15),
    playfulness: rounded(uniqueColors * 10 + curvature * 0.35 + coverage * 40 + saturation * 0.2),
  };
}

export function emptyProfile(): LocalProfile {
  return { version: 1, sessions: 0, average: { ...emptyNumbers }, recent: [], feedback: {}, usage: {} };
}

export function loadProfile(): LocalProfile {
  if (typeof window === "undefined") return emptyProfile();
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return emptyProfile();
    const parsed = JSON.parse(raw) as LocalProfile;
    if (parsed.version !== 1 || typeof parsed.sessions !== "number") return emptyProfile();
    return parsed;
  } catch {
    return emptyProfile();
  }
}

export function saveProfile(profile: LocalProfile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // The app remains usable when storage is blocked.
  }
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
}

export function addAnalysis(profile: LocalProfile, analysis: AnalysisNumbers): LocalProfile {
  const sessions = profile.sessions + 1;
  const average = { ...analysis };
  for (const key of Object.keys(analysis) as Array<keyof AnalysisNumbers>) {
    average[key] = Math.round(((profile.average[key] * profile.sessions + analysis[key]) / sessions) * 10) / 10;
  }
  const next = { ...profile, sessions, average, recent: [...profile.recent, analysis].slice(-24) };
  saveProfile(next);
  return next;
}

export function recordExperience(
  profile: LocalProfile,
  id: ExperienceId,
): LocalProfile {
  const next = {
    ...profile,
    usage: { ...profile.usage, [id]: (profile.usage[id] ?? 0) + 1 },
  };
  saveProfile(next);
  return next;
}

export function recordFeedback(profile: LocalProfile, id: ExperienceId, value: -1 | 1): LocalProfile {
  const next = {
    ...profile,
    feedback: { ...profile.feedback, [id]: (profile.feedback[id] ?? 0) + value },
  };
  saveProfile(next);
  return next;
}

export function rankExperiences(
  analysis: AnalysisNumbers,
  profile: LocalProfile,
  catalog: readonly ExperienceDefinition[] = experienceCatalog,
) {
  const blended = { ...analysis };
  if (profile.sessions > 1) {
    for (const key of signalKeys) blended[key] = analysis[key] * 0.7 + profile.average[key] * 0.3;
  }
  return catalog
    .map((experience) => {
      const distance = signalKeys.reduce((sum, key) => sum + Math.abs(blended[key] - experience.target[key]), 0) / signalKeys.length;
      const preference = (profile.feedback[experience.id] ?? 0) * 8;
      const novelty = Math.max(-16, 8 - (profile.usage[experience.id] ?? 0) * 3);
      return { experience, score: 100 - distance + preference + novelty };
    })
    .sort((a, b) => b.score - a.score);
}

export function recommendationReason(analysis: AnalysisNumbers, locale: Locale) {
  const signals = [
    { key: "energy", value: analysis.energy },
    { key: "pressure", value: analysis.pressure },
    { key: "openness", value: analysis.openness },
    { key: "focus", value: analysis.focus },
    { key: "warmth", value: analysis.warmth },
    { key: "playfulness", value: analysis.playfulness },
  ].sort((a, b) => b.value - a.value);
  const key = signals[0].key;
  const reasons = {
    vi: {
      energy: "Nét đi nhanh và có nhiều chuyển động, nên mình ưu tiên một trải nghiệm có nhịp rõ.",
      pressure: "Mật độ và độ đổi hướng khá cao, nên mình chọn một trải nghiệm giúp chuyển nhịp.",
      openness: "Bức vẽ dùng nhiều khoảng trên trang, nên mình ưu tiên một trải nghiệm có tính khám phá.",
      focus: "Các nét tập trung thành vùng rõ, nên mình chọn một hoạt động cần sự chú ý vừa đủ.",
      warmth: "Bảng màu nghiêng về sắc ấm, nên mình chọn một trải nghiệm gần gũi hơn.",
      playfulness: "Màu sắc và đường cong khá đa dạng, nên mình chọn một điều có tính chơi.",
    },
    en: {
      energy: "The marks move quickly, so I prioritised an experience with a clear rhythm.",
      pressure: "The drawing is dense and changes direction often, so I chose a change of pace.",
      openness: "The drawing reaches across the page, so I prioritised something exploratory.",
      focus: "The marks gather into a clear area, so I chose an activity with gentle focus.",
      warmth: "The palette leans warm, so I chose something more companionable.",
      playfulness: "The varied colours and curves suggest trying something playful.",
    },
  } as const;
  return reasons[locale][key as keyof typeof reasons.vi];
}

