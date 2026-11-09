import { chooseRandom, difficultyDepth, inside, minimax, other, orderedBy, type Difficulty, type Outcome, type Side } from "./common";

export type JunglePiece = { side: Side; rank: number };
export type JungleMove = { from: [number, number]; to: [number, number] };
export type JungleState = { board: Array<Array<JunglePiece | null>>; turn: Side; outcome: Outcome };

export const animalNames = ["", "Chuột", "Mèo", "Chó", "Sói", "Báo", "Hổ", "Sư tử", "Voi"];
export const animalGlyphs = ["", "🐭", "🐱", "🐶", "🐺", "🐆", "🐯", "🦁", "🐘"];
const water = new Set(["3,1", "3,2", "4,1", "4,2", "5,1", "5,2", "3,4", "3,5", "4,4", "4,5", "5,4", "5,5"]);
const redTraps = new Set(["7,3", "8,2", "8,4"]); const blueTraps = new Set(["0,2", "0,4", "1,3"]);
const redDen = "8,3"; const blueDen = "0,3";

export function jungleTerrain(row: number, column: number) {
  const key = `${row},${column}`;
  if (water.has(key)) return "water";
  if (key === redDen || key === blueDen) return "den";
  if (redTraps.has(key) || blueTraps.has(key)) return "trap";
  return "land";
}

export function createJungleState(): JungleState {
  const board = Array.from({ length: 9 }, () => Array<JunglePiece | null>(7).fill(null));
  const place = (row: number, column: number, side: Side, rank: number) => { board[row][column] = { side, rank }; };
  place(0, 0, -1, 7); place(0, 6, -1, 6); place(1, 1, -1, 5); place(1, 5, -1, 2); place(2, 0, -1, 1); place(2, 2, -1, 4); place(2, 4, -1, 3); place(2, 6, -1, 8);
  place(8, 6, 1, 7); place(8, 0, 1, 6); place(7, 5, 1, 5); place(7, 1, 1, 2); place(6, 6, 1, 1); place(6, 4, 1, 4); place(6, 2, 1, 3); place(6, 0, 1, 8);
  return { board, turn: 1, outcome: null };
}

function inEnemyTrap(row: number, column: number, side: Side) { const key = `${row},${column}`; return side === 1 ? blueTraps.has(key) : redTraps.has(key); }

function canCapture(attacker: JunglePiece, defender: JunglePiece, from: [number, number], to: [number, number]) {
  if (inEnemyTrap(to[0], to[1], defender.side)) return true;
  const fromWater = water.has(from.join(",")); const toWater = water.has(to.join(","));
  if (fromWater !== toWater) return false;
  if (attacker.rank === 1 && defender.rank === 8) return true;
  if (attacker.rank === 8 && defender.rank === 1) return false;
  return attacker.rank >= defender.rank;
}

export function jungleLegalMoves(state: JungleState): JungleMove[] {
  if (state.outcome !== null) return [];
  const result: JungleMove[] = [];
  for (let row = 0; row < 9; row += 1) for (let column = 0; column < 7; column += 1) {
    const piece = state.board[row][column]; if (!piece || piece.side !== state.turn) continue;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      let r = row + dr; let c = column + dc; if (!inside(r, c, 9, 7)) continue;
      if ((piece.rank === 6 || piece.rank === 7) && water.has(`${r},${c}`)) {
        let blocked = false;
        while (inside(r, c, 9, 7) && water.has(`${r},${c}`)) { if (state.board[r][c]?.rank === 1) blocked = true; r += dr; c += dc; }
        if (blocked || !inside(r, c, 9, 7)) continue;
      } else if (water.has(`${r},${c}`) && piece.rank !== 1) continue;
      const destination = `${r},${c}`; if ((piece.side === 1 && destination === redDen) || (piece.side === -1 && destination === blueDen)) continue;
      const target = state.board[r][c]; if (!target || target.side !== piece.side && canCapture(piece, target, [row, column], [r, c])) result.push({ from: [row, column], to: [r, c] });
    }
  }
  return result;
}

export function jungleOutcome(state: JungleState): Outcome {
  if (state.board[0][3]?.side === 1) return 1; if (state.board[8][3]?.side === -1) return -1;
  const pieces = state.board.flat().filter(Boolean) as JunglePiece[]; if (!pieces.some((piece) => piece.side === 1)) return -1; if (!pieces.some((piece) => piece.side === -1)) return 1;
  return jungleLegalMoves({ ...state, outcome: null }).length ? null : other(state.turn);
}

export function jungleApply(state: JungleState, move: JungleMove): JungleState { const board = state.board.map((row) => row.map((piece) => piece ? { ...piece } : null)); const piece = board[move.from[0]][move.from[1]]; board[move.from[0]][move.from[1]] = null; board[move.to[0]][move.to[1]] = piece; const next: JungleState = { board, turn: other(state.turn), outcome: null }; next.outcome = jungleOutcome(next); return next; }

export function jungleEvaluate(state: JungleState, root: Side) {
  let score = 0;
  for (let row = 0; row < 9; row += 1) for (let column = 0; column < 7; column += 1) { const piece = state.board[row][column]; if (!piece) continue; const targetRow = piece.side === 1 ? 0 : 8; const distance = Math.abs(targetRow - row) + Math.abs(3 - column); const value = piece.rank * 105 + (14 - distance) * 9; score += piece.side === root ? value : -value; }
  return score;
}

function moveScore(state: JungleState, move: JungleMove) { const target = state.board[move.to[0]][move.to[1]]; const den = state.turn === 1 ? blueDen : redDen; return (target ? target.rank * 200 : 0) + (move.to.join(",") === den ? 20_000 : 0); }

export function chooseJungleMove(state: JungleState, difficulty: Difficulty) {
  const moves = jungleLegalMoves(state); if (!moves.length) return undefined; if (difficulty === "easy") return chooseRandom(moves);
  const depth = difficultyDepth[difficulty]; const candidates = orderedBy(moves, (move) => moveScore(state, move), difficulty === "very-hard" ? 20 : 14); let best = -Infinity; let choices: JungleMove[] = [];
  for (const move of candidates) { const next = jungleApply(state, move); const score = depth === 1 ? jungleEvaluate(next, state.turn) : minimax({ state: next, root: state.turn, depth: depth - 1, turn: (item) => item.turn, moves: jungleLegalMoves, apply: jungleApply, evaluate: jungleEvaluate, terminal: jungleOutcome, order: (item, options) => orderedBy(options, (candidate) => moveScore(item, candidate), difficulty === "very-hard" ? 16 : 11) }); if (score > best) { best = score; choices = [move]; } else if (score === best) choices.push(move); }
  return chooseRandom(choices) ?? choices[0];
}
