"use client";

import { Eraser, Redo2, RotateCcw, Undo2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DrawingPoint, DrawingStroke, Locale } from "@/lib/personalization";
import styles from "./drawing-studio.module.css";

const colors = ["#20242d", "#7768e8", "#287f6b", "#df6b57", "#e4a23f", "#3478bf", "#d76696", "#7f9f48"];
const widths = [3, 7, 14];

const copy = {
  vi: {
    guide: "Kéo hoặc chạm để vẽ.",
    tools: "Màu và nét",
    done: "Xong rồi!",
    empty: "Trang giấy đang chờ nét đầu tiên của bạn.",
    undo: "Hoàn tác",
    redo: "Làm lại",
    erase: "Tẩy",
    pen: "Bút",
    clear: "Xóa hết",
    clearConfirm: "Xóa toàn bộ bức vẽ này?",
    canvas: "Vùng vẽ cá nhân",
  },
  en: {
    guide: "Drag or touch to draw.",
    tools: "Colour and stroke",
    done: "I'm done!",
    empty: "The page is waiting for your first mark.",
    undo: "Undo",
    redo: "Redo",
    erase: "Eraser",
    pen: "Pen",
    clear: "Clear",
    clearConfirm: "Clear this entire drawing?",
    canvas: "Personal drawing area",
  },
} as const;

export function DrawingStudio({
  locale,
  ready,
  onComplete,
}: {
  locale: Locale;
  ready: boolean;
  onComplete: (strokes: DrawingStroke[]) => void;
}) {
  const t = copy[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = useRef<DrawingStroke | null>(null);
  const strokesRef = useRef<DrawingStroke[]>([]);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [redo, setRedo] = useState<DrawingStroke[]>([]);
  const [color, setColor] = useState(colors[0]);
  const [width, setWidth] = useState(widths[1]);
  const [erasing, setErasing] = useState(false);
  const [customColor, setCustomColor] = useState("#5f7dd8");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [guide, setGuide] = useState<"off" | "hover" | "idle">("off");
  const acted = useRef(false);

  const markActed = () => {
    if (acted.current) return;
    acted.current = true;
    setGuide("off");
  };

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => {
      if (!acted.current) setGuide("idle");
    }, 5000);
    return () => window.clearTimeout(id);
  }, [ready]);

  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

  const render = useCallback((items: DrawingStroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
    const pixelHeight = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);
    context.lineCap = "round";
    context.lineJoin = "round";
    for (const stroke of items) {
      if (!stroke.points.length) continue;
      context.save();
      context.globalCompositeOperation = stroke.erase ? "destination-out" : "source-over";
      context.strokeStyle = stroke.color;
      context.lineWidth = stroke.erase ? stroke.width * 2.4 : stroke.width;
      context.beginPath();
      context.moveTo(stroke.points[0].x * rect.width, stroke.points[0].y * rect.height);
      for (const point of stroke.points.slice(1)) context.lineTo(point.x * rect.width, point.y * rect.height);
      if (stroke.points.length === 1) context.lineTo(stroke.points[0].x * rect.width + 0.01, stroke.points[0].y * rect.height + 0.01);
      context.stroke();
      context.restore();
    }
  }, []);

  useEffect(() => render(strokes), [render, strokes]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => render(strokesRef.current));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [render]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>): DrawingPoint => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
      time: performance.now(),
    };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    active.current = { color, width, erase: erasing, points: [point(event)] };
    setRedo([]);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active.current) return;
    event.preventDefault();
    active.current.points.push(point(event));
    render([...strokesRef.current, active.current]);
  };

  const finish = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active.current) return;
    event.preventDefault();
    const stroke = active.current;
    active.current = null;
    setStrokes((current) => [...current, stroke]);
  };

  const undo = () => {
    setStrokes((current) => {
      const last = current.at(-1);
      if (last) setRedo((items) => [...items, last]);
      return current.slice(0, -1);
    });
  };

  const redoStroke = () => {
    setRedo((current) => {
      const last = current.at(-1);
      if (last) setStrokes((items) => [...items, last]);
      return current.slice(0, -1);
    });
  };

  const visibleStrokes = strokes.filter((stroke) => !stroke.erase);

  const showHover = (event: React.PointerEvent) => {
    if (!ready || event.pointerType !== "mouse" || acted.current) return;
    setGuide((current) => (current === "idle" ? "idle" : "hover"));
  };

  const hideHover = () => {
    setGuide((current) => (current === "hover" ? "off" : current));
  };

  return (
    <section className={styles.studio} onPointerDownCapture={markActed}>
      <h1 className={styles.srOnly}>{t.canvas}</h1>
      <div
        className={styles.paper}
        onPointerEnter={showHover}
        onPointerLeave={hideHover}
        data-guide={guide}
      >
        <div className={styles.canvasWrap}>
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            aria-label={t.canvas}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={finish}
            onPointerCancel={finish}
          />
          {!strokes.length && guide === "off" ? <p className={styles.empty}>{t.empty}</p> : null}
          {guide !== "off" ? <p className={styles.guide} role="status">{t.guide}</p> : null}
        </div>
      </div>

      <button
        type="button"
        className={styles.toolToggle}
        aria-expanded={toolsOpen}
        aria-label={t.tools}
        onClick={() => setToolsOpen((open) => !open)}
      >
        <span style={{ background: erasing ? "transparent" : color }} />
      </button>
      {toolsOpen ? (
        <div className={styles.toolPanel}>
          <div className={styles.colors} aria-label={locale === "vi" ? "Màu bút" : "Pen colours"}>
            {colors.map((item) => (
              <button
                key={item}
                type="button"
                className={color === item && !erasing ? styles.activeTool : ""}
                aria-label={item}
                aria-pressed={color === item && !erasing}
                onClick={() => { setColor(item); setErasing(false); }}
              >
                <span style={{ background: item }} />
              </button>
            ))}
            <label className={styles.customColor} title={locale === "vi" ? "Màu tùy chọn" : "Custom colour"}>
              <input
                type="color"
                value={customColor}
                onChange={(event) => { setCustomColor(event.target.value); setColor(event.target.value); setErasing(false); }}
              />
              <span style={{ background: `conic-gradient(from 90deg, #df6b57, #e4a23f, #7f9f48, #3478bf, #7768e8, #df6b57)` }} />
            </label>
          </div>
          <div className={styles.tools}>
            {widths.map((item) => (
              <button
                key={item}
                type="button"
                className={width === item && !erasing ? styles.activeTool : ""}
                aria-label={`${t.pen} ${item}`}
                onClick={() => { setWidth(item); setErasing(false); }}
              >
                <i style={{ width: Math.max(4, item), height: Math.max(4, item) }} />
              </button>
            ))}
            <button type="button" className={erasing ? styles.activeTool : ""} aria-label={t.erase} onClick={() => setErasing((value) => !value)}><Eraser /></button>
            <button type="button" aria-label={t.undo} disabled={!strokes.length} onClick={undo}><Undo2 /></button>
            <button type="button" aria-label={t.redo} disabled={!redo.length} onClick={redoStroke}><Redo2 /></button>
            <button
              type="button"
              aria-label={t.clear}
              disabled={!strokes.length}
              onClick={() => {
                if (window.confirm(t.clearConfirm)) { setStrokes([]); setRedo([]); }
              }}
            ><RotateCcw /></button>
          </div>
        </div>
      ) : null}
      <button type="button" className={styles.done} disabled={!visibleStrokes.length} onClick={() => onComplete(strokes)}>{t.done}</button>
    </section>
  );
}

