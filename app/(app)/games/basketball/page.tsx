"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SHOTS_PER_GAME = 5;
const SWEET_SPOT_SIZE = 0.18; // fraction of the arc that's "in"

export default function BasketballPage() {
  const [phase, setPhase]       = useState<"aim" | "flying" | "result" | "done">("aim");
  const [angle, setAngle]       = useState(0);          // 0-1 oscillating
  const [shotResults, setShotResults] = useState<boolean[]>([]);
  const [lastIn, setLastIn]     = useState<boolean | null>(null);
  const animRef                 = useRef<number>(0);
  const startRef                = useRef<number>(0);
  const SPEED                   = 1200; // ms per full swing

  // Oscillate the aim indicator
  useEffect(() => {
    if (phase !== "aim") return;
    let running = true;
    const tick = (ts: number) => {
      if (!running) return;
      const t = ((ts - startRef.current) % SPEED) / SPEED;
      // Bounce: 0→1→0 via triangle wave
      const a = t < 0.5 ? t * 2 : 2 - t * 2;
      setAngle(a);
      animRef.current = requestAnimationFrame(tick);
    };
    startRef.current = performance.now();
    animRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [phase]);

  const shoot = () => {
    if (phase !== "aim") return;
    cancelAnimationFrame(animRef.current);
    // Sweet spot is centered at 0.75 (near the top of the arc, aimed at hoop)
    const sweetCenter = 0.75;
    const inZone = Math.abs(angle - sweetCenter) < SWEET_SPOT_SIZE / 2;
    const scored = inZone;
    setLastIn(scored);
    setPhase("flying");
    setTimeout(() => {
      const next = [...shotResults, scored];
      setShotResults(next);
      if (next.length >= SHOTS_PER_GAME) {
        setPhase("done");
      } else {
        setLastIn(null);
        setPhase("aim");
      }
    }, 900);
  };

  const reset = () => {
    setShotResults([]);
    setLastIn(null);
    setPhase("aim");
  };

  const score = shotResults.filter(Boolean).length;

  // Arc position of ball: angle maps to a parabolic arc
  // When aimed (angle≈0.75) the ball is in front of the hoop
  const ballX = 80 + angle * 160;  // px across the court
  const ballY = 180 - Math.sin(angle * Math.PI) * 110;  // arc up then down

  // Hoop position
  const hoopX = 260;
  const hoopY = 90;

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">‹</Link>
        <div>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Basketball 🏀</h1>
          <p className="text-xs text-gray-500 font-sans">tap Shoot when aimed at the hoop!</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="flex gap-2 justify-center mb-4">
        {Array.from({ length: SHOTS_PER_GAME }).map((_, i) => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i < shotResults.length
              ? shotResults[i] ? "bg-mint text-white" : "bg-red-300 text-white"
              : "bg-gray-100 text-gray-300"
          }`}>
            {i < shotResults.length ? (shotResults[i] ? "✓" : "✗") : i + 1}
          </div>
        ))}
      </div>

      {/* Court */}
      <div className="relative bg-amber-100 rounded-3xl overflow-hidden shadow-lg mb-5"
        style={{ height: 220 }}>
        {/* Court floor */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-amber-700/30 rounded-b-3xl"/>
        {/* Center line */}
        <div className="absolute bottom-0 left-1/2 w-0.5 h-full bg-amber-400/20"/>

        {/* Hoop pole */}
        <div className="absolute bg-gray-400" style={{ right: 48, bottom: 48, width: 5, height: 80 }}/>
        {/* Backboard */}
        <div className="absolute bg-white border-2 border-gray-300 rounded-sm"
          style={{ right: 42, top: 30, width: 16, height: 50 }}/>
        {/* Hoop */}
        <div className="absolute border-4 border-orange-500 rounded-full bg-transparent"
          style={{ right: 38, top: hoopY - 8, width: 32, height: 14 }}/>
        {/* Net */}
        <svg className="absolute" style={{ right: 38, top: hoopY + 6, width: 32, height: 20 }}>
          <path d="M0 0 L4 18 M8 0 L10 18 M16 0 L16 18 M24 0 L22 18 M32 0 L28 18 M0 6 Q16 8 32 6 M0 12 Q16 14 32 12" stroke="#ccc" strokeWidth="1" fill="none"/>
        </svg>

        {/* Sweet spot indicator (faint arc near hoop) */}
        <div className="absolute text-[10px] font-sans text-orange-400 font-semibold"
          style={{ right: 30, top: 56 }}>🎯</div>

        {/* Ball */}
        {phase !== "done" && (
          <div className="absolute transition-none"
            style={{
              left: phase === "flying" && lastIn
                ? hoopX - 16 : phase === "flying" && !lastIn
                ? hoopX - 40 : ballX - 14,
              top: phase === "flying" ? hoopY - 10 : ballY - 14,
              transition: phase === "flying" ? "all 0.9s cubic-bezier(.2,.8,.6,1)" : "none",
            }}>
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs shadow-md" style={{
              backgroundImage: "radial-gradient(circle at 35% 35%, #fb923c, #ea580c)",
            }}>
              <span className="text-[8px] text-orange-200 font-bold" style={{ lineHeight: 0 }}>●</span>
            </div>
          </div>
        )}

        {/* Aim arrow */}
        {phase === "aim" && (
          <div className="absolute bottom-12 left-16 flex flex-col items-center">
            <div className="text-sm font-sans text-gray-500">aim</div>
            <div className="w-1 h-8 bg-blush rounded-full mt-1"
              style={{ transform: `rotate(${(angle - 0.5) * 60}deg)`, transformOrigin: "bottom center" }}/>
          </div>
        )}

        {/* Result flash */}
        {phase === "flying" && lastIn !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className={`text-4xl font-hand font-bold animate-pop ${lastIn ? "text-mint" : "text-red-400"}`}>
              {lastIn ? "SWISH! 🏀" : "MISS!"}
            </span>
          </div>
        )}
      </div>

      {/* Shoot button */}
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

      {/* Done screen */}
      {phase === "done" && (
        <div className="tape bg-white rounded-3xl p-6 text-center shadow-lg mt-2">
          <p className="font-hand text-5xl font-bold text-blush-dark mb-2">{score}/{SHOTS_PER_GAME}</p>
          <p className="font-hand text-2xl text-gray-600 mb-1">
            {score === SHOTS_PER_GAME ? "Perfect game! 🏆" : score >= 4 ? "Amazing! 🔥" : score >= 3 ? "Nice shooting! 🏀" : score >= 2 ? "Keep practicing! 💪" : "Brick wall! 😅"}
          </p>
          <p className="text-xs text-gray-400 font-sans mb-4">
            {score} basket{score !== 1 ? "s" : ""} out of {SHOTS_PER_GAME} shots
          </p>
          <button onClick={reset}
            className="btn-primary px-8 py-3 font-sans font-bold">
            Play Again 🏀
          </button>
        </div>
      )}

      <style>{`
        .btn-primary { background: linear-gradient(135deg,#FFB7C5,#F48FB1); color: white; border-radius: 14px; font-weight: 700; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
