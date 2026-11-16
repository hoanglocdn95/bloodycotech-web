"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/personalization";
import styles from "./arrival-sequence.module.css";

const FADE_IN_MS = 440;
const FADE_OUT_MS = 380;
const SKIP_OUT_MS = 160;
const GAP_MS = 180;
const BLANK_MS = 1000;

const linesByLocale = {
  vi: ["Chào bạn!!!", "Tâm trạng của bạn thế nào", "Hãy thể hiện nó qua nét vẽ nhé"],
  en: ["Hello!!!", "How are you feeling?", "Show it through a drawing"],
} as const;

function holdMs(text: string, locale: Locale) {
  const graphemes = Array.from(text).filter((char) => !/\s/u.test(char)).length;
  const rate = locale === "vi" ? 11 : 14;
  const breath = locale === "vi" ? 720 : 620;
  const min = locale === "vi" ? 1500 : 1350;
  const max = locale === "vi" ? 2800 : 2400;
  return Math.round(Math.min(max, Math.max(min, (graphemes / rate) * 1000 + breath)));
}

type Step = { index: number; leaving: boolean; quick: boolean };

export function ArrivalSequence({ locale, onDone }: { locale: Locale; onDone: () => void }) {
  const lines = linesByLocale[locale];
  const [step, setStep] = useState<Step | null>(null);
  const onDoneRef = useRef(onDone);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const timers: number[] = [];
    let cancelled = false;
    let phase: "blank" | "show" | "leave" | "done" = "blank";
    let index = -1;

    const clearTimers = () => {
      for (const id of timers) window.clearTimeout(id);
      timers.length = 0;
    };
    const later = (ms: number, run: () => void) => {
      timers.push(window.setTimeout(() => { if (!cancelled) run(); }, ms));
    };
    const finish = () => {
      if (cancelled || phase === "done") return;
      phase = "done";
      clearTimers();
      onDoneRef.current();
    };
    const show = (next: number) => {
      phase = "show";
      index = next;
      setStep({ index: next, leaving: false, quick: false });
      later(FADE_IN_MS + holdMs(lines[next], locale), () => {
        if (phase === "show" && index === next) leave(false);
      });
    };
    const leave = (quick: boolean) => {
      phase = "leave";
      const current = index;
      setStep({ index: current, leaving: true, quick });
      later(quick ? SKIP_OUT_MS : FADE_OUT_MS, () => {
        setStep(null);
        if (current < lines.length - 1) later(quick ? 40 : GAP_MS, () => show(current + 1));
        else later(quick ? 40 : 120, finish);
      });
    };

    skipRef.current = () => {
      if (cancelled || phase === "done" || phase === "leave") return;
      clearTimers();
      if (phase === "blank") show(0);
      else leave(true);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      phase = "done";
      onDoneRef.current();
      return () => { cancelled = true; };
    }

    later(BLANK_MS, () => { if (phase === "blank") show(0); });
    return () => {
      cancelled = true;
      clearTimers();
      skipRef.current = () => {};
    };
  }, [lines, locale]);

  return (
    <div
      className={styles.arrival}
      data-arrival={step ? (step.leaving ? "out" : "in") : "blank"}
      data-line={step?.index ?? -1}
      aria-live="polite"
      onPointerDown={() => skipRef.current()}
    >
      <p className={styles.source} aria-hidden="true">{lines.join(" ")}</p>
      {step ? (
        <p
          key={`${step.index}-${step.leaving ? "out" : "in"}`}
          className={step.leaving ? styles.lineOut : styles.lineIn}
          style={{ animationDuration: `${step.leaving ? (step.quick ? SKIP_OUT_MS : FADE_OUT_MS) : FADE_IN_MS}ms` }}
        >
          {lines[step.index]}
        </p>
      ) : null}
    </div>
  );
}
