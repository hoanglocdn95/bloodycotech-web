export type Side = 1 | -1;
export type Difficulty = "easy" | "medium" | "hard" | "very-hard";
export type Outcome = Side | 0 | null;

export type GridMove = {
  from?: [number, number];
  to: [number, number];
  promotion?: string;
  pass?: boolean;
};

export const difficultyDepth: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
  "very-hard": 3,
};

export function other(side: Side): Side {
  return (side * -1) as Side;
}

export function inside(row: number, column: number, rows: number, columns: number) {
  return row >= 0 && row < rows && column >= 0 && column < columns;
}

export function chooseRandom<T>(items: readonly T[]): T | undefined {
  return items[Math.floor(Math.random() * items.length)];
}

export function sameSquare(a?: [number, number] | null, b?: [number, number] | null) {
  return Boolean(a && b && a[0] === b[0] && a[1] === b[1]);
}

export function moveKey(move: GridMove) {
  return `${move.from?.join(",") ?? "pass"}-${move.to.join(",")}-${move.promotion ?? ""}`;
}

export function orderedBy<T>(items: readonly T[], score: (item: T) => number, limit = items.length) {
  return [...items].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

export function minimax<S, M>(options: {
  state: S;
  root: Side;
  depth: number;
  turn: (state: S) => Side;
  moves: (state: S) => M[];
  apply: (state: S, move: M) => S;
  evaluate: (state: S, root: Side) => number;
  terminal: (state: S) => Outcome;
  order?: (state: S, moves: M[]) => M[];
  alpha?: number;
  beta?: number;
}): number {
  const result = options.terminal(options.state);
  if (result !== null) {
    if (result === 0) return 0;
    return result === options.root ? 100_000 + options.depth : -100_000 - options.depth;
  }
  if (options.depth <= 0) return options.evaluate(options.state, options.root);
  const alphaStart = options.alpha ?? -Infinity;
  const betaStart = options.beta ?? Infinity;
  let alpha = alphaStart;
  let beta = betaStart;
  const raw = options.moves(options.state);
  const candidates = options.order ? options.order(options.state, raw) : raw;
  if (!candidates.length) return options.evaluate(options.state, options.root);
  const maximizing = options.turn(options.state) === options.root;
  let best = maximizing ? -Infinity : Infinity;
  for (const move of candidates) {
    const value = minimax({ ...options, state: options.apply(options.state, move), depth: options.depth - 1, alpha, beta });
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

export function tinyDelay(difficulty: Difficulty) {
  return difficulty === "easy" ? 260 : difficulty === "medium" ? 340 : difficulty === "hard" ? 460 : 620;
}
