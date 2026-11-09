"use client";

import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/personalization";
import styles from "./mini-games.module.css";

const SIZE = 9;
const COLORS = ["#e35f5f", "#4d86d8", "#58a66c", "#e8ad3e", "#946fd4", "#44a9a5", "#e27aa9"];
type Cell = number | null;

function emptyBoard() { return Array<Cell>(SIZE * SIZE).fill(null); }
function neighbours(index: number) {
  const row = Math.floor(index / SIZE); const column = index % SIZE; const result: number[] = [];
  if (row > 0) result.push(index - SIZE); if (row < SIZE - 1) result.push(index + SIZE);
  if (column > 0) result.push(index - 1); if (column < SIZE - 1) result.push(index + 1);
  return result;
}
function hasPath(board: Cell[], from: number, to: number) {
  const queue = [from]; const seen = new Set([from]);
  while (queue.length) { const current = queue.shift()!; if (current === to) return true; for (const next of neighbours(current)) if (!seen.has(next) && (board[next] === null || next === to)) { seen.add(next); queue.push(next); } }
  return false;
}
function lineCells(board: Cell[], index: number) {
  const color = board[index]; if (color === null) return new Set<number>();
  const row = Math.floor(index / SIZE); const column = index % SIZE; const cleared = new Set<number>();
  for (const [dr, dc] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
    const line = [index];
    for (const direction of [-1, 1]) for (let step = 1; step < SIZE; step += 1) {
      const r = row + dr * step * direction; const c = column + dc * step * direction;
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board[r * SIZE + c] !== color) break;
      line.push(r * SIZE + c);
    }
    if (line.length >= 5) line.forEach((cell) => cleared.add(cell));
  }
  return cleared;
}
function spawn(board: Cell[], count: number) {
  const result = [...board]; const empty = result.map((value, index) => value === null ? index : -1).filter((index) => index >= 0);
  const placed: number[] = [];
  for (let step = 0; step < count && empty.length; step += 1) {
    const pick = Math.floor(Math.random() * empty.length); const cell = empty.splice(pick, 1)[0];
    result[cell] = Math.floor(Math.random() * COLORS.length); placed.push(cell);
  }
  return { board: result, placed };
}
function startBoard() { return spawn(emptyBoard(), 5).board; }

export function Lines98Experience({ locale }: { locale: Locale }) {
  const [board, setBoard] = useState<Cell[]>(startBoard);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const nextColors = [score % COLORS.length, (score + 2) % COLORS.length, (score + 5) % COLORS.length];
  const reset = () => { setBoard(startBoard()); setSelected(null); setScore(0); setMessage(""); };
  const click = (index: number) => {
    if (board[index] !== null) { setSelected(index); setMessage(""); return; }
    if (selected === null) return;
    if (!hasPath(board, selected, index)) { setMessage(locale === "vi" ? "Không có đường đi tới ô đó." : "There is no path to that cell."); return; }
    const moved = [...board]; moved[index] = moved[selected]; moved[selected] = null; setSelected(null);
    const clear = lineCells(moved, index);
    if (clear.size) {
      clear.forEach((cell) => { moved[cell] = null; }); setScore((value) => value + clear.size * 10); setBoard(moved); return;
    }
    const spawned = spawn(moved, 3); const spawnedClear = new Set<number>();
    for (const cell of spawned.placed) lineCells(spawned.board, cell).forEach((item) => spawnedClear.add(item));
    spawnedClear.forEach((cell) => { spawned.board[cell] = null; });
    if (spawnedClear.size) setScore((value) => value + spawnedClear.size * 10);
    setBoard(spawned.board);
    if (spawned.board.every((cell) => cell !== null)) setMessage(locale === "vi" ? "Bàn đã đầy. Bắt đầu ván mới nhé." : "The board is full. Try a new game.");
  };
  return <div className={styles.linesShell}>
    <header className={styles.gameHeader}><div><span>{locale === "vi" ? "ĐIỂM" : "SCORE"}</span><strong>{score}</strong></div><div className={styles.nextBalls}>{nextColors.map((color, index) => <i key={index} style={{ background: COLORS[color] }} />)}</div><button onClick={reset}><RefreshCcw />{locale === "vi" ? "Ván mới" : "New game"}</button></header>
    <div className={styles.linesBoard} role="grid" aria-label="Lines 98">{board.map((color, index) => <button key={index} role="gridcell" onClick={() => click(index)} className={selected === index ? styles.selectedCell : ""}>{color !== null ? <span style={{ background: COLORS[color] }} /> : null}</button>)}</div>
    <p className={styles.gameMessage}>{message || (locale === "vi" ? "Chọn một viên rồi chọn ô trống có đường đi. Năm viên cùng màu sẽ biến mất." : "Select a ball, then an open reachable cell. Five matching balls disappear.")}</p>
  </div>;
}

