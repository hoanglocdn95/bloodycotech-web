import { chooseRandom, inside, other, orderedBy, type Difficulty, type Outcome, type Side } from "./common";

export type GoMove = { to: [number, number]; pass?: boolean };
export type GoState = { board: number[][]; turn: Side; captures: Record<"1" | "-1", number>; previousBoard: string | null; passes: number; outcome: Outcome; score: [number, number] | null };
export const GO_SIZE = 9;

export function createGoState(): GoState { return { board: Array.from({ length: GO_SIZE }, () => Array<number>(GO_SIZE).fill(0)), turn: 1, captures: { "1": 0, "-1": 0 }, previousBoard: null, passes: 0, outcome: null, score: null }; }
function serialize(board: number[][]) { return board.map((row) => row.join("")).join("/"); }
function neighbors(row: number, column: number) { return [[row - 1, column], [row + 1, column], [row, column - 1], [row, column + 1]].filter(([r, c]) => inside(r, c, GO_SIZE, GO_SIZE)) as Array<[number, number]>; }

function group(board: number[][], row: number, column: number) {
  const color = board[row][column]; const stones: Array<[number, number]> = []; const liberties = new Set<string>(); const seen = new Set<string>(); const queue: Array<[number, number]> = [[row, column]];
  while (queue.length) { const [r, c] = queue.pop()!; const key = `${r},${c}`; if (seen.has(key)) continue; seen.add(key); stones.push([r, c]); for (const [nr, nc] of neighbors(r, c)) { if (board[nr][nc] === 0) liberties.add(`${nr},${nc}`); else if (board[nr][nc] === color) queue.push([nr, nc]); } }
  return { stones, liberties };
}

function place(state: GoState, row: number, column: number) {
  if (state.board[row][column]) return null;
  const board = state.board.map((line) => [...line]); board[row][column] = state.turn; let captured = 0;
  for (const [nr, nc] of neighbors(row, column)) if (board[nr][nc] === other(state.turn)) { const enemy = group(board, nr, nc); if (!enemy.liberties.size) { captured += enemy.stones.length; for (const [r, c] of enemy.stones) board[r][c] = 0; } }
  if (!group(board, row, column).liberties.size) return null;
  if (serialize(board) === state.previousBoard) return null;
  return { board, captured };
}

export function goLegalMoves(state: GoState): GoMove[] { if (state.outcome !== null) return []; const result: GoMove[] = [{ to: [-1, -1], pass: true }]; for (let row = 0; row < GO_SIZE; row += 1) for (let column = 0; column < GO_SIZE; column += 1) if (place(state, row, column)) result.push({ to: [row, column] }); return result; }

function territory(board: number[][]) {
  const visited = new Set<string>(); let black = 0; let white = 0;
  for (let row = 0; row < GO_SIZE; row += 1) for (let column = 0; column < GO_SIZE; column += 1) {
    if (board[row][column] === 1) { black += 1; continue; } if (board[row][column] === -1) { white += 1; continue; }
    const key = `${row},${column}`; if (visited.has(key)) continue; const region: Array<[number, number]> = []; const borders = new Set<number>(); const queue: Array<[number, number]> = [[row, column]];
    while (queue.length) { const [r, c] = queue.pop()!; const itemKey = `${r},${c}`; if (visited.has(itemKey)) continue; visited.add(itemKey); region.push([r, c]); for (const [nr, nc] of neighbors(r, c)) { if (!board[nr][nc]) queue.push([nr, nc]); else borders.add(board[nr][nc]); } }
    if (borders.size === 1) { if (borders.has(1)) black += region.length; else white += region.length; }
  }
  return [black, white + 5.5] as [number, number];
}

export function goApply(state: GoState, move: GoMove): GoState {
  if (move.pass) { const passes = state.passes + 1; const score = passes >= 2 ? territory(state.board) : null; return { ...state, turn: other(state.turn), passes, score, outcome: score ? score[0] === score[1] ? 0 : score[0] > score[1] ? 1 : -1 : null }; }
  const result = place(state, move.to[0], move.to[1]); if (!result) return state; const captures = { ...state.captures }; captures[String(state.turn) as "1" | "-1"] += result.captured;
  return { ...state, board: result.board, turn: other(state.turn), captures, previousBoard: serialize(state.board), passes: 0 };
}

export function goOutcome(state: GoState) { return state.outcome; }
function influenceScore(state: GoState, root: Side) {
  let value = 0;
  for (let row = 0; row < GO_SIZE; row += 1) for (let column = 0; column < GO_SIZE; column += 1) { const stone = state.board[row][column]; if (!stone) continue; const liberties = group(state.board, row, column).liberties.size; const center = 8 - Math.abs(4 - row) - Math.abs(4 - column); value += (stone === root ? 1 : -1) * (18 + liberties * 2 + center); }
  value += (state.captures[String(root) as "1" | "-1"] - state.captures[String(other(root)) as "1" | "-1"]) * 24; return value;
}

function moveHeuristic(state: GoState, move: GoMove) {
  if (move.pass) return -100;
  const result = place(state, move.to[0], move.to[1]); if (!result) return -Infinity; const [row, column] = move.to; const center = 8 - Math.abs(4 - row) - Math.abs(4 - column); const liberties = group(result.board, row, column).liberties.size;
  return result.captured * 80 + liberties * 6 + center * 2 + Math.random() * 1.5;
}

function randomPlayout(state: GoState, root: Side, movesLeft = 24) {
  let current = state;
  for (let index = 0; index < movesLeft && current.outcome === null; index += 1) { const moves = goLegalMoves(current).filter((move) => !move.pass); const candidates = orderedBy(moves, (move) => moveHeuristic(current, move), 12); const move = chooseRandom(candidates.slice(0, Math.max(3, Math.ceil(candidates.length / 2)))) ?? { to: [-1, -1] as [number, number], pass: true }; current = goApply(current, move); }
  return influenceScore(current, root);
}

export function chooseGoMove(state: GoState, difficulty: Difficulty) {
  const moves = goLegalMoves(state); const boardMoves = moves.filter((move) => !move.pass); if (!boardMoves.length) return moves[0]; if (difficulty === "easy") return chooseRandom(boardMoves);
  const candidates = orderedBy(boardMoves, (move) => moveHeuristic(state, move), difficulty === "very-hard" ? 12 : 8);
  if (difficulty === "medium") return candidates[0];
  let best = -Infinity; let choices: GoMove[] = []; const playouts = difficulty === "very-hard" ? 10 : 3;
  for (const move of candidates) { const next = goApply(state, move); let score = influenceScore(next, state.turn); const replies = orderedBy(goLegalMoves(next).filter((item) => !item.pass), (item) => moveHeuristic(next, item), 6); if (replies[0]) score -= moveHeuristic(next, replies[0]) * 0.45; for (let index = 0; index < playouts; index += 1) score += randomPlayout(next, state.turn, difficulty === "very-hard" ? 30 : 18) / playouts; if (score > best) { best = score; choices = [move]; } else if (Math.abs(score - best) < 0.01) choices.push(move); }
  return chooseRandom(choices) ?? choices[0];
}
