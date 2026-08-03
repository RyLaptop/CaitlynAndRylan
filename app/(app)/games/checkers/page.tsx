"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

type Color = "red" | "black";
type Piece = { color: Color; king: boolean };
type Board = (Piece | null)[][];
type Pos = [number, number];

function makeBoard(): Board {
  const b: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 1) b[r][c] = { color: "black", king: false };
  for (let r = 5; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 1) b[r][c] = { color: "red", king: false };
  return b;
}

function clone(b: Board): Board {
  return b.map((row) => row.map((p) => (p ? { ...p } : null)));
}

function dirs(p: Piece): number[] {
  if (p.king) return [-1, 1];
  return p.color === "red" ? [-1] : [1];
}

function getJumps(board: Board, r: number, c: number): Array<{ to: Pos; over: Pos }> {
  const p = board[r][c];
  if (!p) return [];
  const jumps: Array<{ to: Pos; over: Pos }> = [];
  for (const dr of dirs(p)) {
    for (const dc of [-1, 1]) {
      const mr = r + dr, mc = c + dc;
      const tr = r + dr * 2, tc = c + dc * 2;
      if (tr < 0 || tr > 7 || tc < 0 || tc > 7) continue;
      const mid = board[mr]?.[mc];
      if (mid && mid.color !== p.color && !board[tr][tc]) {
        jumps.push({ to: [tr, tc], over: [mr, mc] });
      }
    }
  }
  return jumps;
}

function getMoves(board: Board, r: number, c: number): Pos[] {
  const p = board[r][c];
  if (!p) return [];
  const moves: Pos[] = [];
  for (const dr of dirs(p)) {
    for (const dc of [-1, 1]) {
      const tr = r + dr, tc = c + dc;
      if (tr < 0 || tr > 7 || tc < 0 || tc > 7) continue;
      if (!board[tr][tc]) moves.push([tr, tc]);
    }
  }
  return moves;
}

function allPieceMoves(board: Board, color: Color) {
  const result: Array<{ from: Pos; to: Pos; over?: Pos }> = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color !== color) continue;
      for (const j of getJumps(board, r, c))
        result.push({ from: [r, c], to: j.to, over: j.over });
    }
  }
  if (result.length) return result;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color !== color) continue;
      for (const to of getMoves(board, r, c))
        result.push({ from: [r, c], to });
    }
  }
  return result;
}

function applyMove(board: Board, from: Pos, to: Pos, over?: Pos): Board {
  const b = clone(board);
  const p = b[from[0]][from[1]]!;
  b[to[0]][to[1]] = { ...p };
  b[from[0]][from[1]] = null;
  if (over) b[over[0]][over[1]] = null;
  if (to[0] === 0 && p.color === "red")   b[to[0]][to[1]]!.king = true;
  if (to[0] === 7 && p.color === "black") b[to[0]][to[1]]!.king = true;
  return b;
}

function checkWin(board: Board, turn: Color): Color | "draw" | null {
  const reds   = board.flat().some((p) => p?.color === "red");
  const blacks = board.flat().some((p) => p?.color === "black");
  if (!reds)   return "black";
  if (!blacks) return "red";
  if (!allPieceMoves(board, turn).length) return turn === "red" ? "black" : "red";
  return null;
}

export default function CheckersPage() {
  const [board, setBoard]   = useState<Board>(makeBoard);
  const [sel, setSel]       = useState<Pos | null>(null);
  const [turn, setTurn]     = useState<Color>("red");
  const [winner, setWinner] = useState<Color | "draw" | null>(null);
  const [msg, setMsg]       = useState("");

  const validTargets = sel
    ? [
        ...getJumps(board, sel[0], sel[1]).map((j) => j.to),
        ...getMoves(board, sel[0], sel[1]),
      ]
    : [];

  const isTarget = (r: number, c: number) =>
    validTargets.some(([tr, tc]) => tr === r && tc === c);

  const handleClick = useCallback((r: number, c: number) => {
    if (winner) return;
    const cell = board[r][c];

    if (sel) {
      const jumps = getJumps(board, sel[0], sel[1]);
      const jump  = jumps.find((j) => j.to[0] === r && j.to[1] === c);
      const isMove = getMoves(board, sel[0], sel[1]).some(([tr, tc]) => tr === r && tc === c);

      if (jump || isMove) {
        const nb = applyMove(board, sel, [r, c], jump?.over);
        // Check for chain jump
        if (jump) {
          const chain = getJumps(nb, r, c);
          if (chain.length) {
            setBoard(nb);
            setSel([r, c]);
            return;
          }
        }
        const nextTurn: Color = turn === "red" ? "black" : "red";
        const w = checkWin(nb, nextTurn);
        setBoard(nb);
        setSel(null);
        if (w) { setWinner(w); return; }
        setTurn(nextTurn);
        return;
      }
      if (cell?.color === turn) { setSel([r, c]); return; }
      setSel(null);
      return;
    }

    if (cell?.color === turn) {
      const allJumps = allPieceMoves(board, turn).filter((m) => m.over);
      if (allJumps.length && !getJumps(board, r, c).length) {
        setMsg("Must capture!");
        setTimeout(() => setMsg(""), 1400);
        return;
      }
      setSel([r, c]);
    }
  }, [board, sel, turn, winner]);

  const reset = () => {
    setBoard(makeBoard());
    setSel(null);
    setTurn("red");
    setWinner(null);
    setMsg("");
  };

  const redCount   = board.flat().filter((p) => p?.color === "red").length;
  const blackCount = board.flat().filter((p) => p?.color === "black").length;

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">‹</Link>
        <div>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Checkers ♟️</h1>
          <p className="text-xs text-gray-500 font-sans">take turns — play on video call together!</p>
        </div>
      </div>

      {/* Turn / piece count bar */}
      <div className="flex justify-between items-center mb-3 px-1">
        <span className={`text-sm font-sans font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition
          ${turn === "red" && !winner ? "bg-red-100 text-red-600 ring-2 ring-red-300" : "bg-gray-100 text-gray-400"}`}>
          🔴 Red · {redCount} left
        </span>
        {msg && <span className="text-xs font-sans text-amber-500 font-bold">{msg}</span>}
        <span className={`text-sm font-sans font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition
          ${turn === "black" && !winner ? "bg-gray-800 text-white ring-2 ring-gray-500" : "bg-gray-100 text-gray-400"}`}>
          ⚫ Black · {blackCount} left
        </span>
      </div>

      {/* Whose turn label */}
      {!winner && (
        <p className="text-center text-xs font-sans text-gray-400 mb-2">
          {turn === "red" ? "🔴 Red's turn — click a piece to move" : "⚫ Black's turn — click a piece to move"}
        </p>
      )}

      {/* Board */}
      <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-amber-800 mb-5">
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const dark = (r + c) % 2 === 1;
              const isSel = sel?.[0] === r && sel?.[1] === c;
              const isTgt = isTarget(r, c);
              return (
                <div
                  key={c}
                  onClick={() => handleClick(r, c)}
                  className={`flex-1 aspect-square flex items-center justify-center transition-colors cursor-pointer
                    ${dark
                      ? isSel ? "bg-yellow-400"
                        : isTgt ? "bg-yellow-200"
                        : "bg-amber-700"
                      : "bg-amber-100"
                    }`}
                >
                  {cell && dark && (
                    <div className={`w-[70%] h-[70%] rounded-full flex items-center justify-center shadow-md transition-transform
                      ${cell.color === "red"
                        ? "bg-gradient-to-br from-red-400 to-red-600"
                        : "bg-gradient-to-br from-gray-600 to-gray-900"
                      } ${isSel ? "scale-110 ring-2 ring-yellow-300" : "hover:scale-105"}`}>
                      {cell.king && <span className="text-[10px] text-yellow-300 font-bold leading-none">♛</span>}
                    </div>
                  )}
                  {/* Valid move dot */}
                  {dark && isTgt && !cell && (
                    <div className="w-4 h-4 rounded-full bg-yellow-400/70"/>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Win screen */}
      {winner && (
        <div className="tape bg-white rounded-3xl p-6 text-center shadow-lg">
          <p className="text-5xl mb-2">{winner === "red" ? "🔴" : "⚫"} 🏆</p>
          <p className="font-hand text-3xl font-bold text-blush-dark mb-1">
            {winner === "red" ? "Red wins!" : "Black wins!"}
          </p>
          <p className="text-sm font-sans text-gray-400 mb-4">Good game! 🎉</p>
          <button onClick={reset} className="btn-primary px-8 py-3 font-sans font-bold">
            Play Again ♟️
          </button>
        </div>
      )}

      <style>{`
        .btn-primary { background: linear-gradient(135deg,#FFB7C5,#F48FB1); color:white; border-radius:14px; font-weight:700; transition:opacity 0.2s; border:none; cursor:pointer; }
        .btn-primary:hover { opacity:0.9; }
      `}</style>
    </div>
  );
}
