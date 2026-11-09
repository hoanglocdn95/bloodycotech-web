import { chooseRandom, difficultyDepth, inside, minimax, other, orderedBy, type Difficulty, type Outcome, type Side } from "./common";

export type XiangqiPiece = "R" | "H" | "E" | "A" | "K" | "C" | "P" | "r" | "h" | "e" | "a" | "k" | "c" | "p";
export type XiangqiMove = { from: [number, number]; to: [number, number] };
export type XiangqiState = { board: Array<Array<XiangqiPiece | null>>; turn: Side; outcome: Outcome };

const values: Record<string, number> = { k: 20_000, r: 900, c: 450, h: 420, e: 220, a: 220, p: 120 };
export const xiangqiLabel: Record<XiangqiPiece, string> = { R: "俥", H: "傌", E: "相", A: "仕", K: "帥", C: "炮", P: "兵", r: "車", h: "馬", e: "象", a: "士", k: "將", c: "砲", p: "卒" };

export function createXiangqiState(): XiangqiState {
  const empty = () => Array<XiangqiPiece | null>(9).fill(null);
  const board = Array.from({ length: 10 }, empty);
  board[0] = ["r", "h", "e", "a", "k", "a", "e", "h", "r"];
  board[2][1] = "c"; board[2][7] = "c";
  for (const column of [0, 2, 4, 6, 8]) board[3][column] = "p";
  for (const column of [0, 2, 4, 6, 8]) board[6][column] = "P";
  board[7][1] = "C"; board[7][7] = "C";
  board[9] = ["R", "H", "E", "A", "K", "A", "E", "H", "R"];
  return { board, turn: 1, outcome: null };
}

export function xiangqiSide(piece: XiangqiPiece): Side { return piece === piece.toUpperCase() ? 1 : -1; }
function palace(row: number, column: number, side: Side) { return column >= 3 && column <= 5 && (side === 1 ? row >= 7 && row <= 9 : row >= 0 && row <= 2); }

function pseudo(state: XiangqiState, from: [number, number]): XiangqiMove[] {
  const [row, column] = from; const piece = state.board[row][column]; if (!piece) return [];
  const side = xiangqiSide(piece); const kind = piece.toLowerCase(); const result: XiangqiMove[] = [];
  const add = (r: number, c: number) => { if (!inside(r, c, 10, 9)) return; const target = state.board[r][c]; if (!target || xiangqiSide(target) !== side) result.push({ from, to: [r, c] }); };
  if (kind === "r" || kind === "c") {
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      let screened = false;
      for (let step = 1; step < 10; step += 1) {
        const r = row + dr * step; const c = column + dc * step; if (!inside(r, c, 10, 9)) break; const target = state.board[r][c];
        if (kind === "r") { if (!target) result.push({ from, to: [r, c] }); else { if (xiangqiSide(target) !== side) result.push({ from, to: [r, c] }); break; } }
        else if (!screened) { if (!target) result.push({ from, to: [r, c] }); else screened = true; }
        else if (target) { if (xiangqiSide(target) !== side) result.push({ from, to: [r, c] }); break; }
      }
    }
  } else if (kind === "h") {
    for (const [dr, dc, lr, lc] of [[-2, -1, -1, 0], [-2, 1, -1, 0], [2, -1, 1, 0], [2, 1, 1, 0], [-1, -2, 0, -1], [1, -2, 0, -1], [-1, 2, 0, 1], [1, 2, 0, 1]]) if (!state.board[row + lr]?.[column + lc]) add(row + dr, column + dc);
  } else if (kind === "e") {
    for (const [dr, dc] of [[-2, -2], [-2, 2], [2, -2], [2, 2]]) {
      const r = row + dr; const c = column + dc; const ownHalf = side === 1 ? r >= 5 : r <= 4;
      if (ownHalf && !state.board[row + dr / 2]?.[column + dc / 2]) add(r, c);
    }
  } else if (kind === "a") {
    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) if (palace(row + dr, column + dc, side)) add(row + dr, column + dc);
  } else if (kind === "k") {
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) if (palace(row + dr, column + dc, side)) add(row + dr, column + dc);
    for (const direction of [-1, 1]) for (let r = row + direction; inside(r, column, 10, 9); r += direction) { const target = state.board[r][column]; if (target) { if (target.toLowerCase() === "k" && xiangqiSide(target) !== side) add(r, column); break; } }
  } else {
    const forward = side === 1 ? -1 : 1; add(row + forward, column);
    const crossed = side === 1 ? row <= 4 : row >= 5; if (crossed) { add(row, column - 1); add(row, column + 1); }
  }
  return result;
}

function applyRaw(state: XiangqiState, move: XiangqiMove): XiangqiState {
  const board = state.board.map((row) => [...row]); const piece = board[move.from[0]][move.from[1]]; board[move.from[0]][move.from[1]] = null; board[move.to[0]][move.to[1]] = piece;
  return { board, turn: other(state.turn), outcome: null };
}

export function xiangqiInCheck(state: XiangqiState, side: Side) {
  let king: [number, number] | null = null;
  for (let row = 0; row < 10; row += 1) for (let column = 0; column < 9; column += 1) if (state.board[row][column] === (side === 1 ? "K" : "k")) king = [row, column];
  if (!king) return true;
  for (let row = 0; row < 10; row += 1) for (let column = 0; column < 9; column += 1) {
    const piece = state.board[row][column]; if (piece && xiangqiSide(piece) === other(side) && pseudo(state, [row, column]).some((move) => move.to[0] === king![0] && move.to[1] === king![1])) return true;
  }
  return false;
}

export function xiangqiLegalMoves(state: XiangqiState): XiangqiMove[] {
  if (state.outcome !== null) return [];
  const result: XiangqiMove[] = [];
  for (let row = 0; row < 10; row += 1) for (let column = 0; column < 9; column += 1) {
    const piece = state.board[row][column]; if (!piece || xiangqiSide(piece) !== state.turn) continue;
    for (const move of pseudo(state, [row, column])) if (!xiangqiInCheck(applyRaw(state, move), state.turn)) result.push(move);
  }
  return result;
}

export function xiangqiOutcome(state: XiangqiState): Outcome {
  const pieces = state.board.flat(); if (!pieces.includes("K")) return -1; if (!pieces.includes("k")) return 1;
  return xiangqiLegalMoves({ ...state, outcome: null }).length ? null : other(state.turn);
}

export function xiangqiApply(state: XiangqiState, move: XiangqiMove): XiangqiState { const next = applyRaw(state, move); return { ...next, outcome: xiangqiOutcome(next) }; }

export function xiangqiEvaluate(state: XiangqiState, root: Side) {
  let score = 0;
  for (let row = 0; row < 10; row += 1) for (let column = 0; column < 9; column += 1) { const piece = state.board[row][column]; if (!piece) continue; const advance = xiangqiSide(piece) === 1 ? 9 - row : row; const value = values[piece.toLowerCase()] + (piece.toLowerCase() === "p" ? advance * 7 : 0); score += xiangqiSide(piece) === root ? value : -value; }
  if (xiangqiInCheck(state, other(root))) score += 35; if (xiangqiInCheck(state, root)) score -= 35; return score;
}

function captureScore(state: XiangqiState, move: XiangqiMove) { const target = state.board[move.to[0]][move.to[1]]; return target ? values[target.toLowerCase()] : 0; }

export function chooseXiangqiMove(state: XiangqiState, difficulty: Difficulty) {
  const moves = xiangqiLegalMoves(state); if (!moves.length) return undefined; if (difficulty === "easy") return chooseRandom(moves);
  const depth = difficultyDepth[difficulty]; const candidates = orderedBy(moves, (move) => captureScore(state, move), difficulty === "very-hard" ? 22 : 15); let best = -Infinity; let choices: XiangqiMove[] = [];
  for (const move of candidates) { const next = xiangqiApply(state, move); const score = depth === 1 ? xiangqiEvaluate(next, state.turn) : minimax({ state: next, root: state.turn, depth: depth - 1, turn: (item) => item.turn, moves: xiangqiLegalMoves, apply: xiangqiApply, evaluate: xiangqiEvaluate, terminal: xiangqiOutcome, order: (item, options) => orderedBy(options, (candidate) => captureScore(item, candidate), difficulty === "very-hard" ? 16 : 11) }); if (score > best) { best = score; choices = [move]; } else if (score === best) choices.push(move); }
  return chooseRandom(choices) ?? choices[0];
}
