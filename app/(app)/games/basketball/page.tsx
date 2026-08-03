"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SHOTS = 5;
const SWEET = 0.17;

type Player = 1 | 2;

export default function BasketballPage() {
  const [player, setPlayer]       = useState<Player>(1);
  const [phase, setPhase]         = useState<"aim" | "flying" | "between" | "done">("aim");
  const [angle, setAngle]         = useState(0);
  const [p1Shots, setP1Shots]     = useState<boolean[]>([]);
  const [p2Shots, setP2Shots]     = useState<boolean[]>([]);
  const [lastIn, setLastIn]       = useState<boolean | null>(null);
  const animRef                   = useRef<number>(0);
  const startRef                  = useRef<number>(0);
  const SPEED                     = 1200;

  const currentShots = player === 1 ? p1Shots : p2Shots;
  const setCurrentShots = player === 1 ? setP1Shots : setP2Shots;

  useEffect(() => {
    if (phase !== "aim") return;
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
  }, [phase]);

  const shoot = () => {
    if (phase !== "aim") return;
    cancelAnimationFrame(animRef.current);
    const scored = Math.abs(angle - 0.75) < SWEET / 2;
    setLastIn(scored);
    setPhase("flying");
    setTimeout(() => {
      const next = [...currentShots, scored];
      setCurrentShots(next);
      if (next.length >= SHOTS) {
        if (player === 1) {
          setPhase("between");
        } else {
          setPhase("done");
        }
      } else {
        setLastIn(null);
        setPhase("aim");
      }
    }, 900);
  };

  const startP2 = () => {
    setPlayer(2);
    setLastIn(null);
    setPhase("aim");
  };

  const reset = () => {
    setPlayer(1); setPhase("aim"); setP1Shots([]); setP2Shots([]); setLastIn(null);
  };

  const p1Score = p1Shots.filter(Boolean).length;
  const p2Score = p2Shots.filter(Boolean).length;
  const ballX   = 80 + angle * 160;
  const ballY   = 180 - Math.sin(angle * Math.PI) * 110;

  if (phase === "between") {
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="tape bg-white rounded-3xl p-8 text-center shadow-lg w-full">
          <p className="text-5xl mb-3">🏀</p>
          <p className="font-hand text-3xl font-bold text-blush-dark mb-2">Player 1 done!</p>
          <p className="font-hand text-2xl text-gray-600 mb-1">Score: <span className="text-mint font-bold">{p1Score}/{SHOTS}</span></p>
          <p className="text-sm font-sans text-gray-400 mb-6">Hand it to Player 2!</p>
          <button onClick={startP2}
            className="btn-primary px-8 py-4 font-sans font-bold text-lg">
            Player 2&apos;s Turn 🏀
          </button>
        </div>
        <style>{`.btn-primary{background:linear-gradient(135deg,#FFB7C5,#F48FB1);color:white;border-radius:14px;font-weight:700;transition:opacity 0.2s;border:none;cursor:pointer}.btn-primary:hover{opacity:.9}`}</style>
      </div>
    );
  }

  if (phase === "done") {
    const winner = p1Score > p2Score ? "Player 1" : p2Score > p1Score ? "Player 2" : null;
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/games" className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">‹</Link>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Results 🏀</h1>
        </div>
        <div className="tape bg-white rounded-3xl p-6 text-center shadow-lg">
          <div className="flex justify-around mb-6">
            <div>
              <p className="font-hand text-2xl text-gray-600 mb-1">Player 1</p>
              <p className="font-hand text-5xl font-bold text-blush-dark">{p1Score}</p>
              <p className="text-xs text-gray-400 font-sans">/{SHOTS} baskets</p>
            </div>
            <div className="w-px bg-gray-100"/>
            <div>
              <p className="font-hand text-2xl text-gray-600 mb-1">Player 2</p>
              <p className="font-hand text-5xl font-bold text-lavender">{p2Score}</p>
              <p className="text-xs text-gray-400 font-sans">/{SHOTS} baskets</p>
            </div>
          </div>
          <p className="font-hand text-3xl font-bold text-gray-700 mb-1">
            {winner ? `${winner} wins! 🏆` : "Tie game! 🤝"}
          </p>
          <p className="text-sm font-sans text-gray-400 mb-5">
            {p1Score === SHOTS && p2Score === SHOTS ? "Both perfect! 🔥" : winner ? "Nice shooting! 💪" : "Perfectly matched!"}
          </p>
          <button onClick={reset} className="btn-primary px-8 py-3 font-sans font-bold">Play Again 🏀</button>
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
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Basketball 🏀</h1>
          <p className="text-xs text-gray-500 font-sans">tap Shoot when aimed at the hoop!</p>
        </div>
      </div>

      <p className="text-center font-hand text-xl text-gray-600 mb-3">
        {player === 1 ? "🔴 Player 1&apos;s turn" : "🔵 Player 2&apos;s turn"}
      </p>

      {/* Shot tracker */}
      <div className="flex gap-2 justify-center mb-4">
        {Array.from({ length: SHOTS }).map((_, i) => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i < currentShots.length
              ? currentShots[i] ? "bg-mint text-white" : "bg-red-300 text-white"
              : "bg-gray-100 text-gray-300"
          }`}>
            {i < currentShots.length ? (currentShots[i] ? "✓" : "✗") : i + 1}
          </div>
        ))}
      </div>

      {/* Court */}
      <div className="relative bg-amber-100 rounded-3xl overflow-hidden shadow-lg mb-5" style={{ height: 220 }}>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-amber-700/30 rounded-b-3xl"/>
        <div className="absolute bg-gray-400" style={{ right: 48, bottom: 48, width: 5, height: 80 }}/>
        <div className="absolute bg-white border-2 border-gray-300 rounded-sm" style={{ right: 42, top: 30, width: 16, height: 50 }}/>
        <div className="absolute border-4 border-orange-500 rounded-full bg-transparent" style={{ right: 38, top: 82, width: 32, height: 14 }}/>
        <svg className="absolute" style={{ right: 38, top: 96, width: 32, height: 20 }}>
          <path d="M0 0 L4 18 M8 0 L10 18 M16 0 L16 18 M24 0 L22 18 M32 0 L28 18 M0 6 Q16 8 32 6 M0 12 Q16 14 32 12" stroke="#ccc" strokeWidth="1" fill="none"/>
        </svg>

        {/* Aim arrow */}
        {phase === "aim" && (
          <div className="absolute flex flex-col items-center" style={{ left: 94, bottom: 50 }}>
            <div className="w-0.5 h-10 bg-blush rounded-full"
              style={{ transform: `rotate(${(angle - 0.5) * 60}deg)`, transformOrigin: "bottom center" }}/>
          </div>
        )}

        {/* Ball */}
        <div className="absolute transition-none"
          style={{
            left: phase === "flying" && lastIn ? 124 : phase === "flying" && !lastIn ? 100 : ballX - 14,
            top: phase === "flying" ? 74 : ballY - 14,
            transition: phase === "flying" ? "all 0.9s cubic-bezier(.2,.8,.6,1)" : "none",
          }}>
          <div className="w-7 h-7 rounded-full shadow-md"
            style={{ backgroundImage: "radial-gradient(circle at 35% 35%, #fb923c, #ea580c)" }}/>
        </div>

        {phase === "flying" && lastIn !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className={`text-3xl font-hand font-bold animate-pop ${lastIn ? "text-mint" : "text-red-400"}`}>
              {lastIn ? "SWISH! 🔥" : "MISS!"}
            </span>
          </div>
        )}
      </div>

      {phase === "aim" && (
        <button onClick={shoot}
          className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-3xl font-hand text-2xl font-bold shadow-lg hover:opacity-90 transition active:scale-95">
          🏀 Shoot!
        </button>
      )}
      {phase === "flying" && (
        <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-3xl font-hand text-2xl text-center">
          {lastIn ? "Nice shot! 🔥" : "So close..."}
        </div>
      )}
    </div>
  );
}
