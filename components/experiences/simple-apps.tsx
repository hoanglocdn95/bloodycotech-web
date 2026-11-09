"use client";

import { Pause, Play, RefreshCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/personalization";
import styles from "./experiences.module.css";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function chime() {
  try {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(660, audio.currentTime + .35);
    gain.gain.setValueAtTime(.001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.12, audio.currentTime + .03);
    gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .6);
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.start(); oscillator.stop(audio.currentTime + .62);
    window.setTimeout(() => void audio.close(), 900);
  } catch { /* Audio is progressive enhancement. */ }
}

export function PomodoroExperience({ locale }: { locale: Locale }) {
  const labels = locale === "vi"
    ? { focus: "Tập trung", rest: "Nghỉ", start: "Bắt đầu", pause: "Tạm dừng", reset: "Đặt lại", rounds: "phiên đã xong" }
    : { focus: "Focus", rest: "Break", start: "Start", pause: "Pause", reset: "Reset", rounds: "rounds completed" };
  const [mode, setMode] = useState<"focus" | "rest">("focus");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [rounds, setRounds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value > 1) return value - 1;
      chime();
      setMode((current) => {
        const next = current === "focus" ? "rest" : "focus";
        if (current === "focus") setRounds((count) => count + 1);
        window.setTimeout(() => setSeconds(next === "focus" ? 25 * 60 : 5 * 60), 0);
        return next;
      });
      setRunning(false);
      return 0;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const reset = () => { setRunning(false); setSeconds(mode === "focus" ? 25 * 60 : 5 * 60); };
  return <div className={styles.centeredApp}>
    <div className={styles.modePills}>
      <button className={mode === "focus" ? styles.activePill : ""} onClick={() => { setMode("focus"); setSeconds(25 * 60); setRunning(false); }}>{labels.focus}</button>
      <button className={mode === "rest" ? styles.activePill : ""} onClick={() => { setMode("rest"); setSeconds(5 * 60); setRunning(false); }}>{labels.rest}</button>
    </div>
    <div className={styles.timer} aria-live="polite">{formatTime(seconds)}</div>
    <p className={styles.subtle}>{rounds} {labels.rounds}</p>
    <div className={styles.appActions}>
      <button className={styles.primary} onClick={() => setRunning((value) => !value)}>{running ? <Pause /> : <Play />}{running ? labels.pause : labels.start}</button>
      <button className={styles.secondary} onClick={reset}><RefreshCcw />{labels.reset}</button>
    </div>
  </div>;
}

const exerciseSets = {
  vi: ["Vươn vai", "Xoay vai", "Ngồi xuống đứng lên", "Nâng gối tại chỗ", "Chạm mũi chân", "Thả lỏng và thở"],
  en: ["Reach overhead", "Shoulder rolls", "Chair squats", "High knees", "Toe touches", "Shake out and breathe"],
};

export function ExerciseExperience({ locale }: { locale: Locale }) {
  const labels = locale === "vi"
    ? { choose: "Chọn thời lượng", start: "Bắt đầu", pause: "Tạm dừng", continue: "Tiếp tục", done: "Bạn đã hoàn thành rồi.", note: "Dừng lại nếu thấy đau hoặc chóng mặt." }
    : { choose: "Choose a duration", start: "Start", pause: "Pause", continue: "Continue", done: "You made it through.", note: "Stop if anything feels painful or dizzy." };
  const [minutes, setMinutes] = useState(3);
  const [remaining, setRemaining] = useState(3 * 60);
  const [running, setRunning] = useState(false);
  const exercises = exerciseSets[locale];
  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [remaining, running]);
  const index = Math.min(exercises.length - 1, Math.floor((minutes * 60 - remaining) / 30) % exercises.length);
  return <div className={styles.centeredApp}>
    <p className={styles.label}>{labels.choose}</p>
    <div className={styles.modePills}>{[3, 5, 8].map((item) => <button key={item} className={minutes === item ? styles.activePill : ""} onClick={() => { setMinutes(item); setRemaining(item * 60); setRunning(false); }}>{item} min</button>)}</div>
    <div className={styles.exerciseFigure} aria-hidden="true"><span /><i /></div>
    <h3 className={styles.exerciseName}>{remaining === 0 ? labels.done : exercises[index]}</h3>
    <div className={styles.smallTimer}>{formatTime(remaining)}</div>
    <button className={styles.primary} disabled={remaining === 0} onClick={() => setRunning((value) => !value)}>{running ? <Pause /> : <Play />}{running ? labels.pause : remaining === minutes * 60 ? labels.start : labels.continue}</button>
    <p className={styles.note}>{labels.note}</p>
  </div>;
}

type AudioSession = { context: AudioContext; nodes: AudioNode[]; sources: AudioScheduledSourceNode[] };

function startSceneAudio(scene: "rain" | "cafe" | "forest") {
  const context = new AudioContext();
  const nodes: AudioNode[] = [];
  const sources: AudioScheduledSourceNode[] = [];
  const seconds = 3;
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
  const source = context.createBufferSource();
  source.buffer = buffer; source.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = scene === "rain" ? "highpass" : scene === "cafe" ? "bandpass" : "lowpass";
  filter.frequency.value = scene === "rain" ? 1100 : scene === "cafe" ? 520 : 850;
  const gain = context.createGain(); gain.gain.value = scene === "rain" ? .11 : .075;
  source.connect(filter); filter.connect(gain); gain.connect(context.destination); source.start();
  nodes.push(filter, gain); sources.push(source);
  if (scene !== "rain") {
    const oscillator = context.createOscillator(); const toneGain = context.createGain();
    oscillator.type = "sine"; oscillator.frequency.value = scene === "cafe" ? 92 : 220; toneGain.gain.value = .012;
    oscillator.connect(toneGain); toneGain.connect(context.destination); oscillator.start(); nodes.push(toneGain); sources.push(oscillator);
  }
  return { context, nodes, sources } satisfies AudioSession;
}

export function WorkSceneExperience({ locale }: { locale: Locale }) {
  const scenes = useMemo(() => [
    { id: "rain" as const, icon: "☂", vi: "Mưa bên cửa sổ", en: "Rain at the window" },
    { id: "cafe" as const, icon: "◡", vi: "Quán nhỏ", en: "Small café" },
    { id: "forest" as const, icon: "♧", vi: "Rừng đêm", en: "Night forest" },
  ], []);
  const [scene, setScene] = useState<"rain" | "cafe" | "forest">("rain");
  const [playing, setPlaying] = useState(false);
  const audio = useRef<AudioSession | null>(null);
  const stop = () => {
    for (const source of audio.current?.sources ?? []) try { source.stop(); } catch { /* already stopped */ }
    if (audio.current) void audio.current.context.close(); audio.current = null; setPlaying(false);
  };
  useEffect(() => stop, []);
  const toggle = () => {
    if (playing) stop();
    else { audio.current = startSceneAudio(scene); setPlaying(true); }
  };
  const choose = (next: typeof scene) => { stop(); setScene(next); };
  return <div className={`${styles.scene} ${styles[`scene_${scene}`]}`}>
    <div className={styles.sceneWindow}><span className={styles.sceneMoon} /><i className={styles.sceneDesk} /></div>
    <div className={styles.sceneControls}>
      <div className={styles.sceneChoices}>{scenes.map((item) => <button key={item.id} className={scene === item.id ? styles.sceneActive : ""} onClick={() => choose(item.id)}><span>{item.icon}</span>{item[locale]}</button>)}</div>
      <button className={styles.primary} onClick={toggle}>{playing ? <VolumeX /> : <Volume2 />}{playing ? (locale === "vi" ? "Tắt âm" : "Mute") : (locale === "vi" ? "Bật không gian âm thanh" : "Play soundscape")}</button>
      <p className={styles.note}>{locale === "vi" ? "Âm thanh được tổng hợp ngay trên thiết bị, không tải file bên ngoài." : "Sound is generated on this device; no external audio file is loaded."}</p>
    </div>
  </div>;
}

const quotes = {
  vi: [
    ["Đời giống như đi xe đạp. Muốn giữ thăng bằng, bạn phải tiếp tục di chuyển.", "Albert Einstein"],
    ["Tôi không thất bại. Tôi chỉ tìm ra 10.000 cách không hoạt động.", "Thomas Edison"],
    ["Một ngày không có tiếng cười là một ngày lãng phí.", "Charlie Chaplin"],
    ["Hãy là chính mình; những vị trí khác đã có người rồi.", "Oscar Wilde"],
    ["Kinh nghiệm là cái tên mọi người đặt cho sai lầm của mình.", "Oscar Wilde"],
    ["Bí quyết để tiến lên là bắt đầu.", "Mark Twain"],
  ],
  en: [
    ["Life is like riding a bicycle. To keep your balance, you must keep moving.", "Albert Einstein"],
    ["I have not failed. I've just found 10,000 ways that won't work.", "Thomas Edison"],
    ["A day without laughter is a day wasted.", "Charlie Chaplin"],
    ["Be yourself; everyone else is already taken.", "Oscar Wilde"],
    ["Experience is simply the name we give our mistakes.", "Oscar Wilde"],
    ["The secret of getting ahead is getting started.", "Mark Twain"],
  ],
};

export function QuoteExperience({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const item = quotes[locale][index];
  return <div className={styles.quoteApp}><span className={styles.quoteMark}>“</span><blockquote>{item[0]}</blockquote><cite>— {item[1]}</cite><button className={styles.secondary} onClick={() => setIndex((value) => (value + 1) % quotes[locale].length)}><RefreshCcw />{locale === "vi" ? "Câu khác" : "Another one"}</button></div>;
}

const stories = {
  vi: [
    ["Chiếc cốc ở bậu cửa", "Mỗi sáng, bà cụ đặt một chiếc cốc rỗng lên bậu cửa. Người hàng xóm tưởng bà đãng trí. Đến một hôm mưa lớn, anh nhìn thấy một con chim nhỏ trú trong cốc, bình thản như đang ở nhà. Bà cụ chỉ nói: “Không phải thứ gì trống cũng đang thiếu.”"],
    ["Đèn tầng ba", "Cả con phố mất điện, riêng cửa sổ tầng ba vẫn sáng. Không phải máy phát; một đứa trẻ đã đặt mười con đom đóm vào lọ. Ánh sáng quá yếu để soi đường, nhưng đủ để mọi người ngẩng lên và cười."],
    ["Chuyến xe chậm", "Người lái xe buýt đợi thêm mười giây cho một ông lão đang chạy. Mười giây làm cả xe đến muộn, nhưng lại khiến một ngày của ai đó đến đúng lúc."],
  ],
  en: [
    ["The cup on the sill", "Every morning, an old woman placed an empty cup on her windowsill. Her neighbour thought she was forgetful. During a storm he saw a tiny bird sheltering inside it, calm as if it were home. She said, “Not everything empty is missing something.”"],
    ["The third-floor light", "The whole street lost power, but one third-floor window still glowed. It was not a generator; a child had placed ten fireflies in a jar. Too dim to light the road, but bright enough to make everyone look up and smile."],
    ["The slow bus", "A bus driver waited ten extra seconds for an old man who was running. Ten seconds made the whole bus late, but allowed one person's day to arrive on time."],
  ],
};

export function StoryExperience({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0); const item = stories[locale][index];
  return <article className={styles.story}><p className={styles.label}>{locale === "vi" ? "TRUYỆN THẬT NGẮN" : "A TINY STORY"}</p><h3>{item[0]}</h3><p>{item[1]}</p><button className={styles.secondary} onClick={() => setIndex((value) => (value + 1) % stories[locale].length)}><RefreshCcw />{locale === "vi" ? "Đọc truyện khác" : "Read another"}</button></article>;
}

