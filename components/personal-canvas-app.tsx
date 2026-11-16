"use client";

import { ArrowLeft, Heart, ThumbsDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrivalSequence } from "@/components/arrival-sequence";
import { DrawingStudio } from "@/components/drawing-studio";
import { ExperienceHost } from "@/components/experience-host";
import {
  addAnalysis,
  analyzeDrawing,
  clearProfile,
  emptyProfile,
  experienceCatalog,
  loadProfile,
  rankExperiences,
  recordExperience,
  recordFeedback,
  type AnalysisNumbers,
  type DrawingStroke,
  type ExperienceDefinition,
  type ExperienceId,
  type LocalProfile,
  type Locale,
} from "@/lib/personalization";
import { loadPublishedCatalog } from "@/lib/published-catalog";
import styles from "./personal-canvas-app.module.css";

type View = "draw" | "recommendation" | "library" | "experience" | "profile";

const copy = {
  vi: {
    library: "Thư viện",
    profile: "Góc của mình",
    noDrawing: "Không cần vẽ cũng được. Hãy chọn một điều từ thư viện.",
    observed: "Những tín hiệu app vừa ghi nhận",
    notDiagnosis: "Các con số là tín hiệu ước lượng từ nét vẽ, không phải kết luận tâm lý hay chẩn đoán.",
    found: "Chúng tôi đã tìm được một thứ phù hợp với bạn. Bạn có muốn thử không?",
    emptyOffer: "Hiện chưa có trải nghiệm nào được mở.",
    discover: "Khám phá",
    another: "Cho mình điều khác",
    all: "Xem toàn bộ thư viện",
    drawAgain: "Vẽ lại",
    apps: "Ứng dụng",
    games: "Trò chơi",
    stories: "Câu chữ",
    back: "Quay lại",
    fit: "Hợp với mình",
    notFit: "Chưa hợp",
    sessions: "lần đã cùng nhau",
    profileIntro: "Mỗi lần vẽ, app chỉ giữ lại các thông số bằng số và trộn chúng vào hồ sơ cục bộ. Không có ảnh hoặc nét vẽ nào được lưu.",
    reset: "Xóa hồ sơ cá nhân hóa",
    resetConfirm: "Xóa toàn bộ thông số cá nhân hóa trên thiết bị này?",
    noProfile: "Hồ sơ sẽ bắt đầu hình thành sau bức vẽ đầu tiên.",
    energy: "Năng lượng",
    pressure: "Áp lực",
    openness: "Độ mở",
    focus: "Tập trung",
    warmth: "Ấm áp",
    playfulness: "Tính chơi",
  },
  en: {
    library: "Library",
    profile: "My corner",
    noDrawing: "You do not have to draw. Pick something from the library instead.",
    observed: "Signals the app noticed",
    notDiagnosis: "These numbers are estimates from the marks—not a psychological verdict or diagnosis.",
    found: "We found something that fits you. Would you like to try it?",
    emptyOffer: "Nothing is available to try right now.",
    discover: "Explore",
    another: "Show me another",
    all: "See the whole library",
    drawAgain: "Draw again",
    apps: "Apps",
    games: "Games",
    stories: "Words",
    back: "Back",
    fit: "This fits",
    notFit: "Not for me",
    sessions: "times together",
    profileIntro: "After each drawing, the app keeps only numeric signals and blends them into a local profile. No image or stroke is stored.",
    reset: "Reset personalisation",
    resetConfirm: "Delete all personalisation numbers on this device?",
    noProfile: "Your profile will begin taking shape after your first drawing.",
    energy: "Energy",
    pressure: "Pressure",
    openness: "Openness",
    focus: "Focus",
    warmth: "Warmth",
    playfulness: "Playfulness",
  },
} as const;

const dimensions = ["energy", "pressure", "openness", "focus", "warmth", "playfulness"] as const;

export function PersonalCanvasApp({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [view, setView] = useState<View>("draw");
  const [profile, setProfile] = useState<LocalProfile>(emptyProfile);
  const [analysis, setAnalysis] = useState<AnalysisNumbers | null>(null);
  const [recommendations, setRecommendations] = useState<Array<{ experience: ExperienceDefinition; score: number }>>([]);
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [activeExperience, setActiveExperience] = useState<ExperienceId | null>(null);
  const [drawingKey, setDrawingKey] = useState(0);
  const [boardReady, setBoardReady] = useState(false);
  const [catalog, setCatalog] = useState(experienceCatalog);
  const catalogRef = useRef(experienceCatalog);
  const profileRef = useRef(profile);
  const analysisRef = useRef<AnalysisNumbers | null>(null);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProfile(loadProfile()));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadPublishedCatalog().then((next) => {
      if (cancelled || !next) return;
      catalogRef.current = next;
      setCatalog(next);
      if (analysisRef.current) setRecommendations(rankExperiences(analysisRef.current, profileRef.current, next));
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (view !== "draw") return;
    const html = document.documentElement;
    const body = document.body;
    const previousHtml = html.style.overflow;
    const previousBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousHtml;
      body.style.overflow = previousBody;
    };
  }, [view]);

  const theme = useMemo(() => {
    const source = analysis ?? (profile.sessions ? profile.average : null);
    const hue = source?.dominantHue ?? 32;
    const saturation = Math.max(28, Math.min(64, source?.saturation ?? 46));
    return { "--personal-hue": hue, "--personal-saturation": `${saturation}%` } as CSSProperties;
  }, [analysis, profile]);

  const complete = (strokes: DrawingStroke[]) => {
    const nextAnalysis = analyzeDrawing(strokes);
    const nextProfile = addAnalysis(profile, nextAnalysis);
    analysisRef.current = nextAnalysis;
    setProfile(nextProfile);
    setAnalysis(nextAnalysis);
    setRecommendations(rankExperiences(nextAnalysis, nextProfile, catalogRef.current));
    setRecommendationIndex(0);
    setView("recommendation");
  };

  const openExperience = (id: ExperienceId) => {
    setActiveExperience(id);
    setProfile((current) => recordExperience(current, id));
    setView("experience");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const feedback = (value: -1 | 1) => {
    if (!activeExperience) return;
    const next = recordFeedback(profile, activeExperience, value);
    setProfile(next);
    if (value < 0 && analysis) {
      setRecommendations(rankExperiences(analysis, next, catalogRef.current));
      setRecommendationIndex((index) => Math.min(index + 1, recommendations.length - 1));
      setView("recommendation");
    }
  };

  const drawAgain = () => { setDrawingKey((value) => value + 1); setAnalysis(null); setView("draw"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const current = recommendations[recommendationIndex]?.experience;
  const arriving = view === "draw" && !boardReady;

  return <div className={view === "draw" ? `${styles.app} ${styles.appPaper}` : styles.app} style={theme}>
    <div className={arriving ? styles.held : styles.stage} inert={arriving} aria-hidden={arriving}>
    <main>
      {view === "draw" ? <DrawingStudio key={drawingKey} locale={locale} ready={boardReady} onComplete={complete} /> : null}
      {view === "recommendation" && current ? <Recommendation locale={locale} experience={current} onOpen={() => openExperience(current.id)} /> : null}
      {view === "recommendation" && !current ? <EmptyOffer locale={locale} /> : null}
      {view === "library" ? <LibraryView locale={locale} catalog={catalog} onOpen={openExperience} onDraw={drawAgain} intro={t.noDrawing} /> : null}
      {view === "profile" ? <ProfileView locale={locale} profile={profile} onReset={() => { if (window.confirm(t.resetConfirm)) { clearProfile(); setProfile(emptyProfile()); setAnalysis(null); } }} /> : null}
      {view === "experience" && activeExperience ? <ExperienceView locale={locale} catalog={catalog} id={activeExperience} onBack={() => setView(analysis ? "recommendation" : "library")} onFeedback={feedback} /> : null}
    </main>
    </div>
    {arriving ? <ArrivalSequence locale={locale} onDone={() => setBoardReady(true)} /> : null}
  </div>;
}

function SignalBars({ locale, values }: { locale: Locale; values: AnalysisNumbers }) {
  const t = copy[locale];
  return <div className={styles.signalGrid}>{dimensions.map((key) => <div key={key}><span><b>{t[key]}</b><i>{Math.round(values[key])}</i></span><div><em style={{ width: `${values[key]}%` }} /></div></div>)}</div>;
}

function Recommendation({ locale, experience, onOpen }: { locale: Locale; experience: ExperienceDefinition; onOpen: () => void }) {
  const t = copy[locale];
  return <section className={styles.offer}>
    <p className={styles.offerLead}>{t.found}</p>
    <h1>{experience.title[locale]}</h1>
    <button className={styles.primaryAction} onClick={onOpen}>{t.discover}</button>
  </section>;
}

function EmptyOffer({ locale }: { locale: Locale }) {
  return <section className={styles.offer}><p className={styles.offerLead}>{copy[locale].emptyOffer}</p></section>;
}

function LibraryView({ locale, catalog, intro, onOpen, onDraw }: { locale: Locale; catalog: ExperienceDefinition[]; intro: string; onOpen: (id: ExperienceId) => void; onDraw: () => void }) {
  const t = copy[locale];
  const groups: Array<{ kind: ExperienceDefinition["kind"]; title: string }> = [{ kind: "app", title: t.apps }, { kind: "game", title: t.games }, { kind: "story", title: t.stories }];
  return <section className={styles.libraryView}><button className={styles.returnLink} onClick={onDraw}>{t.drawAgain}</button><div className={styles.pageIntro}><p className={styles.eyebrow}>Experience library</p><h1>{t.library}</h1><p>{intro}</p></div>{groups.map((group) => <div key={group.kind} className={styles.libraryGroup}><h2>{group.title}</h2><div className={styles.cardGrid}>{catalog.filter((item) => item.kind === group.kind).map((item) => <button key={item.id} className={styles.experienceCard} onClick={() => onOpen(item.id)}><span>{item.icon}</span><div><h3>{item.title[locale]}</h3><p>{item.description[locale]}</p></div></button>)}</div></div>)}</section>;
}

function ProfileView({ locale, profile, onReset }: { locale: Locale; profile: LocalProfile; onReset: () => void }) {
  const t = copy[locale];
  return <section className={styles.profileView}><div className={styles.pageIntro}><p className={styles.eyebrow}>Local personalisation</p><h1>{t.profile}</h1><p>{t.profileIntro}</p></div><div className={styles.profileCard}><div className={styles.sessionCount}><strong>{profile.sessions}</strong><span>{t.sessions}</span></div>{profile.sessions ? <SignalBars locale={locale} values={profile.average} /> : <p className={styles.emptyProfile}>{t.noProfile}</p>}<button className={styles.dangerButton} onClick={onReset}>{t.reset}</button></div></section>;
}

function ExperienceView({ locale, catalog, id, onBack, onFeedback }: { locale: Locale; catalog: ExperienceDefinition[]; id: ExperienceId; onBack: () => void; onFeedback: (value: -1 | 1) => void }) {
  const t = copy[locale]; const definition = catalog.find((item) => item.id === id) ?? experienceCatalog.find((item) => item.id === id)!;
  return <section className={styles.experienceView}><div className={styles.experienceTopbar}><button onClick={onBack}><ArrowLeft />{t.back}</button><div><span>{definition.icon}</span><strong>{definition.title[locale]}</strong></div><button aria-label={t.back} onClick={onBack}><X /></button></div><div className={styles.experienceBody}><ExperienceHost id={id} locale={locale} /></div><div className={styles.feedbackBar}><span>{locale === "vi" ? "Trải nghiệm này thế nào?" : "How did this feel?"}</span><button onClick={() => { onFeedback(1); onBack(); }}><Heart />{t.fit}</button><button onClick={() => onFeedback(-1)}><ThumbsDown />{t.notFit}</button></div></section>;
}

