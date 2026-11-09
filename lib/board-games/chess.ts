import { chooseRandom, difficultyDepth, inside, minimax, other, orderedBy, type Difficulty, type Outcome, type Side } from "./common";

export type ChessPiece = "P" | "N" | "B" | "R" | "Q" | "K" | "p" | "n" | "b" | "r" | "q" | "k";
export type ChessMove = { from: [number, number]; to: [number, number]; promotion?: ChessPiece; castle?: boolean; enPassant?: boolean };
export type ChessState = {
  board: Array<Array<ChessPiece | null>>;
  turn: Side;
  castling: { K: boolean; Q: boolean; k: boolean; q: boolean };
  enPassant: [number, number] | null;
  halfmove: number;
  outcome: Outcome;
};

const backWhite: ChessPiece[] = ["R", "N", "B", "Q", "K", "B", "N", "R"];
const backBlack: ChessPiece[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
const values: Record<string, number> = { p: 100, n: 320, b: 335, r: 500, q: 900, k: 20_000 };

export const chessGlyph: Record<ChessPiece, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

export function createChessState(): ChessState {
  return {
    board: [backBlack, Array(8).fill("p") as ChessPiece[], ...Array.from({ length: 4 }, () => Array<ChessPiece | null>(8).fill(null)), Array(8).fill("P") as ChessPiece[], backWhite].map((row) => [...row]),
    turn: 1,
    castling: { K: true, Q: true, k: true, q: true },
    enPassant: null,
    halfmove: 0,
    outcome: null,
  };
}

export function chessSide(piece: ChessPiece): Side {
  return piece === piece.toUpperCase() ? 1 : -1;
}

function attacks(state: ChessState, from: [number, number]): Array<[number, number]> {
  const [row, column] = from;
  const piece = state.board[row][column];
  if (!piece) return [];
  const side = chessSide(piece);
  const kind = piece.toLowerCase();
  const result: Array<[number, number]> = [];
  if (kind === "p") {
    const direction = side === 1 ? -1 : 1;
    for (const dc of [-1, 1]) if (inside(row + direction, column + dc, 8, 8)) result.push([row + direction, column + dc]);
    return result;
  }
  if (kind === "n") {
    for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) if (inside(row + dr, column + dc, 8, 8)) result.push([row + dr, column + dc]);
    return result;
  }
  if (kind === "k") {
    for (let dr = -1; dr <= 1; dr += 1) for (let dc = -1; dc <= 1; dc += 1) if ((dr || dc) && inside(row + dr, column + dc, 8, 8)) result.push([row + dr, column + dc]);
    return result;
  }
  const directions = kind === "b" ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : kind === "r" ? [[-1, 0], [1, 0], [0, -1], [0, 1]] : [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of directions) {
    for (let step = 1; step < 8; step += 1) {
      const target: [number, number] = [row + dr * step, column + dc * step];
      if (!inside(target[0], target[1], 8, 8)) break;
      result.push(target);
      if (state.board[target[0]][target[1]]) break;
    }
  }
  return result;
}

export function chessInCheck(state: ChessState, side: Side) {
  let king: [number, number] | null = null;
  for (let row = 0; row < 8; row += 1) for (let column = 0; column < 8; column += 1) if (state.board[row][column] === (side === 1 ? "K" : "k")) king = [row, column];
  if (!king) return true;
  for (let row = 0; row < 8; row += 1) for (let column = 0; column < 8; column += 1) {
    const piece = state.board[row][column];
    if (piece && chessSide(piece) === other(side) && attacks(state, [row, column]).some(([r, c]) => r === king![0] && c === king![1])) return true;
  }
  return false;
}

function pseudoMoves(state: ChessState, from: [number, number]): ChessMove[] {
  const [row, column] = from;
  const piece = state.board[row][column];
  if (!piece || chessSide(piece) !== state.turn) return [];
  const side = chessSide(piece);
  const kind = piece.toLowerCase();
  const result: ChessMove[] = [];
  const add = (target: [number, number], flags: Partial<ChessMove> = {}) => {
    const occupant = state.board[target[0]][target[1]];
    if (!occupant || chessSide(occupant) !== side) result.push({ from, to: target, ...flags });
  };
  if (kind === "p") {
    const direction = side === 1 ? -1 : 1;
    const start = side === 1 ? 6 : 1;
    const promotionRow = side === 1 ? 0 : 7;
    const one = row + direction;
    if (inside(one, column, 8, 8) && !state.board[one][column]) {
      add([one, column], one === promotionRow ? { promotion: side === 1 ? "Q" : "q" } : {});
      const two = row + direction * 2;
      if (row === start && !state.board[two][column]) add([two, column]);
    }
    for (const dc of [-1, 1]) {
      const target: [number, number] = [row + direction, column + dc];
      if (!inside(target[0], target[1], 8, 8)) continue;
      const occupant = state.board[target[0]][target[1]];
      if (occupant && chessSide(occupant) !== side) add(target, target[0] === promotionRow ? { promotion: side === 1 ? "Q" : "q" } : {});
      else if (state.enPassant?.[0] === target[0] && state.enPassant[1] === target[1]) add(target, { enPassant: true });
    }
    return result;
  }
  if (kind === "n" || kind === "k") for (const target of attacks(state, from)) add(target);
  else for (const target of attacks(state, from)) {
    add(target);
    if (state.board[target[0]][target[1]]) continue;
  }
  if (kind === "k" && !chessInCheck(state, side)) {
    const baseRow = side === 1 ? 7 : 0;
    const kingKey = side === 1 ? "K" : "k";
    const queenKey = side === 1 ? "Q" : "q";
    if (state.castling[kingKey] && !state.board[baseRow][5] && !state.board[baseRow][6] && state.board[baseRow][7]?.toLowerCase() === "r" && !squareAttacked(state, [baseRow, 5], other(side)) && !squareAttacked(state, [baseRow, 6], other(side))) result.push({ from, to: [baseRow, 6], castle: true });
    if (state.castling[queenKey] && !state.board[baseRow][1] && !state.board[baseRow][2] && !state.board[baseRow][3] && state.board[baseRow][0]?.toLowerCase() === "r" && !squareAttacked(state, [baseRow, 3], other(side)) && !squareAttacked(state, [baseRow, 2], other(side))) result.push({ from, to: [baseRow, 2], castle: true });
  }
  return result;
}

function squareAttacked(state: ChessState, square: [number, number], by: Side) {
  for (let row = 0; row < 8; row += 1) for (let column = 0; column < 8; column += 1) {
    const piece = state.board[row][column];
    if (piece && chessSide(piece) === by && attacks(state, [row, column]).some(([r, c]) => r === square[0] && c === square[1])) return true;
  }
  return false;
}

function applyRaw(state: ChessState, move: ChessMove): ChessState {
  const board = state.board.map((row) => [...row]);
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  const piece = board[fr][fc]!;
  const captured = board[tr][tc];
  board[fr][fc] = null;
  board[tr][tc] = move.promotion ?? piece;
  if (move.enPassant) board[fr][tc] = null;
  if (move.castle) {
    if (tc === 6) { board[tr][5] = board[tr][7]; board[tr][7] = null; }
    else { board[tr][3] = board[tr][0]; board[tr][0] = null; }
  }
  const castling = { ...state.castling };
  if (piece === "K") { castling.K = false; castling.Q = false; }
  if (piece === "k") { castling.k = false; castling.q = false; }
  if (piece === "R" && fr === 7 && fc === 0 || tr === 7 && tc === 0) castling.Q = false;
  if (piece === "R" && fr === 7 && fc === 7 || tr === 7 && tc === 7) castling.K = false;
  if (piece === "r" && fr === 0 && fc === 0 || tr === 0 && tc === 0) castling.q = false;
  if (piece === "r" && fr === 0 && fc === 7 || tr === 0 && tc === 7) castling.k = false;
  const enPassant: [number, number] | null = piece.toLowerCase() === "p" && Math.abs(tr - fr) === 2 ? [(fr + tr) / 2, fc] : null;
  return { ...state, board, turn: other(state.turn), castling, enPassant, halfmove: piece.toLowerCase() === "p" || captured ? 0 : state.halfmove + 1, outcome: null };
}

export function chessLegalMoves(state: ChessState): ChessMove[] {
  if (state.outcome !== null) return [];
  const result: ChessMove[] = [];
  for (let row = 0; row < 8; row += 1) for (let column = 0; column < 8; column += 1) {
    const piece = state.board[row][column];
    if (!piece || chessSide(piece) !== state.turn) continue;
    for (const move of pseudoMoves(state, [row, column])) if (!chessInCheck(applyRaw(state, move), state.turn)) result.push(move);
  }
  return result;
}

export function chessOutcome(state: ChessState): Outcome {
  if (state.halfmove >= 100) return 0;
  const moves = chessLegalMoves({ ...state, outcome: null });
  if (moves.length) return null;
  return chessInCheck(state, state.turn) ? other(state.turn) : 0;
}

export function chessApply(state: ChessState, move: ChessMove): ChessState {
  const next = applyRaw(state, move);
  return { ...next, outcome: chessOutcome(next) };
}

export function chessEvaluate(state: ChessState, root: Side) {
  let score = 0;
  for (let row = 0; row < 8; row += 1) for (let column = 0; column < 8; column += 1) {
    const piece = state.board[row][column];
    if (!piece) continue;
    const center = 7 - (Math.abs(3.5 - row) + Math.abs(3.5 - column));
    const value = values[piece.toLowerCase()] + (piece.toLowerCase() === "p" || piece.toLowerCase() === "n" ? center * 3 : 0);
    score += chessSide(piece) === root ? value : -value;
  }
  if (chessInCheck(state, other(root))) score += 24;
  if (chessInCheck(state, root)) score -= 24;
  return score;
}

function captureScore(state: ChessState, move: ChessMove) {
  const target = state.board[move.to[0]][move.to[1]];
  const attacker = state.board[move.from[0]][move.from[1]];
  return (target ? values[target.toLowerCase()] * 10 : 0) - (attacker ? values[attacker.toLowerCase()] : 0) + (move.promotion ? 8_000 : 0);
}

export function chooseChessMove(state: ChessState, difficulty: Difficulty): ChessMove | undefined {
  const moves = chessLegalMoves(state);
  if (!moves.length) return undefined;
  if (difficulty === "easy") return chooseRandom(moves);
  const depth = difficultyDepth[difficulty];
  const limit = difficulty === "very-hard" ? 24 : difficulty === "hard" ? 18 : 12;
  const candidates = orderedBy(moves, (move) => captureScore(state, move), limit);
  let best = -Infinity;
  let choices: ChessMove[] = [];
  for (const move of candidates) {
    const next = chessApply(state, move);
    const score = depth === 1 ? chessEvaluate(next, state.turn) : minimax({ state: next, root: state.turn, depth: depth - 1, turn: (item) => item.turn, moves: chessLegalMoves, apply: chessApply, evaluate: chessEvaluate, terminal: chessOutcome, order: (item, options) => orderedBy(options, (candidate) => captureScore(item, candidate), difficulty === "very-hard" ? 18 : 12) });
    if (score > best) { best = score; choices = [move]; }
    else if (score === best) choices.push(move);
  }
  return chooseRandom(choices) ?? choices[0];
}
