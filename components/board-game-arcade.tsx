"use client";

import { Bot, RotateCcw, Undo2, UserRound, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chessApply, chessGlyph, chessLegalMoves, chessSide, chooseChessMove, createChessState, type ChessState } from "@/lib/board-games/chess";
import { sameSquare, tinyDelay, type Difficulty, type Outcome, type Side } from "@/lib/board-games/common";
import { chooseGoMove, createGoState, GO_SIZE, goApply, type GoMove, type GoState } from "@/lib/board-games/go";
import { animalGlyphs, animalNames, chooseJungleMove, createJungleState, jungleApply, jungleLegalMoves, jungleTerrain, type JungleState } from "@/lib/board-games/jungle";
import { chooseGomokuMove, createGomokuState, GOMOKU_SIZE, gomokuApply, type GomokuMove, type GomokuState } from "@/lib/board-games/gomoku";
import { chooseXiangqiMove, createXiangqiState, xiangqiApply, xiangqiLabel, xiangqiLegalMoves, xiangqiSide, type XiangqiState } from "@/lib/board-games/xiangqi";
import styles from "./board-game-arcade.module.css";

type Locale = "vi" | "en";
export type BoardGameId = "chess" | "xiangqi" | "go" | "jungle" | "gomoku";
type GameId = BoardGameId;

const gameMeta: Record<GameId, { mark: string; vi: [string, string]; en: [string, string] }> = {
  chess: { mark: "♞", vi: ["Cờ vua", "Luật quốc tế · bàn 8×8"], en: ["Chess", "International rules · 8×8"] },
  xiangqi: { mark: "將", vi: ["Cờ tướng", "Pháo, sông và cửu cung"], en: ["Xiangqi", "Cannons, river and palaces"] },
  go: { mark: "●", vi: ["Cờ vây", "Bàn 9×9 · luật ko"], en: ["Go", "9×9 board · ko rule"] },
  jungle: { mark: "虎", vi: ["Cờ thú", "Hang, bẫy và sông"], en: ["Jungle", "Dens, traps and rivers"] },
  gomoku: { mark: "五", vi: ["Cờ caro", "Năm quân liên tiếp · 15×15"], en: ["Gomoku", "Five in a row · 15×15"] },
};

const text = {
  vi: {
    eyebrow: "BỘ SƯU TẬP BOARD GAME", title: "Năm bàn cờ, một góc carton", intro: "Chơi trực tiếp với bot trên trình duyệt. Mỗi trò có luật riêng, lịch sử nước đi và bốn cấp độ AI.", difficulty: "Độ khó bot", yourTurn: "Đến lượt bạn", botTurn: "Bot đang suy nghĩ…", redTurn: "Đỏ đi", blackTurn: "Đen đi", whiteTurn: "Trắng đi", win: "Bạn thắng", lose: "Bot thắng", draw: "Hòa", reset: "Ván mới", undo: "Đi lại", pass: "Bỏ lượt", captured: "Bắt được", you: "Bạn", bot: "Bot", rules: "Luật nhanh", soundOn: "Tắt âm thanh", soundOff: "Bật âm thanh", matchStatus: "Trạng thái ván đấu", yourBadge: "LƯỢT BẠN", botBadge: "LƯỢT BOT",
    difficulties: { easy: "Dễ", medium: "Vừa", hard: "Khó", "very-hard": "Rất khó" } as Record<Difficulty, string>,
  },
  en: {
    eyebrow: "BOARD GAME COLLECTION", title: "Five boards, one cardboard table", intro: "Play against the bot in your browser. Every game has its own rules, move history, and four AI levels.", difficulty: "Bot difficulty", yourTurn: "Your turn", botTurn: "Bot is thinking…", redTurn: "Red to move", blackTurn: "Black to move", whiteTurn: "White to move", win: "You win", lose: "Bot wins", draw: "Draw", reset: "New game", undo: "Undo", pass: "Pass", captured: "Captured", you: "You", bot: "Bot", rules: "Quick rules", soundOn: "Mute sound", soundOff: "Enable sound", matchStatus: "Match status", yourBadge: "YOUR TURN", botBadge: "BOT TURN",
    difficulties: { easy: "Easy", medium: "Medium", hard: "Hard", "very-hard": "Very hard" } as Record<Difficulty, string>,
  },
} as const;

let sharedAudioContext: AudioContext | null = null;

function playSound(kind: "move" | "capture" | "finish", muted: boolean) {
  if (muted || typeof window === "undefined") return;
  try {
    const AudioCtor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    sharedAudioContext ??= new AudioCtor();
    const audio = sharedAudioContext;
    if (audio.state === "suspended") void audio.resume();
    const knock = (delay: number, frequency: number, volume: number, duration = 0.11) => {
      const at = audio.currentTime + delay;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, at);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(62, frequency * 0.38), at + duration);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(volume, at + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(at); oscillator.stop(at + duration + 0.02);
    };
    const noiseLength = Math.floor(audio.sampleRate * 0.045);
    const buffer = audio.createBuffer(1, noiseLength, audio.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) samples[index] = (Math.random() * 2 - 1) * Math.exp(-index / (samples.length * 0.18));
    const noise = audio.createBufferSource(); const filter = audio.createBiquadFilter(); const noiseGain = audio.createGain();
    noise.buffer = buffer; filter.type = "bandpass"; filter.frequency.value = kind === "capture" ? 520 : 780; filter.Q.value = 0.75; noiseGain.gain.value = kind === "finish" ? 0.045 : 0.11;
    noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(audio.destination); noise.start();
    if (kind === "finish") { knock(0, 330, 0.09, 0.18); knock(0.11, 494, 0.08, 0.22); knock(0.22, 660, 0.07, 0.26); }
    else if (kind === "capture") { knock(0, 145, 0.16); knock(0.07, 105, 0.13, 0.13); }
    else knock(0, 235, 0.14);
  } catch { /* Sound is progressive enhancement. */ }
}

function useBotMatch<S, M>(options: { create: () => S; turn: (state: S) => Side; outcome: (state: S) => Outcome; apply: (state: S, move: M) => S; choose: (state: S, difficulty: Difficulty) => M | undefined; difficulty: Difficulty; muted: boolean }) {
  const [state, setState] = useState<S>(options.create);
  const [history, setHistory] = useState<S[]>([]);
  const generation = useRef(0);
  const outcome = options.outcome(state);
  const thinking = outcome === null && options.turn(state) === -1;
  const commit = useCallback((move: M) => {
    setState((current) => { const next = options.apply(current, move); setHistory((items) => [...items, current]); playSound(options.outcome(next) === null ? "move" : "finish", options.muted); return next; });
  }, [options]);
  useEffect(() => {
    if (!thinking) return;
    const currentGeneration = generation.current; const timer = window.setTimeout(() => {
      if (generation.current !== currentGeneration) return; const move = options.choose(state, options.difficulty); if (move) commit(move);
    }, tinyDelay(options.difficulty));
    return () => window.clearTimeout(timer);
  }, [commit, options, state, thinking]);
  const reset = useCallback(() => { generation.current += 1; setState(options.create()); setHistory([]); }, [options]);
  const undo = useCallback(() => { generation.current += 1; setHistory((items) => { if (!items.length) return items; const steps = options.turn(state) === 1 && items.length > 1 ? 2 : 1; const index = Math.max(0, items.length - steps); setState(items[index]); return items.slice(0, index); }); }, [options, state]);
  return { state, commit, reset, undo, canUndo: history.length > 0, thinking };
}

export function BoardGameArcade({ locale = "vi", fixedGame }: { locale?: Locale; fixedGame?: BoardGameId }) {
  const t = text[locale]; const [selectedGame, setGame] = useState<GameId>(fixedGame ?? "chess"); const game = fixedGame ?? selectedGame; const [difficulty, setDifficulty] = useState<Difficulty>("medium"); const [muted, setMuted] = useState(false);
  const currentMeta = gameMeta[game][locale];
  return <section className={styles.arcade} aria-label={currentMeta[0]}>
    <div className={styles.hero}><div><p className={styles.eyebrow}>{fixedGame ? (locale === "vi" ? "MỘT BÀN CỜ RIÊNG" : "A BOARD OF ITS OWN") : t.eyebrow}</p><h2>{fixedGame ? currentMeta[0] : t.title}</h2><p>{fixedGame ? currentMeta[1] : t.intro}</p></div><button className={styles.soundButton} type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? t.soundOff : t.soundOn}>{muted ? <VolumeX /> : <Volume2 />}</button></div>
    {!fixedGame ? <div className={styles.gameTabs} role="tablist">{(Object.keys(gameMeta) as GameId[]).map((id, index) => { const meta = gameMeta[id]; const localized = meta[locale]; return <button key={id} type="button" role="tab" aria-selected={game === id} className={`${styles.gameTab} ${game === id ? styles.gameTabActive : ""}`} onClick={() => setGame(id)}><span className={styles.tabNumber}>0{index + 1}</span><span className={styles.tabMark}>{meta.mark}</span><span><strong>{localized[0]}</strong><small>{localized[1]}</small></span></button>; })}</div> : null}
    <div className={styles.difficultyBar}><span><Bot aria-hidden="true" />{t.difficulty}</span><div>{(["easy", "medium", "hard", "very-hard"] as Difficulty[]).map((level) => <button key={level} type="button" className={difficulty === level ? styles.difficultyActive : ""} aria-pressed={difficulty === level} onClick={() => setDifficulty(level)}>{t.difficulties[level]}</button>)}</div></div>
    <div className={styles.gameDesk} key={game}>
      {game === "chess" ? <ChessBoard difficulty={difficulty} locale={locale} muted={muted} /> : null}
      {game === "xiangqi" ? <XiangqiBoard difficulty={difficulty} locale={locale} muted={muted} /> : null}
      {game === "go" ? <GoBoard difficulty={difficulty} locale={locale} muted={muted} /> : null}
      {game === "jungle" ? <JungleBoard difficulty={difficulty} locale={locale} muted={muted} /> : null}
      {game === "gomoku" ? <GomokuBoard difficulty={difficulty} locale={locale} muted={muted} /> : null}
    </div>
  </section>;
}

function statusLabel(outcome: Outcome, turn: Side, thinking: boolean, locale: Locale) { const t = text[locale]; if (outcome === 1) return t.win; if (outcome === -1) return t.lose; if (outcome === 0) return t.draw; if (thinking || turn === -1) return t.botTurn; return t.yourTurn; }
function GameHeader({ title, status, thinking, canUndo, reset, undo, locale }: { title: string; status: string; thinking: boolean; canUndo: boolean; reset: () => void; undo: () => void; locale: Locale }) { const t = text[locale]; return <header className={styles.gameHeader}><div className={styles.gameTitle}><h3>{title}</h3><span>{locale === "vi" ? "Đấu với máy" : "Versus bot"}</span></div><div className={styles.headerActions}><button type="button" onClick={undo} disabled={!canUndo || thinking}><Undo2 /> <span>{t.undo}</span></button><button type="button" onClick={reset}><RotateCcw /> <span>{t.reset}</span></button></div><div className={`${styles.turnBanner} ${thinking ? styles.turnBannerBot : styles.turnBannerPlayer}`} role="status" aria-live="polite"><span className={styles.turnIcon}>{thinking ? <Bot aria-hidden="true" /> : <UserRound aria-hidden="true" />}</span><span className={styles.turnCopy}><small>{t.matchStatus}</small><strong>{status}</strong></span><b>{thinking ? t.botBadge : t.yourBadge}</b></div></header>; }
function GameNotes({ children, locale }: { children: React.ReactNode; locale: Locale }) { return <aside className={styles.notes}><span className={styles.tape} /><h4>{text[locale].rules}</h4>{children}</aside>; }

function ChessBoard({ difficulty, locale, muted }: { difficulty: Difficulty; locale: Locale; muted: boolean }) {
  const options = useMemo(() => ({ create: createChessState, turn: (state: ChessState) => state.turn, outcome: (state: ChessState) => state.outcome, apply: chessApply, choose: chooseChessMove, difficulty, muted }), [difficulty, muted]); const match = useBotMatch(options); const [selected, setSelected] = useState<[number, number] | null>(null); const legal = useMemo(() => selected ? chessLegalMoves(match.state).filter((move) => sameSquare(move.from, selected)) : [], [match.state, selected]);
  const click = (row: number, column: number) => { if (match.state.turn !== 1 || match.thinking || match.state.outcome !== null) return; const move = legal.find((item) => sameSquare(item.to, [row, column])); if (move) { match.commit(move); setSelected(null); return; } const piece = match.state.board[row][column]; setSelected(piece && chessSide(piece) === 1 ? [row, column] : null); };
  return <><GameHeader locale={locale} title={gameMeta.chess[locale][0]} status={statusLabel(match.state.outcome, match.state.turn, match.thinking, locale)} thinking={match.thinking} canUndo={match.canUndo} reset={() => { match.reset(); setSelected(null); }} undo={() => { match.undo(); setSelected(null); }} /><div className={styles.playArea}><div className={`${styles.board} ${styles.chessBoard}`} role="grid" aria-label={gameMeta.chess[locale][0]}>{match.state.board.map((line, row) => line.map((piece, column) => { const target = legal.some((move) => sameSquare(move.to, [row, column])); return <button key={`${row}-${column}`} role="gridcell" type="button" className={`${styles.chessCell} ${(row + column) % 2 ? styles.darkSquare : styles.lightSquare} ${sameSquare(selected, [row, column]) ? styles.selected : ""} ${target ? styles.legalTarget : ""}`} onClick={() => click(row, column)} aria-label={`${String.fromCharCode(97 + column)}${8 - row}${piece ? ` ${chessGlyph[piece]}` : ""}`}>{piece ? <span className={chessSide(piece) === 1 ? styles.pieceLight : styles.pieceDark}>{chessGlyph[piece]}</span> : null}</button>; }))}</div><GameNotes locale={locale}><p>{locale === "vi" ? "Bạn cầm Trắng. Có nhập thành, bắt tốt qua đường, phong hậu và phát hiện chiếu hết." : "You play White. Castling, en passant, promotion, check and mate are supported."}</p><dl><div><dt>{text[locale].you}</dt><dd>♔</dd></div><div><dt>{text[locale].bot}</dt><dd>♚</dd></div></dl></GameNotes></div></>;
}

function XiangqiBoard({ difficulty, locale, muted }: { difficulty: Difficulty; locale: Locale; muted: boolean }) {
  const options = useMemo(() => ({ create: createXiangqiState, turn: (state: XiangqiState) => state.turn, outcome: (state: XiangqiState) => state.outcome, apply: xiangqiApply, choose: chooseXiangqiMove, difficulty, muted }), [difficulty, muted]); const match = useBotMatch(options); const [selected, setSelected] = useState<[number, number] | null>(null); const legal = useMemo(() => selected ? xiangqiLegalMoves(match.state).filter((move) => sameSquare(move.from, selected)) : [], [match.state, selected]);
  const click = (row: number, column: number) => { if (match.state.turn !== 1 || match.thinking || match.state.outcome !== null) return; const move = legal.find((item) => sameSquare(item.to, [row, column])); if (move) { match.commit(move); setSelected(null); return; } const piece = match.state.board[row][column]; setSelected(piece && xiangqiSide(piece) === 1 ? [row, column] : null); };
  return <><GameHeader locale={locale} title={gameMeta.xiangqi[locale][0]} status={statusLabel(match.state.outcome, match.state.turn, match.thinking, locale)} thinking={match.thinking} canUndo={match.canUndo} reset={() => { match.reset(); setSelected(null); }} undo={() => { match.undo(); setSelected(null); }} /><div className={styles.playArea}><div className={`${styles.board} ${styles.xiangqiBoard}`} role="grid" aria-label={gameMeta.xiangqi[locale][0]}><div className={styles.xiangqiSurface}><svg className={styles.xiangqiGrid} viewBox="0 0 8 9" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="0" width="8" height="9" />{Array.from({ length: 10 }, (_, row) => <line key={`h-${row}`} x1="0" y1={row} x2="8" y2={row} />)}{Array.from({ length: 9 }, (_, column) => <g key={`v-${column}`}><line x1={column} y1="0" x2={column} y2="4"/><line x1={column} y1="5" x2={column} y2="9"/></g>)}<line x1="3" y1="0" x2="5" y2="2"/><line x1="5" y1="0" x2="3" y2="2"/><line x1="3" y1="7" x2="5" y2="9"/><line x1="5" y1="7" x2="3" y2="9"/><text x="2" y="4.67">楚 河</text><text x="6" y="4.67">漢 界</text></svg>{match.state.board.map((line, row) => line.map((piece, column) => <button key={`${row}-${column}`} role="gridcell" type="button" style={{ left: `${column * 12.5}%`, top: `${row * 100 / 9}%` }} className={`${styles.xiangqiCell} ${sameSquare(selected, [row, column]) ? styles.selected : ""} ${legal.some((move) => sameSquare(move.to, [row, column])) ? styles.legalTarget : ""}`} onClick={() => click(row, column)} aria-label={`${row + 1}, ${column + 1}${piece ? ` ${xiangqiLabel[piece]}` : ""}`}>{piece ? <span className={xiangqiSide(piece) === 1 ? styles.redDisc : styles.blackDisc}>{xiangqiLabel[piece]}</span> : null}</button>))}</div></div><GameNotes locale={locale}><p>{locale === "vi" ? "Bạn cầm Đỏ. Mã bị chặn chân, tượng không qua sông, pháo cần ngòi và hai tướng không được nhìn nhau." : "You play Red. Horse legs, elephant eyes, cannon screens, palaces and flying generals are enforced."}</p></GameNotes></div></>;
}

function GoBoard({ difficulty, locale, muted }: { difficulty: Difficulty; locale: Locale; muted: boolean }) {
  const options = useMemo(() => ({ create: createGoState, turn: (state: GoState) => state.turn, outcome: (state: GoState) => state.outcome, apply: goApply, choose: chooseGoMove, difficulty, muted }), [difficulty, muted]); const match = useBotMatch(options); const play = (move: GoMove) => { if (match.state.turn === 1 && !match.thinking && match.state.outcome === null) match.commit(move); };
  const starPoints = new Set(["2,2", "2,6", "4,4", "6,2", "6,6"]);
  return <><GameHeader locale={locale} title={gameMeta.go[locale][0]} status={statusLabel(match.state.outcome, match.state.turn, match.thinking, locale)} thinking={match.thinking} canUndo={match.canUndo} reset={match.reset} undo={match.undo} /><div className={styles.playArea}><div className={`${styles.board} ${styles.goBoard}`} role="grid" aria-label={gameMeta.go[locale][0]}><div className={styles.goSurface}><svg className={styles.intersectionGrid} viewBox="0 0 8 8" preserveAspectRatio="none" aria-hidden="true">{Array.from({ length: GO_SIZE }, (_, index) => <g key={index}><line x1="0" y1={index} x2="8" y2={index}/><line x1={index} y1="0" x2={index} y2="8"/></g>)}</svg>{Array.from({ length: GO_SIZE }, (_, row) => Array.from({ length: GO_SIZE }, (_, column) => <button key={`${row}-${column}`} role="gridcell" type="button" style={{ left: `${column * 12.5}%`, top: `${row * 12.5}%` }} className={styles.goPoint} onClick={() => play({ to: [row, column] })} aria-label={`${row + 1}, ${column + 1}`}>{starPoints.has(`${row},${column}`) ? <i className={styles.starPoint} /> : null}{match.state.board[row][column] ? <span className={match.state.board[row][column] === 1 ? styles.blackStone : styles.whiteStone} /> : null}</button>))}</div></div><GameNotes locale={locale}><p>{locale === "vi" ? "Bạn cầm Đen. Luật khí, bắt quân, ko và cấm tự sát được áp dụng. Hai bên bỏ lượt liên tiếp để tính điểm." : "You play Black. Liberties, captures, ko and suicide prevention are enforced. Two passes score the board."}</p><dl><div><dt>{text[locale].captured} ●</dt><dd>{match.state.captures["1"]}</dd></div><div><dt>{text[locale].captured} ○</dt><dd>{match.state.captures["-1"]}</dd></div></dl><button className={styles.passButton} type="button" onClick={() => play({ to: [-1, -1], pass: true })} disabled={match.thinking || match.state.turn !== 1}>{text[locale].pass}</button></GameNotes></div></>;
}

function JungleBoard({ difficulty, locale, muted }: { difficulty: Difficulty; locale: Locale; muted: boolean }) {
  const options = useMemo(() => ({ create: createJungleState, turn: (state: JungleState) => state.turn, outcome: (state: JungleState) => state.outcome, apply: jungleApply, choose: chooseJungleMove, difficulty, muted }), [difficulty, muted]); const match = useBotMatch(options); const [selected, setSelected] = useState<[number, number] | null>(null); const legal = useMemo(() => selected ? jungleLegalMoves(match.state).filter((move) => sameSquare(move.from, selected)) : [], [match.state, selected]);
  const click = (row: number, column: number) => { if (match.state.turn !== 1 || match.thinking || match.state.outcome !== null) return; const move = legal.find((item) => sameSquare(item.to, [row, column])); if (move) { match.commit(move); setSelected(null); return; } const piece = match.state.board[row][column]; setSelected(piece?.side === 1 ? [row, column] : null); };
  return <><GameHeader locale={locale} title={gameMeta.jungle[locale][0]} status={statusLabel(match.state.outcome, match.state.turn, match.thinking, locale)} thinking={match.thinking} canUndo={match.canUndo} reset={() => { match.reset(); setSelected(null); }} undo={() => { match.undo(); setSelected(null); }} /><div className={styles.playArea}><div className={`${styles.board} ${styles.jungleBoard}`} role="grid">{match.state.board.map((line, row) => line.map((piece, column) => { const terrain = jungleTerrain(row, column); return <button key={`${row}-${column}`} type="button" data-terrain={terrain} className={`${styles.jungleCell} ${sameSquare(selected, [row, column]) ? styles.selected : ""} ${legal.some((move) => sameSquare(move.to, [row, column])) ? styles.legalTarget : ""}`} onClick={() => click(row, column)}>{terrain === "den" ? <i>穴</i> : terrain === "trap" ? <i>陷</i> : null}{piece ? <span className={piece.side === 1 ? styles.redAnimal : styles.blueAnimal} title={animalNames[piece.rank]}><b>{animalGlyphs[piece.rank]}</b><small>{piece.rank}</small></span> : null}</button>; }))}</div><GameNotes locale={locale}><p>{locale === "vi" ? "Bạn cầm Đỏ. Hổ và sư tử nhảy qua sông; chuột bơi và bắt voi; vào hang đối thủ để thắng." : "You play Red. Lions and tigers leap rivers, rats swim and defeat elephants, and entering the enemy den wins."}</p></GameNotes></div></>;
}

function GomokuBoard({ difficulty, locale, muted }: { difficulty: Difficulty; locale: Locale; muted: boolean }) {
  const options = useMemo(() => ({ create: createGomokuState, turn: (state: GomokuState) => state.turn, outcome: (state: GomokuState) => state.outcome, apply: gomokuApply, choose: chooseGomokuMove, difficulty, muted }), [difficulty, muted]); const match = useBotMatch(options); const play = (move: GomokuMove) => { if (match.state.turn === 1 && !match.thinking && match.state.outcome === null && !match.state.board[move.to[0]][move.to[1]]) match.commit(move); };
  const starPoints = new Set(["3,3", "3,11", "7,7", "11,3", "11,11"]);
  return <><GameHeader locale={locale} title={gameMeta.gomoku[locale][0]} status={statusLabel(match.state.outcome, match.state.turn, match.thinking, locale)} thinking={match.thinking} canUndo={match.canUndo} reset={match.reset} undo={match.undo} /><div className={styles.playArea}><div className={`${styles.board} ${styles.gomokuBoard}`} role="grid" aria-label={gameMeta.gomoku[locale][0]}><div className={styles.gomokuSurface}><svg className={styles.intersectionGrid} viewBox="0 0 14 14" preserveAspectRatio="none" aria-hidden="true">{Array.from({ length: GOMOKU_SIZE }, (_, index) => <g key={index}><line x1="0" y1={index} x2="14" y2={index}/><line x1={index} y1="0" x2={index} y2="14"/></g>)}</svg>{Array.from({ length: GOMOKU_SIZE }, (_, row) => Array.from({ length: GOMOKU_SIZE }, (_, column) => <button key={`${row}-${column}`} role="gridcell" type="button" style={{ left: `${column * 100 / 14}%`, top: `${row * 100 / 14}%` }} className={`${styles.gomokuCell} ${sameSquare(match.state.last, [row, column]) ? styles.lastMove : ""}`} onClick={() => play({ to: [row, column] })} aria-label={`${row + 1}, ${column + 1}`}>{starPoints.has(`${row},${column}`) ? <i className={styles.gomokuStar} /> : null}{match.state.board[row][column] === 1 ? <span className={`${styles.blackStone} ${styles.gomokuStone}`} /> : match.state.board[row][column] === -1 ? <span className={`${styles.whiteStone} ${styles.gomokuStone}`} /> : null}</button>))}</div></div><GameNotes locale={locale}><p>{locale === "vi" ? "Bạn cầm quân Đen. Đặt năm quân liên tiếp theo hàng, cột hoặc đường chéo trước bot." : "You play Black. Place five stones in a row horizontally, vertically, or diagonally before the bot."}</p></GameNotes></div></>;
}
