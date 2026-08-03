"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Cup triangle: 3 + 2 + 1 = 6 cups
// [0,1,2] row 0, [3,4] row 1, [5] row 2
const CUP_POSITIONS = [
  { x: 62, y: 68 }, { x: 90, y: 68 }, { x: 118, y: 68 },
  { x: 76, y: 96 }, { x: 104, y: 96 },
  { x: 90,  y: 124 },
];

export default function CupPongPage() {
  const [sunk, setSunk]     = useState<boolean[]>(Array(6).fill(false));
  const [phase, setPhase]   = useState<"aim" | "flying" | "result">("aim");
  const [angle, setAngle]   = useState(0);       // oscillating aim arrow
  const [lastIdx, setLastIdx] = useState<number | null>(null);
  const [throws, setThrows] = useState(0);
  const [done, setDone]     = useState(false);
  const animRef             = useRef<number>(0);
  const startRef            = useRef<number>(0);
  const SPEED               = 1400;

  useEffect(() => {
    if (phase !== "aim" || done) return;
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
  }, [phase, done]);

  const throwBall = () => {
    if (phase !== "aim" || done) return;
    cancelAnimationFrame(animRef.current);
    // angle 0=left, 1=right. Cups are in center-right area.
    // Map angle to "which cup column" it's aimed at
    // angle ≈ 0.3–0.7 hits the triangle roughly
    const availCups = CUP_POSITIONS
      .map((_, i) => i)
      .filter((i) => !sunk[i]);

    // Probability of hitting scales with how centered the angle is (0.5 = best)
    const centeredness = 1 - Math.abs(angle - 0.5) * 2; // 0 at edges, 1 at center
    const hitChance = Math.max(0.1, centeredness * 0.85);
    const hit = availCups.length > 0 && Math.random() < hitChance;

    setPhase("flying");
    setThrows((t) => t + 1);

    setTimeout(() => {
      if (hit && availCups.length > 0) {
        const target = availCups[Math.floor(Math.random() * availCups.length)];
        setLastIdx(target);
        const next = [...sunk];
        next[target] = true;
        setSunk(next);
        if (next.every(Boolean)) {
          setTimeout(() => setDone(true), 600);
        }
      } else {
        setLastIdx(null);
      }
      setTimeout(() => {
        setPhase("aim");
      }, 700);
    }, 600);
  };

  const reset = () => {
    setSunk(Array(6).fill(false));
    setPhase("aim");
    setLastIdx(null);
    setThrows(0);
    setDone(false);
  };

  // Ball start position (left side of table)
  const ballStartX = 28;
  const ballStartY = 170;
  // Ball lands near cup area
  const ballLandX  = 90;
  const ballLandY  = 96;

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">‹</Link>
        <div>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Cup Pong 🏓</h1>
          <p className="text-xs text-gray-500 font-sans">aim and sink all 6 cups!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-xs font-sans text-gray-500 mb-3 px-1">
        <span>Cups sunk: <span className="font-bold text-mint">{sunk.filter(Boolean).length}/6</span></span>
        <span>Throws: <span className="font-bold text-blush-dark">{throws}</span></span>
      </div>

      {/* Table / play area */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg mb-5 bg-emerald-800"
        style={{ height: 230 }}>
        {/* Table surface */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-emerald-700 rounded-b-3xl"/>
        {/* Table edge highlight */}
        <div className="absolute bg-emerald-600 left-0 right-0" style={{ bottom: 38, height: 6 }}/>

        {/* Cup triangle (opponent side, top-right) */}
        <div className="absolute" style={{ right: 20, top: 40 }}>
          <svg width={150} height={160} viewBox="0 0 150 160">
            {CUP_POSITIONS.map((pos, i) => (
              <g key={i}>
                {/* Cup body */}
                <ellipse cx={pos.x} cy={pos.y + 16} rx={13} ry={6} fill={sunk[i] ? "#065f46" : "#ef4444"} opacity={sunk[i] ? 0.3 : 1}/>
                <rect x={pos.x - 13} y={pos.y} width={26} height={16} fill={sunk[i] ? "#065f46" : "#ef4444"} opacity={sunk[i] ? 0.3 : 1}/>
                <ellipse cx={pos.x} cy={pos.y} rx={13} ry={6} fill={sunk[i] ? "#047857" : "#dc2626"} opacity={sunk[i] ? 0.3 : 1}/>
                {/* Beer/liquid */}
                {!sunk[i] && (
                  <ellipse cx={pos.x} cy={pos.y + 2} rx={10} ry={4} fill="#fbbf24" opacity={0.5}/>
                )}
                {/* Sink checkmark */}
                {sunk[i] && (
                  <text x={pos.x} y={pos.y + 10} textAnchor="middle" fontSize="14" fill="#86efac">✓</text>
                )}
                {/* Flash highlight */}
                {lastIdx === i && (
                  <ellipse cx={pos.x} cy={pos.y} rx={16} ry={8} fill="#fde68a" opacity={0.7}
                    style={{ animation: "pulse 0.5s ease-out" }}/>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Aim arrow */}
        {phase === "aim" && !done && (
          <div className="absolute flex flex-col items-center"
            style={{ left: ballStartX + 4, bottom: 50 }}>
            <div className="w-0.5 h-10 bg-white/70 rounded-full"
              style={{
                transform: `rotate(${(angle - 0.5) * -80}deg)`,
                transformOrigin: "bottom center",
              }}/>
            <div className="w-2 h-2 bg-white/80 rounded-full"/>
          </div>
        )}

        {/* Ball */}
        {!done && (
          <div
            className="absolute w-7 h-7 rounded-full shadow-lg flex items-center justify-center"
            style={{
              left: phase === "flying" ? ballLandX - 14 : ballStartX - 14,
              bottom: phase === "flying" ? 230 - ballLandY - 14 : 55,
              background: "radial-gradient(circle at 35% 35%, #f97316, #c2410c)",
              transition: phase === "flying" ? "all 0.6s cubic-bezier(.2,.9,.4,1)" : "none",
            }}>
            <span className="text-[8px] text-orange-200">●</span>
          </div>
        )}

        {/* Result flash */}
        {phase === "flying" && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
            <span className={`text-2xl font-hand font-bold animate-pop ${lastIdx !== null ? "text-yellow-300" : "text-white/70"}`}>
              {lastIdx !== null ? "SPLASH! 💦" : "MISS!"}
            </span>
          </div>
        )}
      </div>

      {/* Throw button */}
      {!done && phase === "aim" && (
        <button onClick={throwBall}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-3xl font-hand text-2xl font-bold shadow-lg hover:opacity-90 transition active:scale-95">
          🏓 Throw!
        </button>
      )}
      {!done && phase === "flying" && (
        <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-3xl font-hand text-xl text-center">
          {lastIdx !== null ? "Cup down! 🎉" : "So close..."}
        </div>
      )}

      {/* Win screen */}
      {done && (
        <div className="tape bg-white rounded-3xl p-6 text-center shadow-lg">
          <p className="text-5xl mb-2">🏆</p>
          <p className="font-hand text-3xl font-bold text-blush-dark mb-1">All cups sunk!</p>
          <p className="text-sm font-sans text-gray-500 mb-4">
            Cleared in <span className="font-bold text-blush-dark">{throws}</span> throw{throws !== 1 ? "s" : ""}!{" "}
            {throws <= 6 ? "Unreal! 🔥" : throws <= 10 ? "Nice game! 🏓" : "You got there! 💪"}
          </p>
          <button onClick={reset} className="btn-primary px-8 py-3 font-sans font-bold">
            Play Again 🏓
          </button>
        </div>
      )}

      <style>{`
        .btn-primary { background: linear-gradient(135deg,#FFB7C5,#F48FB1); color: white; border-radius: 14px; font-weight: 700; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
        @keyframes pulse { 0% { opacity:0.8; transform:scale(1); } 100% { opacity:0; transform:scale(1.5); } }
      `}</style>
    </div>
  );
}
