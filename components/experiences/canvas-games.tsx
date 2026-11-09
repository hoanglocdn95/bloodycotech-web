"use client";

import { RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/personalization";
import styles from "./mini-games.module.css";

function fitCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
  const width = Math.round(rect.width * dpr); const height = Math.round(rect.height * dpr);
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const context = canvas.getContext("2d")!; context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { context, width: rect.width, height: rect.height };
}

type MinerItem = { x: number; y: number; radius: number; value: number; kind: "gold" | "rock"; caught: boolean };
type MinerModel = { angle: number; direction: number; length: number; mode: "swing" | "extend" | "retract"; caught: MinerItem | null; items: MinerItem[] };

function minerItems(): MinerItem[] {
  return Array.from({ length: 13 }, (_, index) => ({
    x: 55 + Math.random() * 490,
    y: 170 + Math.random() * 220,
    radius: index < 8 ? 12 + Math.random() * 12 : 15 + Math.random() * 14,
    value: index < 8 ? 40 + Math.round(Math.random() * 90) : 12,
    kind: index < 8 ? "gold" : "rock",
    caught: false,
  }));
}

export function GoldMinerExperience({ locale }: { locale: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null); const frame = useRef(0);
  const model = useRef<MinerModel>({ angle: 0, direction: 1, length: 48, mode: "swing", caught: null, items: minerItems() });
  const [score, setScore] = useState(0); const [time, setTime] = useState(60); const [running, setRunning] = useState(true);
  const reset = useCallback(() => { model.current = { angle: 0, direction: 1, length: 48, mode: "swing", caught: null, items: minerItems() }; setScore(0); setTime(60); setRunning(true); }, []);
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setTime((value) => { if (value <= 1) { setRunning(false); return 0; } return value - 1; }), 1000); return () => window.clearInterval(timer); }, [running]);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const loop = () => {
      const { context, width, height } = fitCanvas(canvas); const scaleX = width / 600; const scaleY = height / 430;
      context.clearRect(0, 0, width, height); context.fillStyle = "#e9f2f4"; context.fillRect(0, 0, width, 110 * scaleY); context.fillStyle = "#9c6f43"; context.fillRect(0, 110 * scaleY, width, height);
      context.fillStyle = "#56402f"; context.fillRect(0, 108 * scaleY, width, 8);
      const m = model.current; if (running) {
        if (m.mode === "swing") { m.angle += .018 * m.direction; if (Math.abs(m.angle) > 1.05) m.direction *= -1; }
        else if (m.mode === "extend") { m.length += 5; if (m.length > 390) m.mode = "retract"; }
        else { m.length -= m.caught?.kind === "rock" ? 1.8 : 4.2; if (m.length <= 48) { m.length = 48; if (m.caught) { m.caught.caught = true; setScore((value) => value + m.caught!.value); m.caught = null; } m.mode = "swing"; } }
      }
      const originX = width / 2; const originY = 78 * scaleY; const hookX = originX + Math.sin(m.angle) * m.length * scaleX; const hookY = originY + Math.cos(m.angle) * m.length * scaleY;
      if (m.mode === "extend" && !m.caught) for (const item of m.items) if (!item.caught && Math.hypot(hookX / scaleX - item.x, hookY / scaleY - item.y) < item.radius + 8) { m.caught = item; m.mode = "retract"; break; }
      context.strokeStyle = "#3f3c38"; context.lineWidth = 2; context.beginPath(); context.moveTo(originX, originY); context.lineTo(hookX, hookY); context.stroke();
      context.fillStyle = "#48615e"; context.beginPath(); context.arc(originX, originY, 22, 0, Math.PI * 2); context.fill();
      for (const item of m.items) if (!item.caught || m.caught === item) { const x = m.caught === item ? hookX : item.x * scaleX; const y = m.caught === item ? hookY : item.y * scaleY; context.fillStyle = item.kind === "gold" ? "#f0bd3f" : "#77736d"; context.beginPath(); context.arc(x, y, item.radius * Math.min(scaleX, scaleY), 0, Math.PI * 2); context.fill(); context.strokeStyle = item.kind === "gold" ? "#9b6d16" : "#4c4945"; context.stroke(); }
      context.strokeStyle = "#3f3c38"; context.beginPath(); context.arc(hookX, hookY + 5, 9, -.2, Math.PI + .2); context.stroke();
      frame.current = requestAnimationFrame(loop);
    }; loop(); return () => cancelAnimationFrame(frame.current);
  }, [running]);
  const fire = () => { if (running && model.current.mode === "swing") model.current.mode = "extend"; };
  return <div className={styles.canvasGame}><header className={styles.gameHeader}><div><span>{locale === "vi" ? "VÀNG" : "GOLD"}</span><strong>{score}</strong></div><div><span>{locale === "vi" ? "THỜI GIAN" : "TIME"}</span><strong>{time}s</strong></div><button onClick={reset}><RefreshCcw />{locale === "vi" ? "Chơi lại" : "Restart"}</button></header><canvas ref={canvasRef} onPointerDown={fire} aria-label={locale === "vi" ? "Game đào vàng, chạm để thả móc" : "Gold miner game, tap to drop the hook"} /><p>{running ? (locale === "vi" ? "Chạm hoặc nhấn vào sân chơi để thả móc." : "Tap or click the playfield to drop the hook.") : (locale === "vi" ? `Hết giờ — bạn được ${score} điểm.` : `Time — you scored ${score}.`)}</p></div>;
}

type DinoModel = { y: number; velocity: number; obstacles: Array<{ x: number; width: number; height: number }>; score: number; speed: number; alive: boolean };

export function DinoRunExperience({ locale }: { locale: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null); const frame = useRef(0); const last = useRef(0);
  const model = useRef<DinoModel>({ y: 0, velocity: 0, obstacles: [], score: 0, speed: 5, alive: true });
  const displayedScore = useRef(0);
  const [score, setScore] = useState(0); const [alive, setAlive] = useState(true);
  const reset = useCallback(() => { model.current = { y: 0, velocity: 0, obstacles: [], score: 0, speed: 5, alive: true }; displayedScore.current = 0; last.current = 0; setScore(0); setAlive(true); }, []);
  const jump = () => { if (!model.current.alive) { reset(); return; } if (model.current.y === 0) model.current.velocity = 12; };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.code === "Space" || event.code === "ArrowUp") { event.preventDefault(); jump(); } }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const loop = (time: number) => {
      const { context, width, height } = fitCanvas(canvas); const ground = height - 58; const m = model.current;
      if (m.alive) {
        m.velocity -= .58; m.y = Math.max(0, m.y + m.velocity); if (m.y === 0) m.velocity = 0;
        if (!m.obstacles.length || m.obstacles.at(-1)!.x < width - 220 - Math.random() * 130) m.obstacles.push({ x: width + 20, width: 18 + Math.random() * 15, height: 28 + Math.random() * 34 });
        for (const obstacle of m.obstacles) obstacle.x -= m.speed; m.obstacles = m.obstacles.filter((item) => item.x > -50);
        const dino = { x: 62, y: ground - 42 - m.y, width: 36, height: 42 };
        if (m.obstacles.some((item) => dino.x < item.x + item.width && dino.x + dino.width > item.x && dino.y + dino.height > ground - item.height)) { m.alive = false; setAlive(false); }
        m.score += .08; m.speed = Math.min(11, 5 + m.score / 280); const nextScore = Math.floor(m.score); if (nextScore !== displayedScore.current) { displayedScore.current = nextScore; setScore(nextScore); }
      }
      context.clearRect(0, 0, width, height); context.fillStyle = "#faf7f0"; context.fillRect(0, 0, width, height); context.strokeStyle = "#74716d"; context.beginPath(); context.moveTo(0, ground); context.lineTo(width, ground); context.stroke();
      context.fillStyle = "#4b514f"; context.fillRect(62, ground - 42 - m.y, 31, 42); context.fillRect(87, ground - 35 - m.y, 16, 17); context.fillStyle = "#faf7f0"; context.fillRect(96, ground - 31 - m.y, 3, 3); context.fillStyle = "#4b514f"; context.fillRect(66, ground - m.y, 6, 8); context.fillRect(84, ground - m.y, 6, 8);
      for (const item of m.obstacles) { context.fillStyle = "#648461"; context.fillRect(item.x, ground - item.height, item.width, item.height); context.fillRect(item.x - 7, ground - item.height + 12, 7, 8); }
      if (!m.alive) { context.fillStyle = "rgba(250,247,240,.88)"; context.fillRect(0, 0, width, height); context.fillStyle = "#303432"; context.textAlign = "center"; context.font = "700 24px sans-serif"; context.fillText(locale === "vi" ? "Chạm để chạy lại" : "Tap to run again", width / 2, height / 2); }
      last.current = time; frame.current = requestAnimationFrame(loop);
    }; frame.current = requestAnimationFrame(loop); return () => cancelAnimationFrame(frame.current);
  }, [locale, reset]);
  return <div className={styles.canvasGame}><header className={styles.gameHeader}><div><span>{locale === "vi" ? "ĐIỂM" : "SCORE"}</span><strong>{score}</strong></div><button onClick={reset}><RefreshCcw />{locale === "vi" ? "Chạy lại" : "Restart"}</button></header><canvas ref={canvasRef} onPointerDown={jump} aria-label={locale === "vi" ? "Game khủng long chạy" : "Dinosaur running game"} /><p>{alive ? (locale === "vi" ? "Chạm, Space hoặc ↑ để nhảy." : "Tap, Space, or ↑ to jump.") : (locale === "vi" ? "Va phải xương rồng rồi." : "You hit a cactus.")}</p></div>;
}

type Ball = { x: number; y: number; vx: number; vy: number; color: string };

export function PachinkoExperience({ locale }: { locale: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null); const frame = useRef(0); const balls = useRef<Ball[]>([]); const [score, setScore] = useState(0);
  const reset = () => { balls.current = []; setScore(0); };
  const drop = (event: React.PointerEvent<HTMLCanvasElement>) => { const rect = event.currentTarget.getBoundingClientRect(); balls.current.push({ x: event.clientX - rect.left, y: 20, vx: (Math.random() - .5) * 1.2, vy: 0, color: ["#df6b57", "#7768e8", "#287f6b", "#e4a23f"][Math.floor(Math.random() * 4)] }); };
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const loop = () => {
      const { context, width, height } = fitCanvas(canvas); context.clearRect(0, 0, width, height); context.fillStyle = "#f4efe7"; context.fillRect(0, 0, width, height);
      const pins: Array<[number, number]> = []; for (let row = 0; row < 8; row += 1) for (let col = 0; col < 9; col += 1) pins.push([45 + col * ((width - 90) / 8) + (row % 2 ? 18 : 0), 75 + row * 42]);
      context.fillStyle = "#8c8174"; for (const [x, y] of pins) { context.beginPath(); context.arc(x, y, 4, 0, Math.PI * 2); context.fill(); }
      for (let slot = 0; slot < 6; slot += 1) { const x = slot * width / 6; context.strokeStyle = "#c7bcae"; context.beginPath(); context.moveTo(x, height - 70); context.lineTo(x, height); context.stroke(); context.fillStyle = "#766e65"; context.textAlign = "center"; context.font = "12px sans-serif"; context.fillText(String([10, 25, 50, 50, 25, 10][slot]), x + width / 12, height - 16); }
      const active: Ball[] = [];
      for (const ball of balls.current) {
        ball.vy += .18; ball.x += ball.vx; ball.y += ball.vy;
        if (ball.x < 7 || ball.x > width - 7) ball.vx *= -1;
        for (const [px, py] of pins) { const dx = ball.x - px; const dy = ball.y - py; const distance = Math.hypot(dx, dy); if (distance < 10 && distance > 0) { const nx = dx / distance; const ny = dy / distance; const dot = ball.vx * nx + ball.vy * ny; ball.vx -= 1.65 * dot * nx; ball.vy -= 1.65 * dot * ny; ball.x = px + nx * 10; ball.y = py + ny * 10; } }
        if (ball.y > height - 10) { const slot = Math.min(5, Math.max(0, Math.floor(ball.x / (width / 6)))); setScore((value) => value + [10, 25, 50, 50, 25, 10][slot]); }
        else active.push(ball);
        context.fillStyle = ball.color; context.beginPath(); context.arc(ball.x, ball.y, 7, 0, Math.PI * 2); context.fill();
      }
      balls.current = active; frame.current = requestAnimationFrame(loop);
    }; loop(); return () => cancelAnimationFrame(frame.current);
  }, []);
  return <div className={styles.canvasGame}><header className={styles.gameHeader}><div><span>{locale === "vi" ? "ĐIỂM" : "SCORE"}</span><strong>{score}</strong></div><button onClick={reset}><RefreshCcw />{locale === "vi" ? "Xóa bàn" : "Clear"}</button></header><canvas ref={canvasRef} onPointerDown={drop} aria-label={locale === "vi" ? "Máy Pachinko, chạm để thả bi" : "Pachinko machine, tap to drop a ball"} /><p>{locale === "vi" ? "Chạm vị trí bất kỳ ở phía trên để thả bi." : "Tap anywhere near the top to drop a ball."}</p></div>;
}

