"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

const SIZE = 8;
type Cell = "empty" | "ship" | "hit" | "miss";
type Board = Cell[][];

function makeBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill("empty"));
}

const SHIPS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

function placeShips(board: Board): Board {
  const b = board.map((r) => [...r]) as Board;
  for (const len of SHIPS) {
    let placed = false;
    for (let attempt = 0; attempt < 500 && !placed; attempt++) {
      const horiz = Math.random() > 0.5;
      const r = Math.floor(Math.random() * (horiz ? SIZE : SIZE - len + 1));
      const c = Math.floor(Math.random() * (horiz ? SIZE - len + 1 : SIZE));
      let ok = true;
      for (let i = 0; i < len && ok; i++) {
        const rr = horiz ? r : r + i, cc = horiz ? c + i : c;
        if (b[rr][cc] !== "empty") ok = false;
        for (let dr = -1; dr <= 1 && ok; dr++)
          for (let dc = -1; dc <= 1 && ok; dc++) {
            const nr = rr + dr, nc = cc + dc;
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && b[nr][nc] === "ship") ok = false;
          }
      }
      if (ok) {
        for (let i = 0; i < len; i++) {
          const rr = horiz ? r : r + i, cc = horiz ? c + i : c;
          b[rr][cc] = "ship";
        }
        placed = true;
      }
    }
  }
  return b;
}

function aiShot(board: Board, tried: Set<string>): [number, number] {
  // Try to find hits to sink
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (board[r][c] === "hit") {
        for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !tried.has(`${nr},${nc}`))
            return [nr, nc];
        }
      }
  // Otherwise random
  let r, c;
  do { r = Math.floor(Math.random() * SIZE); c = Math.floor(Math.random() * SIZE); }
  while (tried.has(`${r},${c}`));
  return [r, c];
}

export default function SeaBattlePage() {
  const [phase, setPhase] = useState<"setup"|"playing"|"won"|"lost">("setup");
  const [playerBoard, setPlayerBoard] = useState<Board>(makeBoard());
  const [aiBoard, setAiBoard] = useState<Board>(makeBoard());
  const [shipsLeft, setShipsLeft] = useState(SHIPS.length);
  const [aiShipsLeft, setAiShipsLeft] = useState(SHIPS.length);
  const [aiTried, setAiTried] = useState<Set<string>>(new Set());
  const [turn, setTurn] = useState<"player"|"ai">("player");
  const [log, setLog] = useState<string>("");

  const startGame = () => {
    const pb = placeShips(makeBoard());
    const ab = placeShips(makeBoard());
    setPlayerBoard(pb);
    setAiBoard(ab);
    setShipsLeft(SHIPS.length);
    setAiShipsLeft(SHIPS.length);
    setAiTried(new Set());
    setTurn("player");
    setPhase("playing");
    setLog("Your turn — fire!");
  };

  const countShips = (board: Board) => board.flat().filter((c) => c === "ship").length;

  const playerFire = useCallback((r: number, c: number) => {
    if (turn !== "player" || phase !== "playing") return;
    const cell = aiBoard[r][c];
    if (cell === "hit" || cell === "miss") return;

    const nb = aiBoard.map((row) => [...row]) as Board;
    const isHit = cell === "ship";
    nb[r][c] = isHit ? "hit" : "miss";
    setAiBoard(nb);

    const remaining = countShips(nb);
    if (remaining === 0) { setPhase("won"); return; }

    if (!isHit) {
      setLog("Miss! AI fires…");
      setTurn("ai");
      // AI fires after delay
      setTimeout(() => {
        setPlayerBoard((pb) => {
          const [ar, ac] = aiShot(pb, aiTried);
          const key = `${ar},${ac}`;
          setAiTried((t) => new Set([...t, key]));
          const npb = pb.map((row) => [...row]) as Board;
          const aiHit = npb[ar][ac] === "ship";
          npb[ar][ac] = aiHit ? "hit" : "miss";
          if (countShips(npb) === 0) setPhase("lost");
          else setLog(aiHit ? `AI hit at ${String.fromCharCode(65+ac)}${ar+1}! Your turn.` : `AI missed ${String.fromCharCode(65+ac)}${ar+1}. Your turn.`);
          setTurn("player");
          return npb;
        });
      }, 800);
    } else {
      setLog(`Hit! Keep going.`);
    }
  }, [turn, phase, aiBoard, aiTried]);

  const cellColor = (cell: Cell, isAi: boolean) => {
    if (cell === "hit") return "bg-red-400 text-white";
    if (cell === "miss") return "bg-blue-200";
    if (!isAi && cell === "ship") return "bg-gray-400";
    return "bg-blue-100 hover:bg-blue-200";
  };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">‹</Link>
        <h1 className="font-hand text-3xl text-blush-dark font-bold">Sea Battle 🚢</h1>
      </div>

      {phase === "setup" && (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">⚓</p>
          <p className="font-hand text-2xl text-gray-600 mb-2">Ships will be placed automatically</p>
          <p className="text-sm text-gray-500 font-sans mb-6">Sink all 10 AI ships to win!</p>
          <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-blue-400 to-sky font-sans font-bold text-white rounded-2xl text-lg">
            Start Battle 🎯
          </button>
        </div>
      )}

      {(phase === "playing" || phase === "won" || phase === "lost") && (
        <div className="flex flex-col gap-4">
          <div className={`text-center text-sm font-sans font-semibold px-3 py-2 rounded-2xl ${phase === "won" ? "bg-mint/30 text-green-800" : phase === "lost" ? "bg-red-100 text-red-700" : "bg-cream text-gray-600"}`}>
            {phase === "won" ? "🎉 You sank all AI ships! You win!" : phase === "lost" ? "💔 AI sank your fleet! You lose." : log}
          </div>

          <div>
            <p className="font-hand text-lg text-gray-600 mb-1">Enemy Waters 🎯 ({aiShipsLeft > 0 ? `${countShips(aiBoard)} ship cells left` : "all sunk!"})</p>
            <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
              {aiBoard.map((row, r) => row.map((cell, c) => (
                <button key={`${r},${c}`}
                  onClick={() => playerFire(r, c)}
                  disabled={cell === "hit" || cell === "miss" || turn !== "player" || phase !== "playing"}
                  className={`w-9 h-9 rounded-md text-sm flex items-center justify-center transition ${cellColor(cell, true)}`}>
                  {cell === "hit" ? "💥" : cell === "miss" ? "•" : ""}
                </button>
              )))}
            </div>
          </div>

          <div>
            <p className="font-hand text-lg text-gray-600 mb-1">Your Waters 🛡️</p>
            <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
              {playerBoard.map((row, r) => row.map((cell, c) => (
                <div key={`${r},${c}`}
                  className={`w-9 h-9 rounded-md text-sm flex items-center justify-center ${cellColor(cell, false)}`}>
                  {cell === "hit" ? "💥" : cell === "miss" ? "•" : cell === "ship" ? "🚢" : ""}
                </div>
              )))}
            </div>
          </div>

          {(phase === "won" || phase === "lost") && (
            <button onClick={startGame} className="w-full py-3 bg-blush text-white rounded-2xl font-sans font-bold">
              Play Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
