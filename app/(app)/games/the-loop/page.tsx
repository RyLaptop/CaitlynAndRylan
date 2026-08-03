"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

// Connections: [N, E, S, W]
type Conn = [boolean, boolean, boolean, boolean];

function rotateCW(c: Conn): Conn {
  return [c[3], c[0], c[1], c[2]];
}

function renderPipe(c: Conn, size = 36): React.ReactNode {
  const [N, E, S, W] = c;
  const mid = size / 2;
  const lines = [];
  if (N) lines.push(<line key="n" x1={mid} y1={mid} x2={mid} y2={0} stroke="#f9a8d4" strokeWidth="5" strokeLinecap="round"/>);
  if (E) lines.push(<line key="e" x1={mid} y1={mid} x2={size} y2={mid} stroke="#f9a8d4" strokeWidth="5" strokeLinecap="round"/>);
  if (S) lines.push(<line key="s" x1={mid} y1={mid} x2={mid} y2={size} stroke="#f9a8d4" strokeWidth="5" strokeLinecap="round"/>);
  if (W) lines.push(<line key="w" x1={mid} y1={mid} x2={0} y2={mid} stroke="#f9a8d4" strokeWidth="5" strokeLinecap="round"/>);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={mid} cy={mid} r="4" fill="#f9a8d4"/>
      {lines}
    </svg>
  );
}

// Puzzles: each cell = { conn, solved } (solved rotation)
// We represent cells by their solved connection, then randomize rotation

type PuzzleCell = { conn: Conn } | null;

const PUZZLES: PuzzleCell[][] = [
  // 5x5 grid, null = no pipe here
  // Puzzle 1: outer rectangle loop
  [
    { conn: [false,true,true,false] },  // SE corner
    { conn: [false,true,false,true] },  // EW
    { conn: [false,true,false,true] },  // EW
    { conn: [false,true,false,true] },  // EW
    { conn: [false,false,true,true] },  // SW corner
  ],
  [
    { conn: [true,false,true,false] },  // NS
    null,
    null,
    null,
    { conn: [true,false,true,false] },  // NS
  ],
  [
    { conn: [true,false,true,false] },
    null,
    { conn: [false,true,true,false] },  // SE
    { conn: [false,false,true,true] },  // SW
    { conn: [true,false,true,false] },
  ],
  [
    { conn: [true,false,true,false] },
    null,
    { conn: [true,true,false,false] },  // NE
    { conn: [true,false,false,true] },  // NW
    { conn: [true,false,true,false] },
  ],
  [
    { conn: [true,true,false,false] },  // NE corner
    { conn: [false,true,false,true] },  // EW
    { conn: [false,true,false,true] },  // EW
    { conn: [false,true,false,true] },  // EW
    { conn: [true,false,false,true] },  // NW corner
  ],
];

function rotationsMatch(a: Conn, b: Conn) {
  return a[0]===b[0] && a[1]===b[1] && a[2]===b[2] && a[3]===b[3];
}

function randomRotate(c: Conn): Conn {
  const times = Math.floor(Math.random() * 4);
  let r = c;
  for (let i = 0; i < times; i++) r = rotateCW(r);
  return r;
}

export default function TheLoopPage() {
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const initial = useMemo(() => PUZZLES.map((row) =>
    row.map((cell) => cell ? { conn: randomRotate(cell.conn), solved: cell.conn } : null)
  ), []);

  const [grid, setGrid] = useState(initial);

  const rotate = (r: number, c: number) => {
    if (won || !grid[r][c]) return;
    const newGrid = grid.map((row) => row.map((cell) => cell ? { ...cell } : null));
    newGrid[r][c]!.conn = rotateCW(newGrid[r][c]!.conn);
    setGrid(newGrid);
    setMoves((m) => m + 1);

    const allSolved = newGrid.every((row, ri) =>
      row.every((cell, ci) => !cell || rotationsMatch(cell.conn, cell.solved))
    );
    if (allSolved) setWon(true);
  };

  const reset = () => {
    setGrid(PUZZLES.map((row) =>
      row.map((cell) => cell ? { conn: randomRotate(cell.conn), solved: cell.conn } : null)
    ));
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">‹</Link>
        <h1 className="font-hand text-3xl text-blush-dark font-bold">The Loop 🔄</h1>
      </div>

      <div className="tape bg-white rounded-3xl p-4 shadow-lg mt-4 text-center mb-4">
        <p className="text-sm text-gray-500 font-sans">Tap tiles to rotate them. Form one closed loop!</p>
        <p className="text-xs text-gray-400 font-sans mt-1">{moves} moves</p>
      </div>

      {won && (
        <div className="text-center animate-pop mb-4">
          <p className="text-4xl">🎉</p>
          <p className="font-hand text-3xl text-blush-dark font-bold">Loop complete!</p>
          <p className="text-sm text-gray-500 font-sans">in {moves} moves</p>
          <button onClick={reset} className="mt-3 px-6 py-2 bg-blush text-white rounded-2xl font-sans font-semibold">Play Again</button>
        </div>
      )}

      <div className="flex justify-center">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(5, 1fr)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div key={`${r},${c}`}
                onClick={() => rotate(r, c)}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition
                  ${cell ? "bg-blush/10 hover:bg-blush/20 cursor-pointer active:scale-95 border-2 border-blush/20" : "bg-transparent"}`}>
                {cell && renderPipe(cell.conn, 40)}
              </div>
            ))
          )}
        </div>
      </div>

      {!won && (
        <button onClick={reset} className="w-full mt-6 py-2.5 text-sm text-gray-400 border border-gray-200 rounded-2xl font-sans hover:bg-gray-50">
          Shuffle
        </button>
      )}
    </div>
  );
}
