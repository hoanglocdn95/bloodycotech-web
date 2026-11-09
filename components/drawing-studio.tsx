"use client";

import { Eraser, Redo2, RotateCcw, Undo2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DrawingPoint, DrawingStroke, Locale } from "@/lib/personalization";
import styles from "./drawing-studio.module.css";

const colors = ["#20242d", "#7768e8", "#287f6b", "#df6b57", "#e4a23f", "#3478bf", "#d76696", "#7f9f48"];
const widths = [3, 7, 14];

const copy = {
  vi: {
    invitation: "Hôm nay bạn thế nào?",
    body: "Bạn có thể vẽ cho mình một điều gì đó không? Mình sẽ thử tìm một trải nghiệm có thể phù hợp với bạn. Không cần vẽ đẹp đâu.",
    done: "Xong rồi!",
    skip: "Mình không muốn vẽ",
    library: "Khám phá thư viện",
    empty: "Trang giấy đang chờ nét đầu tiên của bạn.",
    undo: "Hoàn tác",
    redo: "Làm lại",
    erase: "Tẩy",
    pen: "Bút",
    clear: "Xóa hết",
    clearConfirm: "Xóa toàn bộ bức vẽ này?",
    privacy: "Tranh chỉ tồn tại trong bộ nhớ của trang này. Khi hoàn thành, app chỉ giữ các thông số bằng số — không giữ ảnh hoặc nét vẽ.",
    canvas: "Vùng vẽ cá nhân",
  },
  en: {
    invitation: "How are you today?",
    body: "Would you draw something for me? I will try to find an experience that may fit you. It does not have to be beautiful.",
    done: "I'm done!",
    skip: "I don't want to draw",
    library: "Explore the library",
    empty: "The page is waiting for your first mark.",
    undo: "Undo",
    redo: "Redo",
    erase: "Eraser",
    pen: "Pen",
    clear: "Clear",
    clearConfirm: "Clear this entire drawing?",
    privacy: "Your drawing only exists in this page's memory. When you finish, the app keeps numeric signals—not the image or strokes.",
    canvas: "Personal drawing area",
  },
} as const;

export function DrawingStudio({
  locale,
  onComplete,
  onSkip,
  onLibrary,
}: {
  locale: Locale;
  onComplete: (strokes: DrawingStroke[]) => void;
  onSkip: () => void;
  onLibrary: () => void;
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

  return (
    <section className={styles.studio}>
      <div className={styles.invitation}>
        <p className={styles.kicker}>Draw something · Discover something</p>
        <h1>{t.invitation}</h1>
        <p>{t.body}</p>
      </div>

      <div className={styles.paper}>
        <div className={styles.toolbar}>
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
          {!strokes.length ? <p className={styles.empty}>{t.empty}</p> : null}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.done} disabled={!visibleStrokes.length} onClick={() => onComplete(strokes)}>{t.done}</button>
        <button type="button" className={styles.textAction} onClick={onSkip}>{t.skip}</button>
        <button type="button" className={styles.textAction} onClick={onLibrary}>{t.library}</button>
      </div>
      <p className={styles.privacy}>{t.privacy}</p>
    </section>
  );
}

