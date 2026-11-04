"use client";

import { atom, useAtom, useAtomValue } from "jotai";

export const scoreAtom = atom(0);
export const highScoreAtom = atom(0);

export const recordAtom = atom((get) => Math.max(get(scoreAtom), get(highScoreAtom)));

export function ScoreButton() {
  const [score, setScore] = useAtom(scoreAtom);
  const record = useAtomValue(recordAtom);

  return (
    <button type="button" onClick={() => setScore((value) => value + 1)}>
      Điểm {score}. Kỷ lục {record}.
    </button>
  );
}
