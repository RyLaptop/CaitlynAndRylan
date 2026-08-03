"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const CUP_POSITIONS = [
  { x: 62, y: 68 }, { x: 90, y: 68 }, { x: 118, y: 68 },
  { x: 76, y: 96 }, { x: 104, y: 96 },
  { x: 90,  y: 124 },
];

type Player = 1 | 2;

export default function CupPongPage() {
  const [player, setPlayer]     = useState<Player>(1);
  const [phase, setPhase]       = useState<"aim" | "flying" | "between" | "done">("aim");
  const [sunk, setSunk]         = useState<boolean[]>(Array(6).fill(false));
  const [p2Sunk, setP2Sunk]     = useState<boolean[]>(Array(6).fill(false));
  const [throws, setThrows]     = useState(0);
  const [p2Throws, setP2Throws] = useState(0);
  const [angle, setAngle]       = useState(0);
  const [lastIdx, setLastIdx]   = useState<number | null>(null);
  const animRef                 = useRef<number>(0);
  const startRef                = useRef<number>(0);
  const SPEED                   = 1400;

  const currentSunk   = player === 1 ? sunk   : p2Sunk;
  const currentThrows = player === 1 ? throws : p2Throws;
  const setCurrentSunk   = player === 1 ? setSunk   : setP2Sunk;
  const setCurrentThrows = player === 1 ? setThrows : setP2Throws;

  const allSunk = currentSunk.every(Boolean);

  useEffect(() => {
    if (phase !== "aim" || allSunk) return;
    let running = true;
    const tick = (ts: number) => {
      if (!running) return;
      const t = ((ts - startRef.current) % SPEED) / SPEED;
      setAngle(t < 0.5 ? t * 2 : 2 - t * 2);
      animRef.current = requestAnimationFrame(tick);
    };
    startRef.current = performance.now();
    animRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [phase, allSunk]);

  const throwBall = () => {
    if (phase !== "aim" || allSunk) return;
    cancelAnimationFrame(animRef.current);
    const avail = CUP_POSITIONS.map((_, i) => i).filter((i) => !currentSunk[i]);
    const centeredness = 1 - Math.abs(angle - 0.5) * 2;
    const hit = avail.length > 0 && Math.random() < Math.max(0.1, centeredness * 0.85);
    setPhase("flying");
    setCurrentThrows((t) => t + 1);
    setTimeout(() => {
      if (hit && avail.length > 0) {
        const target = avail[Math.floor(Math.random() * avail.length)];
        setLastIdx(target);
        const next = [...currentSunk];
        next[target] = true;
        setCurrentSunk(next);
        if (next.every(Boolean)) {
          if (player === 1) {
            setTimeout(() => setPhase("between"), 600);
          } else {
            setTimeout(() => setPhase("done"), 600);
          }
          return;
        }
      } else {
        setLastIdx(null);
      }
      setTimeout(() => setPhase("aim"), 700);
    }, 600);
  };

  const startP2 = () => {
    setPlayer(2); setPhase("aim"); setLastIdx(null);
  };

  const reset = () => {
    setPlayer(1); setPhase("aim");
    setSunk(Array(6).fill(false)); setP2Sunk(Array(6).fill(false));
    setThrows(0); setP2Throws(0); setLastIdx(null);
  };

  if (phase === "between") {
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="tape bg-white rounded-3xl p-8 text-center shadow-lg w-full">
          <p className="text-5xl mb-3">🏓</p>
          <p className="font-hand text-3xl font-bold text-blush-dark mb-2">Player 1 cleared!</p>
          <p className="font-hand text-xl text-gray-600 mb-1">
            All 6 cups in <span className="text-mint font-bold">{throws}</span> throws
          </p>
          <p className="text-sm font-sans text-gray-400 mb-6">Hand it to Player 2!</p>
          <button onClick={startP2} className="btn-primary px-8 py-4 font-sans font-bold text-lg">
            Player 2&apos;s Turn 🏓
          </button>
        </div>
        <style>{`.btn-primary{background:linear-gradient(135deg,#FFB7C5,#F48FB1);color:white;border-radius:14px;font-weight:700;transition:opacity 0.2s;border:none;cursor:pointer}.btn-primary:hover{opacity:.9}`}</style>
      </div>
    );
  }

  if (phase === "done") {
    const p1Done = sunk.every(Boolean);
    const p2Done = p2Sunk.every(Boolean);
    let winner: string | null = null;
    if (p1Done && p2Done) winner = throws < p2Throws ? "Player 1" : p2Throws < throws ? "Player 2" : null;
    else if (p1Done)  winner = "Player 1";
    else if (p2Done)  winner = "Player 2";
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/games" className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">‹</Link>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Results 🏓</h1>
        </div>
        <div className="tape bg-white rounded-3xl p-6 text-center shadow-lg">
          <div className="flex justify-around mb-6">
            <div>
              <p className="font-hand text-xl text-gray-600">Player 1</p>
              <p className="font-hand text-4xl font-bold text-blush-dark">{sunk.filter(Boolean).length}/6</p>
              <p className="text-xs text-gray-400 font-sans">{throws} throws</p>
            </div>
            <div className="w-px bg-gray-100"/>
            <div>
              <p className="font-hand text-xl text-gray-600">Player 2</p>
              <p className="font-hand text-4xl font-bold text-lavender">{p2Sunk.filter(Boolean).length}/6</p>
              <p className="text-xs text-gray-400 font-sans">{p2Throws} throws</p>
            </div>
          </div>
          <p className="font-hand text-3xl font-bold text-gray-700 mb-1">
            {winner ? `${winner} wins! 🏆` : "Tie! 🤝"}
          </p>
          <p className="text-sm font-sans text-gray-400 mb-5">Good game! 🏓</p>
          <button onClick={reset} className="btn-primary px-8 py-3 font-sans font-bold">Play Again 🏓</button>
        </div>
        <style>{`.btn-primary{background:linear-gradient(135deg,#FFB7C5,#F48FB1);color:white;border-radius:14px;font-weight:700;transition:opacity 0.2s;border:none;cursor:pointer}.btn-primary:hover{opacity:.9}`}</style>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">‹</Link>
        <div>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Cup Pong 🏓</h1>
          <p className="text-xs text-gray-500 font-sans">sink all 6 cups in fewest throws!</p>
        </div>
      </div>

      <p className="text-center font-hand text-xl text-gray-600 mb-2">
        {player === 1 ? "🔴 Player 1's turn" : "🔵 Player 2's turn"}
      </p>

      <div className="flex justify-between text-xs font-sans text-gray-500 mb-3 px-1">
        <span>Cups: <span className="font-bold text-mint">{currentSunk.filter(Boolean).length}/6</span></span>
        <span>Throws: <span className="font-bold text-blush-dark">{currentThrows}</span></span>
      </div>

      <div className="relative rounded-3xl overflow-hidden shadow-lg mb-5 bg-emerald-800" style={{ height: 230 }}>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-emerald-700 rounded-b-3xl"/>
        <div className="absolute bg-emerald-600 left-0 right-0" style={{ bottom: 38, height: 6 }}/>

        <div className="absolute" style={{ right: 20, top: 40 }}>
          <svg width={150} height={160} viewBox="0 0 150 160">
            {CUP_POSITIONS.map((pos, i) => (
              <g key={i}>
                <ellipse cx={pos.x} cy={pos.y + 16} rx={13} ry={6} fill={currentSunk[i] ? "#065f46" : "#ef4444"} opacity={currentSunk[i] ? 0.3 : 1}/>
                <rect x={pos.x - 13} y={pos.y} width={26} height={16} fill={currentSunk[i] ? "#065f46" : "#ef4444"} opacity={currentSunk[i] ? 0.3 : 1}/>
                <ellipse cx={pos.x} cy={pos.y} rx={13} ry={6} fill={currentSunk[i] ? "#047857" : "#dc2626"} opacity={currentSunk[i] ? 0.3 : 1}/>
                {!currentSunk[i] && <ellipse cx={pos.x} cy={pos.y + 2} rx={10} ry={4} fill="#fbbf24" opacity={0.5}/>}
                {currentSunk[i] && <text x={pos.x} y={pos.y + 10} textAnchor="middle" fontSize="14" fill="#86efac">✓</text>}
                {lastIdx === i && <ellipse cx={pos.x} cy={pos.y} rx={16} ry={8} fill="#fde68a" opacity={0.7}/>}
              </g>
            ))}
          </svg>
        </div>

        {phase === "aim" && (
          <div className="absolute flex flex-col items-center" style={{ left: 42, bottom: 50 }}>
            <div className="w-0.5 h-10 bg-white/70 rounded-full"
              style={{ transform: `rotate(${(angle - 0.5) * -80}deg)`, transformOrigin: "bottom center" }}/>
            <div className="w-2 h-2 bg-white/80 rounded-full"/>
          </div>
        )}

        <div className="absolute w-7 h-7 rounded-full shadow-lg"
          style={{
            left: phase === "flying" ? 76 : 28,
            bottom: phase === "flying" ? 134 : 55,
            background: "radial-gradient(circle at 35% 35%, #f97316, #c2410c)",
            transition: phase === "flying" ? "all 0.6s cubic-bezier(.2,.9,.4,1)" : "none",
          }}/>

        {phase === "flying" && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
            <span className={`text-2xl font-hand font-bold animate-pop ${lastIdx !== null ? "text-yellow-300" : "text-white/70"}`}>
              {lastIdx !== null ? "SPLASH! 💦" : "MISS!"}
            </span>
          </div>
        )}
      </div>

      {phase === "aim" && (
        <button onClick={throwBall}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-3xl font-hand text-2xl font-bold shadow-lg hover:opacity-90 transition active:scale-95">
          🏓 Throw!
        </button>
      )}
      {phase === "flying" && (
        <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-3xl font-hand text-xl text-center">
          {lastIdx !== null ? "Cup down! 🎉" : "Miss!"}
        </div>
      )}
    </div>
  );
}
