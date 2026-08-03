"use client";
import { useState, useEffect, useCallback } from "react";

type Spot = "center" | "scratchPost" | "catTree" | "window";

const SPOTS: Record<Spot, { x: number; label: string }> = {
  window:      { x: 12,  label: "🪟 at the window" },
  catTree:     { x: 18,  label: "🌳 on the cat tree" },
  center:      { x: 42,  label: "🐾 in the middle" },
  scratchPost: { x: 70,  label: "🪵 at the scratching post" },
};

const SPOT_ORDER: Spot[] = ["window", "catTree", "center", "scratchPost"];

function TigerSVG({ action, flipped }: { action: string; flipped: boolean }) {
  const isScratching = action === "scratch";
  const isSleeping = action === "sleep";
  const isWalking = action === "walk";
  const isSitting = action === "sit";

  return (
    <svg viewBox="0 0 200 220" width="100" height="110"
      style={{ transform: flipped ? "scaleX(-1)" : undefined, transition: "transform 0.3s" }}>

      {/* Tail */}
      {!isSleeping && (
        <path d="M145 170 Q175 155 172 185 Q168 205 152 200"
          stroke="#d4c8b0" strokeWidth="13" fill="none" strokeLinecap="round"
          style={{ transformOrigin: "145px 170px", animation: "tailWag 1.2s ease-in-out infinite" }}/>
      )}
      {!isSleeping && (
        <path d="M145 170 Q175 155 172 185 Q168 205 152 200"
          stroke="#8a7a5a" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="9,12"
          style={{ transformOrigin: "145px 170px", animation: "tailWag 1.2s ease-in-out infinite" }}/>
      )}

      {/* Body */}
      <ellipse cx="100" cy="160" rx={isSleeping ? 65 : 50} ry={isSleeping ? 30 : 55} fill="#e8e0cc"/>

      {/* Belly */}
      <ellipse cx="100" cy={isSleeping ? 160 : 168} rx={isSleeping ? 40 : 28} ry={isSleeping ? 18 : 35} fill="#f8f4ee"/>

      {/* Body stripes */}
      {!isSleeping && <>
        <path d="M58 130 Q48 145 60 158" stroke="#7a6a4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <path d="M56 152 Q46 167 58 178" stroke="#7a6a4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <path d="M142 130 Q152 145 140 158" stroke="#7a6a4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <path d="M144 152 Q154 167 142 178" stroke="#7a6a4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      </>}

      {/* Legs */}
      {!isSleeping && !isScratching && (
        <>
          <rect x={isWalking ? "63" : "65"} y="198" width="20" height="22" rx="10" fill="#e8e0cc"/>
          <rect x={isWalking ? "117" : "115"} y="198" width="20" height="22" rx="10" fill="#e8e0cc"/>
          <ellipse cx={isWalking ? "73" : "75"} cy="221" rx="13" ry="7" fill="#ddd5bd"/>
          <ellipse cx={isWalking ? "127" : "125"} cy="221" rx="13" ry="7" fill="#ddd5bd"/>
        </>
      )}
      {isScratching && (
        <>
          {/* Arms reaching up */}
          <rect x="55" y="145" width="18" height="45" rx="9" fill="#e8e0cc" transform="rotate(-30 64 168)"/>
          <rect x="127" y="145" width="18" height="45" rx="9" fill="#e8e0cc" transform="rotate(20 136 168)"/>
          <rect x="70" y="200" width="18" height="20" rx="9" fill="#e8e0cc"/>
          <rect x="112" y="200" width="18" height="20" rx="9" fill="#e8e0cc"/>
        </>
      )}

      {/* HEAD */}
      <circle cx="100" cy={isSleeping ? 148 : 78} r="44" fill="#e8e0cc"/>

      {/* Ears */}
      {!isSleeping && (
        <>
          <polygon points="62,46 50,16 80,38" fill="#e8e0cc"/>
          <polygon points="64,46 55,22 78,40" fill="#f9c0c8"/>
          <polygon points="138,46 150,16 120,38" fill="#e8e0cc"/>
          <polygon points="136,46 145,22 122,40" fill="#f9c0c8"/>
        </>
      )}

      {/* Head stripes */}
      {!isSleeping && (
        <>
          <path d="M80 44 Q76 30 80 20" stroke="#7a6a4a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M91 40 Q89 26 91 16" stroke="#7a6a4a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M120 44 Q124 30 120 20" stroke="#7a6a4a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M109 40 Q111 26 109 16" stroke="#7a6a4a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M74 68 Q68 60 74 54" stroke="#7a6a4a" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M126 68 Q132 60 126 54" stroke="#7a6a4a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      )}

      {/* Eyes */}
      {!isSleeping ? (
        <>
          <circle cx="78" cy="76" r="12" fill="white"/>
          <circle cx="122" cy="76" r="12" fill="white"/>
          <circle cx="78" cy="76" r="8" fill="#87CEEB"/>
          <circle cx="122" cy="76" r="8" fill="#87CEEB"/>
          <circle cx="80" cy="76" r="5" fill="#1a1a2e"/>
          <circle cx="124" cy="76" r="5" fill="#1a1a2e"/>
          <circle cx="83" cy="73" r="2" fill="white"/>
          <circle cx="127" cy="73" r="2" fill="white"/>
        </>
      ) : (
        <>
          <path d="M68 148 Q78 144 88 148" stroke="#7a6a4a" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M112 148 Q122 144 132 148" stroke="#7a6a4a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      )}

      {/* Cheeks */}
      <ellipse cx="62" cy="90" rx="14" ry="9" fill="#f5e8e8" opacity="0.7"/>
      <ellipse cx="138" cy="90" rx="14" ry="9" fill="#f5e8e8" opacity="0.7"/>

      {/* Nose */}
      {!isSleeping && <ellipse cx="100" cy="97" rx="7" ry="5" fill="#ffb7c5"/>}

      {/* Mouth */}
      {!isSleeping && (
        <>
          <path d="M94 102 Q100 108 106 102" stroke="#999" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <line x1="100" y1="102" x2="100" y2="107" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )}

      {/* Whiskers */}
      {!isSleeping && (
        <>
          <line x1="62" y1="93" x2="32" y2="87" stroke="#bbb" strokeWidth="1.2"/>
          <line x1="62" y1="98" x2="30" y2="98" stroke="#bbb" strokeWidth="1.2"/>
          <line x1="138" y1="93" x2="168" y2="87" stroke="#bbb" strokeWidth="1.2"/>
          <line x1="138" y1="98" x2="170" y2="98" stroke="#bbb" strokeWidth="1.2"/>
        </>
      )}

      {/* ZZZ when sleeping */}
      {isSleeping && (
        <text x="148" y="120" fontSize="18" fill="#b0c4de" fontWeight="bold" opacity="0.8">z</text>
      )}

      <style>{`
        @keyframes tailWag {
          0%,100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
      `}</style>
    </svg>
  );
}

function ScratchingPost() {
  return (
    <div className="flex flex-col items-center">
      {/* top ball */}
      <div className="w-5 h-5 rounded-full bg-amber-200 border-2 border-amber-300 mb-0.5"/>
      {/* rope post */}
      <div className="w-5 h-32 rounded-sm relative overflow-hidden bg-amber-700"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #92400e, #92400e 4px, #b45309 4px, #b45309 8px)" }}/>
      {/* base */}
      <div className="w-16 h-4 rounded-xl bg-amber-800 mt-0.5"/>
    </div>
  );
}

function CatTree() {
  return (
    <div className="flex flex-col items-center gap-0">
      {/* top platform */}
      <div className="w-16 h-4 rounded-xl bg-amber-700"/>
      <div className="w-3 h-10 bg-amber-800 mx-auto"/>
      {/* mid platform */}
      <div className="w-20 h-4 rounded-xl bg-amber-700 -mt-1"/>
      <div className="w-3 h-8 bg-amber-800 mx-auto"/>
      {/* hammock */}
      <div className="w-14 h-5 rounded-full bg-pink-200 border-2 border-pink-300 -mt-1"/>
      <div className="w-3 h-6 bg-amber-800 mx-auto"/>
      {/* base */}
      <div className="w-24 h-4 rounded-xl bg-amber-800"/>
    </div>
  );
}

export default function TigerRoom({ onAction }: { onAction: (a: "feed"|"play"|"sleep") => void }) {
  const [spot, setSpot] = useState<Spot>("center");
  const [targetSpot, setTargetSpot] = useState<Spot>("center");
  const [action, setAction] = useState("idle");
  const [flipped, setFlipped] = useState(false);
  const [posX, setPosX] = useState(42);

  const moveTo = useCallback((nextSpot: Spot) => {
    const target = SPOTS[nextSpot];
    const current = SPOTS[spot];
    if (nextSpot === spot) return;
    setFlipped(target.x < current.x);
    setAction("walk");
    setTargetSpot(nextSpot);
    setPosX(target.x);
  }, [spot]);

  useEffect(() => {
    const arriveTimer = setTimeout(() => {
      setSpot(targetSpot);
      if (targetSpot === "scratchPost") setAction("scratch");
      else if (targetSpot === "catTree") setAction("sit");
      else if (targetSpot === "window") setAction("sit");
      else setAction("idle");
    }, 800);
    return () => clearTimeout(arriveTimer);
  }, [targetSpot, posX]);

  useEffect(() => {
    const roam = setInterval(() => {
      const idx = Math.floor(Math.random() * SPOT_ORDER.length);
      moveTo(SPOT_ORDER[idx]);
    }, 4000);
    return () => clearInterval(roam);
  }, [moveTo]);

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-xl relative select-none" style={{ height: 320 }}>
      {/* Room walls */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #fde8d8 0%, #fde8d8 65%, #c8a882 65%, #c8a882 100%)" }}/>

      {/* Wallpaper dots */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-blush/20"
          style={{ top: `${5 + (i * 7) % 55}%`, left: `${3 + (i * 11) % 90}%` }}/>
      ))}

      {/* Floor rug */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-40 h-8 rounded-full opacity-60"
        style={{ background: "radial-gradient(ellipse, #f9a8d4 0%, #c4b5fd 100%)" }}/>

      {/* Window */}
      <div className="absolute top-4 left-4 w-20 h-24 bg-sky/60 rounded-lg border-4 border-amber-200 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #87CEEB 60%, #86efac 100%)" }}/>
        {/* sun */}
        <div className="absolute top-2 right-3 w-6 h-6 bg-yellow-300 rounded-full shadow-lg"/>
        {/* curtains */}
        <div className="absolute top-0 left-0 w-4 h-full bg-pink-200/70 rounded-br-xl"/>
        <div className="absolute top-0 right-0 w-4 h-full bg-pink-200/70 rounded-bl-xl"/>
        {/* window frame cross */}
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-200/80"/>
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-200/80"/>
      </div>

      {/* Cat tree - left */}
      <div className="absolute bottom-14 left-6">
        <CatTree />
      </div>

      {/* Scratching post - right */}
      <div className="absolute bottom-14 right-6">
        <ScratchingPost />
      </div>

      {/* Tiger - positioned by posX% */}
      <div className="absolute bottom-14 transition-all duration-700 ease-in-out"
        style={{ left: `${posX}%`, transform: "translateX(-50%)" }}>
        <TigerSVG action={action} flipped={flipped} />
      </div>

      {/* Floor line */}
      <div className="absolute bottom-14 left-0 right-0 h-0.5 bg-amber-900/20"/>

      {/* Action label */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-xs font-sans text-amber-900/60">{SPOTS[spot].label}</span>
      </div>

      {/* Action buttons overlay */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        <button onClick={() => onAction("feed")}
          className="w-9 h-9 bg-white/80 backdrop-blur rounded-full text-lg flex items-center justify-center shadow hover:scale-110 transition">🍗</button>
        <button onClick={() => onAction("play")}
          className="w-9 h-9 bg-white/80 backdrop-blur rounded-full text-lg flex items-center justify-center shadow hover:scale-110 transition">🎾</button>
        <button onClick={() => onAction("sleep")}
          className="w-9 h-9 bg-white/80 backdrop-blur rounded-full text-lg flex items-center justify-center shadow hover:scale-110 transition">💤</button>
      </div>
    </div>
  );
}
