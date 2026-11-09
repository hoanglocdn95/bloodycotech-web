"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Library, RotateCcw, Settings2, Sparkles, ThumbsDown, X } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
  recommendationReason,
  recordExperience,
  recordFeedback,
  type AnalysisNumbers,
  type DrawingStroke,
  type ExperienceDefinition,
  type ExperienceId,
  type LocalProfile,
  type Locale,
} from "@/lib/personalization";
import styles from "./personal-canvas-app.module.css";

type View = "draw" | "recommendation" | "library" | "experience" | "profile";

const copy = {
  vi: {
    brandLine: "Một nơi dần trở thành của riêng bạn",
    draw: "Vẽ",
    library: "Thư viện",
    profile: "Góc của mình",
    noDrawing: "Không cần vẽ cũng được. Hãy chọn một điều từ thư viện.",
    observed: "Những tín hiệu app vừa ghi nhận",
    notDiagnosis: "Các con số là tín hiệu ước lượng từ nét vẽ, không phải kết luận tâm lý hay chẩn đoán.",
    found: "Mình tìm thấy một điều có thể hợp lúc này",
    tryNow: "Thử ngay",
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
    localOnly: "Chỉ trên thiết bị này · Không API · Không tài khoản",
  },
  en: {
    brandLine: "A place that gradually becomes your own",
    draw: "Draw",
    library: "Library",
    profile: "My corner",
    noDrawing: "You do not have to draw. Pick something from the library instead.",
    observed: "Signals the app noticed",
    notDiagnosis: "These numbers are estimates from the marks—not a psychological verdict or diagnosis.",
    found: "I found something that may fit this moment",
    tryNow: "Try it",
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
    localOnly: "This device only · No API · No account",
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

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProfile(loadProfile()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const theme = useMemo(() => {
    const source = analysis ?? (profile.sessions ? profile.average : null);
    const hue = source?.dominantHue ?? 32;
    const saturation = Math.max(28, Math.min(64, source?.saturation ?? 46));
    return { "--personal-hue": hue, "--personal-saturation": `${saturation}%` } as CSSProperties;
  }, [analysis, profile]);

  const complete = (strokes: DrawingStroke[]) => {
    const nextAnalysis = analyzeDrawing(strokes);
    const nextProfile = addAnalysis(profile, nextAnalysis);
    setProfile(nextProfile);
    setAnalysis(nextAnalysis);
    setRecommendations(rankExperiences(nextAnalysis, nextProfile));
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
      setRecommendations(rankExperiences(analysis, next));
      setRecommendationIndex((index) => Math.min(index + 1, recommendations.length - 1));
      setView("recommendation");
    }
  };

  const drawAgain = () => { setDrawingKey((value) => value + 1); setAnalysis(null); setView("draw"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const current = recommendations[recommendationIndex]?.experience;

  return <div className={styles.app} style={theme}>
    <header className={styles.header}>
      <button className={styles.brand} onClick={drawAgain} aria-label="BloodyCoTech"><span>B</span><span><strong>BloodyCoTech</strong><small>{t.brandLine}</small></span></button>
      <nav aria-label={locale === "vi" ? "Điều hướng ứng dụng" : "App navigation"}>
        <button className={view === "draw" ? styles.navActive : ""} onClick={drawAgain}><Sparkles />{t.draw}</button>
        <button className={view === "library" ? styles.navActive : ""} onClick={() => setView("library")}><Library />{t.library}</button>
        <button className={view === "profile" ? styles.navActive : ""} onClick={() => setView("profile")}><Settings2 />{t.profile}</button>
      </nav>
      <Link className={styles.language} href={locale === "vi" ? "/en/" : "/"}>{locale === "vi" ? "EN" : "VI"}</Link>
    </header>

    <main>
      {view === "draw" ? <DrawingStudio key={drawingKey} locale={locale} onComplete={complete} onSkip={() => setView("library")} onLibrary={() => setView("library")} /> : null}
      {view === "recommendation" && analysis && current ? <Recommendation locale={locale} analysis={analysis} experience={current} reason={recommendationReason(analysis, locale)} onOpen={() => openExperience(current.id)} onAnother={() => setRecommendationIndex((index) => (index + 1) % recommendations.length)} onLibrary={() => setView("library")} onDraw={drawAgain} /> : null}
      {view === "library" ? <LibraryView locale={locale} onOpen={openExperience} intro={t.noDrawing} /> : null}
      {view === "profile" ? <ProfileView locale={locale} profile={profile} onReset={() => { if (window.confirm(t.resetConfirm)) { clearProfile(); setProfile(emptyProfile()); setAnalysis(null); } }} /> : null}
      {view === "experience" && activeExperience ? <ExperienceView locale={locale} id={activeExperience} onBack={() => setView(analysis ? "recommendation" : "library")} onFeedback={feedback} /> : null}
    </main>
    <footer className={styles.footer}><span>{t.localOnly}</span><nav aria-label={locale === "vi" ? "Thông tin BloodyCoTech" : "BloodyCoTech information"}><Link href={locale === "vi" ? "/how-it-works/" : "/en/how-it-works/"}>{locale === "vi" ? "Cách hoạt động" : "How it works"}</Link><Link href={locale === "vi" ? "/about/" : "/en/about/"}>{locale === "vi" ? "Giới thiệu" : "About"}</Link><Link href={locale === "vi" ? "/privacy/" : "/en/privacy/"}>{locale === "vi" ? "Riêng tư" : "Privacy"}</Link><Link href={locale === "vi" ? "/terms/" : "/en/terms/"}>{locale === "vi" ? "Điều khoản" : "Terms"}</Link><Link href={locale === "vi" ? "/contact/" : "/en/contact/"}>{locale === "vi" ? "Liên hệ" : "Contact"}</Link></nav></footer>
  </div>;
}

function SignalBars({ locale, values }: { locale: Locale; values: AnalysisNumbers }) {
  const t = copy[locale];
  return <div className={styles.signalGrid}>{dimensions.map((key) => <div key={key}><span><b>{t[key]}</b><i>{Math.round(values[key])}</i></span><div><em style={{ width: `${values[key]}%` }} /></div></div>)}</div>;
}

function Recommendation({ locale, analysis, experience, reason, onOpen, onAnother, onLibrary, onDraw }: { locale: Locale; analysis: AnalysisNumbers; experience: ExperienceDefinition; reason: string; onOpen: () => void; onAnother: () => void; onLibrary: () => void; onDraw: () => void }) {
  const t = copy[locale];
  return <section className={styles.recommendation}>
    <div className={styles.analysisPanel}><p className={styles.eyebrow}>{t.observed}</p><SignalBars locale={locale} values={analysis} /><p className={styles.disclaimer}>{t.notDiagnosis}</p></div>
    <div className={styles.giftPanel}><p className={styles.eyebrow}>{t.found}</p><div className={styles.giftIcon}>{experience.icon}</div><span className={styles.kind}>{experience.kind}</span><h1>{experience.title[locale]}</h1><p className={styles.experienceDescription}>{experience.description[locale]}</p><p className={styles.reason}>{reason}</p><div className={styles.recommendActions}><button className={styles.primaryAction} onClick={onOpen}>{t.tryNow}</button><button onClick={onAnother}>{t.another}</button><button onClick={onLibrary}>{t.all}</button><button onClick={onDraw}><RotateCcw />{t.drawAgain}</button></div></div>
  </section>;
}

function LibraryView({ locale, intro, onOpen }: { locale: Locale; intro: string; onOpen: (id: ExperienceId) => void }) {
  const t = copy[locale];
  const groups: Array<{ kind: ExperienceDefinition["kind"]; title: string }> = [{ kind: "app", title: t.apps }, { kind: "game", title: t.games }, { kind: "story", title: t.stories }];
  return <section className={styles.libraryView}><div className={styles.pageIntro}><p className={styles.eyebrow}>Experience library</p><h1>{t.library}</h1><p>{intro}</p></div>{groups.map((group) => <div key={group.kind} className={styles.libraryGroup}><h2>{group.title}</h2><div className={styles.cardGrid}>{experienceCatalog.filter((item) => item.kind === group.kind).map((item) => <button key={item.id} className={styles.experienceCard} onClick={() => onOpen(item.id)}><span>{item.icon}</span><div><h3>{item.title[locale]}</h3><p>{item.description[locale]}</p></div></button>)}</div></div>)}</section>;
}

function ProfileView({ locale, profile, onReset }: { locale: Locale; profile: LocalProfile; onReset: () => void }) {
  const t = copy[locale];
  return <section className={styles.profileView}><div className={styles.pageIntro}><p className={styles.eyebrow}>Local personalisation</p><h1>{t.profile}</h1><p>{t.profileIntro}</p></div><div className={styles.profileCard}><div className={styles.sessionCount}><strong>{profile.sessions}</strong><span>{t.sessions}</span></div>{profile.sessions ? <SignalBars locale={locale} values={profile.average} /> : <p className={styles.emptyProfile}>{t.noProfile}</p>}<button className={styles.dangerButton} onClick={onReset}>{t.reset}</button></div></section>;
}

function ExperienceView({ locale, id, onBack, onFeedback }: { locale: Locale; id: ExperienceId; onBack: () => void; onFeedback: (value: -1 | 1) => void }) {
  const t = copy[locale]; const definition = experienceCatalog.find((item) => item.id === id)!;
  return <section className={styles.experienceView}><div className={styles.experienceTopbar}><button onClick={onBack}><ArrowLeft />{t.back}</button><div><span>{definition.icon}</span><strong>{definition.title[locale]}</strong></div><button aria-label={t.back} onClick={onBack}><X /></button></div><div className={styles.experienceBody}><ExperienceHost id={id} locale={locale} /></div><div className={styles.feedbackBar}><span>{locale === "vi" ? "Trải nghiệm này thế nào?" : "How did this feel?"}</span><button onClick={() => { onFeedback(1); onBack(); }}><Heart />{t.fit}</button><button onClick={() => onFeedback(-1)}><ThumbsDown />{t.notFit}</button></div></section>;
}

