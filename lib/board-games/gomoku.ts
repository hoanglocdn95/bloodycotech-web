import { chooseRandom, other, orderedBy, type Difficulty, type Outcome, type Side } from "./common";

export const GOMOKU_SIZE = 15;
export type GomokuMove = { to: [number, number] };
export type GomokuState = { board: number[][]; turn: Side; outcome: Outcome; last: [number, number] | null };

export function createGomokuState(): GomokuState { return { board: Array.from({ length: GOMOKU_SIZE }, () => Array<number>(GOMOKU_SIZE).fill(0)), turn: 1, outcome: null, last: null }; }

function lineCount(board: number[][], row: number, column: number, side: Side, dr: number, dc: number) { let count = 0; for (let step = 1; step < 6; step += 1) { const r = row + dr * step; const c = column + dc * step; if (board[r]?.[c] !== side) break; count += 1; } return count; }
function winAt(board: number[][], row: number, column: number, side: Side) { return [[1, 0], [0, 1], [1, 1], [1, -1]].some(([dr, dc]) => 1 + lineCount(board, row, column, side, dr, dc) + lineCount(board, row, column, side, -dr, -dc) >= 5); }

export function gomokuLegalMoves(state: GomokuState): GomokuMove[] {
  if (state.outcome !== null) return [];
  const occupied: Array<[number, number]> = []; for (let row = 0; row < GOMOKU_SIZE; row += 1) for (let column = 0; column < GOMOKU_SIZE; column += 1) if (state.board[row][column]) occupied.push([row, column]);
  if (!occupied.length) return [{ to: [7, 7] }]; const candidates = new Set<string>();
  for (const [row, column] of occupied) for (let dr = -2; dr <= 2; dr += 1) for (let dc = -2; dc <= 2; dc += 1) { const r = row + dr; const c = column + dc; if (r >= 0 && r < GOMOKU_SIZE && c >= 0 && c < GOMOKU_SIZE && !state.board[r][c]) candidates.add(`${r},${c}`); }
  return [...candidates].map((key) => ({ to: key.split(",").map(Number) as [number, number] }));
}

export function gomokuApply(state: GomokuState, move: GomokuMove): GomokuState { if (state.board[move.to[0]][move.to[1]]) return state; const board = state.board.map((row) => [...row]); board[move.to[0]][move.to[1]] = state.turn; const won = winAt(board, move.to[0], move.to[1], state.turn); const full = board.every((row) => row.every(Boolean)); return { board, turn: other(state.turn), outcome: won ? state.turn : full ? 0 : null, last: move.to }; }

export function gomokuOutcome(state: GomokuState) { return state.outcome; }

function segmentScore(board: number[][], row: number, column: number, side: Side, dr: number, dc: number) {
  let stones = 1; let open = 0;
  for (const direction of [-1, 1]) { for (let step = 1; step < 5; step += 1) { const value = board[row + dr * step * direction]?.[column + dc * step * direction]; if (value === side) stones += 1; else { if (!value) open += 1; break; } } }
  if (stones >= 5) return 1_000_000; if (stones === 4 && open === 2) return 80_000; if (stones === 4 && open === 1) return 15_000; if (stones === 3 && open === 2) return 6_000; if (stones === 3 && open === 1) return 800; if (stones === 2 && open === 2) return 260; return stones * 15 + open * 4;
}

function moveValue(state: GomokuState, move: GomokuMove, side: Side) {
  const board = state.board.map((row) => [...row]); board[move.to[0]][move.to[1]] = side;
  return [[1, 0], [0, 1], [1, 1], [1, -1]].reduce((sum, [dr, dc]) => sum + segmentScore(board, move.to[0], move.to[1], side, dr, dc), 0);
}

export function gomokuEvaluate(state: GomokuState, root: Side) { const moves = gomokuLegalMoves({ ...state, outcome: null }); const attack = orderedBy(moves, (move) => moveValue(state, move, root), 4).reduce((sum, move) => sum + moveValue(state, move, root), 0); const defense = orderedBy(moves, (move) => moveValue(state, move, other(root)), 4).reduce((sum, move) => sum + moveValue(state, move, other(root)), 0); return attack - defense * 1.08; }

function search(state: GomokuState, root: Side, depth: number, alpha: number, beta: number, width: number): number {
  if (state.outcome !== null) return state.outcome === 0 ? 0 : state.outcome === root ? 10_000_000 + depth : -10_000_000 - depth;
  if (!depth) return gomokuEvaluate(state, root);
  const moves = orderedBy(gomokuLegalMoves(state), (move) => moveValue(state, move, state.turn) + moveValue(state, move, other(state.turn)) * 0.92, width); const maximizing = state.turn === root; let best = maximizing ? -Infinity : Infinity;
  for (const move of moves) { const score = search(gomokuApply(state, move), root, depth - 1, alpha, beta, Math.max(5, width - 2)); if (maximizing) { best = Math.max(best, score); alpha = Math.max(alpha, best); } else { best = Math.min(best, score); beta = Math.min(beta, best); } if (beta <= alpha) break; }
  return best;
}

export function chooseGomokuMove(state: GomokuState, difficulty: Difficulty) {
  const moves = gomokuLegalMoves(state); if (!moves.length) return undefined; if (difficulty === "easy") return chooseRandom(moves);
  for (const side of [state.turn, other(state.turn)] as Side[]) for (const move of moves) if (moveValue(state, move, side) >= 1_000_000) return move;
  const width = difficulty === "very-hard" ? 12 : difficulty === "hard" ? 10 : 8; const candidates = orderedBy(moves, (move) => moveValue(state, move, state.turn) + moveValue(state, move, other(state.turn)) * 0.94, width); if (difficulty === "medium") return candidates[0]; const depth = difficulty === "very-hard" ? 3 : 2; let best = -Infinity; let choices: GomokuMove[] = [];
  for (const move of candidates) { const score = search(gomokuApply(state, move), state.turn, depth - 1, -Infinity, Infinity, width - 2); if (score > best) { best = score; choices = [move]; } else if (score === best) choices.push(move); }
  return chooseRandom(choices) ?? choices[0];
}
