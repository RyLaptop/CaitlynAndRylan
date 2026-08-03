"use client";
import { useState, useCallback, useMemo } from "react";
import Link from "next/link";

const WORD_LISTS = [
  { theme: "Animals", words: ["CAT", "DOG", "FOX", "OWL", "BEAR", "WOLF", "DEER", "FROG", "LION", "DUCK"] },
  { theme: "Foods", words: ["CAKE", "TACO", "RICE", "BEET", "KALE", "LIME", "PEAR", "PLUM", "CORN", "SALT"] },
  { theme: "Colors", words: ["RED", "BLUE", "GOLD", "ROSE", "LIME", "TEAL", "GRAY", "PINK", "CYAN", "JADE"] },
];

const SIZE = 8;

type Cell = { letter: string; row: number; col: number };

function buildGrid(words: string[]): string[][] {
  const grid: string[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => "")
  );
  const directions = [
    [0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]
  ];

  for (const word of words) {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];
      const startR = Math.floor(Math.random() * SIZE);
      const startC = Math.floor(Math.random() * SIZE);
      const endR = startR + dr * (word.length - 1);
      const endC = startC + dc * (word.length - 1);
      if (endR < 0 || endR >= SIZE || endC < 0 || endC >= SIZE) continue;
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const r = startR + dr * i, c = startC + dc * i;
        if (grid[r][c] && grid[r][c] !== word[i]) { ok = false; break; }
      }
      if (!ok) continue;
      for (let i = 0; i < word.length; i++) {
        grid[startR + dr * i][startC + dc * i] = word[i];
      }
      placed = true;
    }
  }

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random() * 26)];

  return grid;
}

function cellKey(r: number, c: number) { return `${r},${c}`; }

export default function WordHuntPage() {
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = WORD_LISTS[themeIdx];

  const grid = useMemo(() => buildGrid(theme.words), [themeIdx]);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Cell[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(false);

  const won = found.size === theme.words.length;

  const startSelect = (r: number, c: number) => {
    setSelecting(true);
    setSelected([{ letter: grid[r][c], row: r, col: c }]);
  };

  const extendSelect = (r: number, c: number) => {
    if (!selecting) return;
    const key = cellKey(r, c);
    if (selected.find((s) => cellKey(s.row, s.col) === key)) return;
    setSelected((s) => [...s, { letter: grid[r][c], row: r, col: c }]);
  };

  const endSelect = useCallback(() => {
    if (!selecting) return;
    setSelecting(false);
    const word = selected.map((s) => s.letter).join("");
    const wordRev = [...word].reverse().join("");
    const match = theme.words.find((w) => w === word || w === wordRev);
    if (match && !found.has(match)) {
      setFound((f) => new Set([...f, match]));
      setFoundCells((fc) => {
        const n = new Set(fc);
        selected.forEach((s) => n.add(cellKey(s.row, s.col)));
        return n;
      });
    } else if (!match) {
      setWrong(true);
      setTimeout(() => setWrong(false), 400);
    }
    setSelected([]);
  }, [selecting, selected, theme.words, found]);

  const reset = () => {
    setFound(new Set());
    setFoundCells(new Set());
    setSelected([]);
  };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">‹</Link>
        <h1 className="font-hand text-3xl text-blush-dark font-bold">Word Hunt 🔍</h1>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {WORD_LISTS.map((t, i) => (
          <button key={t.theme} onClick={() => { setThemeIdx(i); reset(); }}
            className={`px-3 py-1 rounded-full text-xs font-sans font-semibold transition ${i === themeIdx ? "bg-blush text-white" : "bg-cream text-gray-500 hover:bg-blush/20"}`}>
            {t.theme}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {theme.words.map((w) => (
          <span key={w} className={`px-3 py-1 rounded-full text-xs font-sans font-semibold border-2 transition ${found.has(w) ? "bg-mint/30 border-mint/50 line-through text-gray-400" : "border-blush/30 text-gray-700"}`}>
            {w}
          </span>
        ))}
      </div>

      {won ? (
        <div className="text-center py-8 animate-pop">
          <p className="text-5xl">🎉</p>
          <p className="font-hand text-3xl text-blush-dark font-bold">All found!</p>
          <button onClick={reset} className="mt-4 px-6 py-2.5 bg-blush text-white rounded-2xl font-sans font-semibold">Play Again</button>
        </div>
      ) : (
        <div
          className={`inline-grid gap-0.5 mx-auto ${wrong ? "animate-shake" : ""}`}
          style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, touchAction: "none" }}
          onMouseLeave={endSelect}
          onTouchEnd={endSelect}>
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const key = cellKey(r, c);
              const isSelected = !!selected.find((s) => s.row === r && s.col === c);
              const isFound = foundCells.has(key);
              return (
                <div key={key}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold font-sans cursor-pointer select-none transition
                    ${isFound ? "bg-mint/40 text-green-800" : isSelected ? "bg-blush text-white scale-110" : "bg-cream hover:bg-blush/20 text-gray-700"}`}
                  onMouseDown={() => startSelect(r, c)}
                  onMouseEnter={() => extendSelect(r, c)}
                  onMouseUp={endSelect}
                  onTouchStart={(e) => { e.preventDefault(); startSelect(r, c); }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    const t = e.touches[0];
                    const el = document.elementFromPoint(t.clientX, t.clientY);
                    const data = el?.getAttribute("data-rc");
                    if (data) { const [rr, cc] = data.split(",").map(Number); extendSelect(rr, cc); }
                  }}
                  data-rc={`${r},${c}`}>
                  {letter}
                </div>
              );
            })
          )}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 font-sans mt-4">
        {found.size}/{theme.words.length} found · drag to select
      </p>
    </div>
  );
}
