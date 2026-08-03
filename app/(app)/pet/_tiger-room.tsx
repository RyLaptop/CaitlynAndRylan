"use client";
import { useState, useEffect, useCallback } from "react";

type Spot = "center" | "scratchPost" | "catTree" | "window";

const SPOTS: Record<Spot, { x: number; label: string }> = {
  window:      { x: 10, label: "🪟 at the window" },
  catTree:     { x: 22, label: "🌳 on the cat tree" },
  center:      { x: 44, label: "🐾 roaming around" },
  scratchPost: { x: 70, label: "🪵 scratching the post" },
};

const SPOT_ORDER: Spot[] = ["window", "catTree", "center", "scratchPost"];

/* ─── white Siberian tiger cub SVG ─── */
function TigerSVG({ action, flipped }: { action: string; flipped: boolean }) {
  const isWalking    = action === "walk";
  const isSleeping   = action === "sleep";
  const isScratching = action === "scratch";

  return (
    <svg
      viewBox="0 0 222 200"
      width="130" height="117"
      style={{
        transform: flipped ? "scaleX(-1)" : undefined,
        transition: "transform 0.4s",
        display: "block",
        overflow: "visible",
      }}
    >
      <style>{`
        @keyframes cr-tailWag {
          0%,100% { transform: rotate(-10deg); }
          50%      { transform: rotate(13deg); }
        }
        @keyframes cr-legA {
          0%,100% { transform: rotate(-20deg); }
          50%      { transform: rotate(20deg); }
        }
        @keyframes cr-legB {
          0%,100% { transform: rotate(20deg); }
          50%      { transform: rotate(-20deg); }
        }
        @keyframes cr-bodyBob {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes cr-scratch {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes cr-zzz {
          0%   { opacity: 0; transform: translate(0px, 0px) scale(0.7); }
          35%  { opacity: 1; }
          100% { opacity: 0; transform: translate(8px, -20px) scale(1.3); }
        }
      `}</style>

      <g style={{ animation: isWalking ? "cr-bodyBob 0.55s ease-in-out infinite" : undefined }}>

        {/* ── TAIL ─────────────────────────────────────── */}
        <g style={{ transformOrigin: "44px 120px", animation: "cr-tailWag 1.1s ease-in-out infinite" }}>
          <path d="M44 120 Q15 100 13 128 Q11 154 26 151"
            stroke="#e8e4dc" strokeWidth="13" fill="none" strokeLinecap="round"/>
          <path d="M44 120 Q15 100 13 128 Q11 154 26 151"
            stroke="#2d2a26" strokeWidth="3.5" fill="none" strokeLinecap="round"
            strokeDasharray="10,14" opacity="0.75"/>
        </g>

        {/* ── BACK FAR leg (darker, behind body, legB) ── */}
        {!isScratching && (
          <g style={{ transformOrigin: "68px 152px", animation: isWalking ? "cr-legB 0.55s ease-in-out infinite" : undefined }}>
            <rect x="62" y="152" width="12" height="28" rx="6" fill="#c8c4bc"/>
            <ellipse cx="68" cy="181" rx="9" ry="5.5" fill="#b8b4ac"/>
          </g>
        )}

        {/* ── FRONT FAR leg (behind body, legA) ─────────── */}
        {!isScratching && (
          <g style={{ transformOrigin: "132px 152px", animation: isWalking ? "cr-legA 0.55s ease-in-out infinite" : undefined }}>
            <rect x="126" y="152" width="12" height="28" rx="6" fill="#c8c4bc"/>
            <ellipse cx="132" cy="181" rx="9" ry="5.5" fill="#b8b4ac"/>
          </g>
        )}

        {/* ── BODY ─────────────────────────────────────── */}
        <ellipse cx="100" cy="126" rx="57" ry="30" fill="#edeae4"/>
        {/* Belly (pure white) */}
        <ellipse cx="110" cy="136" rx="37" ry="18" fill="#faf8f5"/>
        {/* Body stripes — dark charcoal on white */}
        <path d="M76 97 Q67 110 74 126"  stroke="#2d2a26" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M95 94 Q86 107 93 123"  stroke="#2d2a26" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M113 94 Q104 107 111 123" stroke="#2d2a26" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7"/>

        {/* ── SCRATCHING ARMS ──────────────────────────── */}
        {isScratching && (
          <>
            <g style={{ animation: "cr-scratch 0.38s ease-in-out infinite" }}>
              <line x1="142" y1="156" x2="172" y2="120" stroke="#edeae4" strokeWidth="14" strokeLinecap="round"/>
              <circle cx="172" cy="120" r="9" fill="#ccc8c0"/>
              <line x1="165" y1="111" x2="172" y2="118" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
              <line x1="171" y1="109" x2="174" y2="117" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
              <line x1="177" y1="112" x2="176" y2="118" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
            </g>
            <g style={{ animation: "cr-scratch 0.38s ease-in-out infinite", animationDelay: "0.19s" }}>
              <line x1="130" y1="156" x2="158" y2="125" stroke="#ccc8c0" strokeWidth="11" strokeLinecap="round"/>
              <circle cx="158" cy="125" r="7" fill="#b8b4ac"/>
            </g>
            <rect x="62" y="152" width="12" height="28" rx="6" fill="#c8c4bc"/>
            <ellipse cx="68" cy="181" rx="9" ry="5.5" fill="#b8b4ac"/>
            <rect x="72" y="152" width="14" height="30" rx="7" fill="#edeae4"/>
            <ellipse cx="79" cy="183" rx="10" ry="6" fill="#ccc8c0"/>
          </>
        )}

        {/* ── FRONT NEAR leg (bright, legA) ─────────────── */}
        {!isScratching && (
          <g style={{ transformOrigin: "143px 152px", animation: isWalking ? "cr-legA 0.55s ease-in-out infinite" : undefined }}>
            <rect x="136" y="152" width="14" height="30" rx="7" fill="#edeae4"/>
            <ellipse cx="143" cy="183" rx="10" ry="6" fill="#ccc8c0"/>
          </g>
        )}

        {/* ── BACK NEAR leg (bright, legB) ──────────────── */}
        {!isScratching && (
          <g style={{ transformOrigin: "79px 152px", animation: isWalking ? "cr-legB 0.55s ease-in-out infinite" : undefined }}>
            <rect x="72" y="152" width="14" height="30" rx="7" fill="#edeae4"/>
            <ellipse cx="79" cy="183" rx="10" ry="6" fill="#ccc8c0"/>
          </g>
        )}

        {/* ── HEAD (big chibi circle) ───────────────────── */}
        {/* Fluffy neck/chin mane poof */}
        <ellipse cx="130" cy="112" rx="22" ry="16" fill="#edeae4" opacity="0.8"/>

        <circle cx="158" cy="82" r="50" fill="#edeae4"/>

        {/* Fluffy ear tufts (white poof behind ears) */}
        <ellipse cx="126" cy="47" rx="13" ry="11" fill="#edeae4" opacity="0.7"/>
        <ellipse cx="184" cy="42" rx="11" ry="10" fill="#edeae4" opacity="0.7"/>

        {/* Left ear */}
        <polygon points="124,59 116,24 152,51" fill="#edeae4"/>
        <polygon points="126,59 120,28 150,52" fill="#ffc8d4"/>
        {/* Right ear */}
        <polygon points="178,53 185,20 200,47" fill="#edeae4"/>
        <polygon points="179,53 186,24 198,48" fill="#ffc8d4"/>

        {/* Head stripes (few, dark, white tiger style) */}
        <path d="M140 50 Q132 63 136 76" stroke="#2d2a26" strokeWidth="3"   fill="none" strokeLinecap="round" opacity="0.65"/>
        <path d="M153 46 Q145 59 149 72" stroke="#2d2a26" strokeWidth="3"   fill="none" strokeLinecap="round" opacity="0.65"/>
        <path d="M122 78 Q114 85 118 97" stroke="#2d2a26" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
        {/* Forehead M marking (classic tiger) */}
        <path d="M148 44 Q152 38 156 44 Q160 38 164 44" stroke="#2d2a26" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>

        {/* ── EYES ─────────────────────────────────────── */}
        {!isSleeping ? (
          <>
            {/* Near eye — BIG & sparkly */}
            <circle cx="139" cy="79" r="16" fill="white"/>
            <circle cx="139" cy="79" r="12" fill="#9ad4f0"/>
            <circle cx="140" cy="79" r="8"  fill="#1a1a2e"/>
            {/* Sparkle highlights */}
            <circle cx="144" cy="74" r="3"   fill="white"/>
            <circle cx="136" cy="83" r="1.5" fill="white" opacity="0.75"/>
            {/* Far eye (partially visible) */}
            <circle cx="172" cy="76" r="11" fill="white"/>
            <circle cx="172" cy="76" r="8"  fill="#9ad4f0"/>
            <circle cx="173" cy="76" r="5"  fill="#1a1a2e"/>
            <circle cx="176" cy="73" r="2"  fill="white"/>
          </>
        ) : (
          <>
            <path d="M127 80 Q139 73 151 80" stroke="#2d2a26" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M161 77 Q171 70 181 77" stroke="#2d2a26" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </>
        )}

        {/* BIG blush marks */}
        <ellipse cx="120" cy="97" rx="18" ry="11" fill="#ffb7c5" opacity="0.62"/>
        <ellipse cx="190" cy="92" rx="12" ry="8"  fill="#ffb7c5" opacity="0.5"/>

        {/* Nose */}
        {!isSleeping && (
          <ellipse cx="200" cy="88" rx="7.5" ry="5.5" fill="#ff9eb5"/>
        )}

        {/* Mouth */}
        {!isSleeping && (
          <>
            <path d="M193 94 Q200 100 207 94" stroke="#e080a0" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <line x1="200" y1="94" x2="200" y2="99" stroke="#e080a0" strokeWidth="1.8" strokeLinecap="round"/>
          </>
        )}

        {/* Whiskers */}
        {!isSleeping && (
          <>
            <line x1="200" y1="88" x2="219" y2="82" stroke="#ccc" strokeWidth="1.3"/>
            <line x1="200" y1="91" x2="220" y2="91" stroke="#ccc" strokeWidth="1.3"/>
            <line x1="200" y1="88" x2="219" y2="96" stroke="#ccc" strokeWidth="1.3"/>
          </>
        )}

        {/* ZZZ bubbles */}
        {isSleeping && (
          <>
            <text x="202" y="62" fontSize="13" fill="#b0c4de" fontWeight="bold"
              style={{ animation: "cr-zzz 2.2s ease-in-out infinite" }}>z</text>
            <text x="211" y="44" fontSize="17" fill="#b0c4de" fontWeight="bold"
              style={{ animation: "cr-zzz 2.2s ease-in-out infinite", animationDelay: "0.75s" }}>z</text>
          </>
        )}
      </g>
    </svg>
  );
}

/* ─── room furniture ─── */
function ScratchingPost() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-6 h-6 rounded-full bg-amber-200 border-2 border-amber-300 mb-0.5"/>
      <div className="w-5 h-28 rounded-sm"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,#92400e,#92400e 4px,#b45309 4px,#b45309 9px)" }}/>
      <div className="w-16 h-4 rounded-xl bg-amber-800 mt-0.5"/>
    </div>
  );
}

function CatTree() {
  return (
    <div className="flex flex-col items-center gap-0">
      <div className="w-16 h-4 rounded-xl bg-amber-700"/>
      <div className="w-3 h-10 bg-amber-800 mx-auto"/>
      <div className="w-20 h-4 rounded-xl bg-amber-700 -mt-1"/>
      <div className="w-3 h-8 bg-amber-800 mx-auto"/>
      <div className="w-14 h-5 rounded-full bg-pink-200 border-2 border-pink-300 -mt-1"/>
      <div className="w-3 h-6 bg-amber-800 mx-auto"/>
      <div className="w-24 h-4 rounded-xl bg-amber-800"/>
    </div>
  );
}

/* ─── room ─── */
export default function TigerRoom({ onAction }: { onAction: (a: "feed" | "play" | "sleep") => void }) {
  const [spot, setSpot]             = useState<Spot>("center");
  const [targetSpot, setTargetSpot] = useState<Spot>("center");
  const [action, setAction]         = useState("idle");
  const [flipped, setFlipped]       = useState(false);
  const [posX, setPosX]             = useState(44);

  const moveTo = useCallback((nextSpot: Spot) => {
    if (nextSpot === spot) return;
    const target  = SPOTS[nextSpot];
    const current = SPOTS[spot];
    setFlipped(target.x < current.x);
    setAction("walk");
    setTargetSpot(nextSpot);
    setPosX(target.x);
  }, [spot]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSpot(targetSpot);
      if (targetSpot === "scratchPost") setAction("scratch");
      else if (targetSpot === "catTree" || targetSpot === "window") setAction("sit");
      else setAction("idle");
    }, 750);
    return () => clearTimeout(t);
  }, [targetSpot, posX]);

  useEffect(() => {
    const roam = setInterval(() => {
      moveTo(SPOT_ORDER[Math.floor(Math.random() * SPOT_ORDER.length)]);
    }, 3800);
    return () => clearInterval(roam);
  }, [moveTo]);

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-xl relative select-none" style={{ height: 320 }}>
      {/* Room bg */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#fde8d8 0%,#fde8d8 65%,#c9a882 65%,#c9a882 100%)" }}/>

      {/* Wallpaper dots */}
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-blush/20"
          style={{ top: `${5 + (i * 7) % 55}%`, left: `${3 + (i * 13) % 90}%` }}/>
      ))}

      {/* Floor rug */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-44 h-8 rounded-full opacity-55"
        style={{ background: "radial-gradient(ellipse,#f9a8d4 0%,#c4b5fd 100%)" }}/>

      {/* Window */}
      <div className="absolute top-4 left-4 w-20 h-24 bg-sky/60 rounded-lg border-4 border-amber-200 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#87CEEB 60%,#86efac 100%)" }}/>
        <div className="absolute top-2 right-3 w-6 h-6 bg-yellow-300 rounded-full shadow"/>
        <div className="absolute top-0 left-0 w-4 h-full bg-pink-200/70 rounded-br-xl"/>
        <div className="absolute top-0 right-0 w-4 h-full bg-pink-200/70 rounded-bl-xl"/>
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-200/80"/>
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-200/80"/>
      </div>

      {/* Cat tree */}
      <div className="absolute bottom-14 left-6"><CatTree/></div>

      {/* Scratching post */}
      <div className="absolute bottom-14 right-6"><ScratchingPost/></div>

      {/* Tiger */}
      <div className="absolute bottom-14 transition-all duration-700 ease-in-out"
        style={{ left: `${posX}%`, transform: "translateX(-50%)" }}>
        <TigerSVG action={action} flipped={flipped}/>
      </div>

      <div className="absolute bottom-14 left-0 right-0 h-0.5 bg-amber-900/20"/>
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-xs font-sans text-amber-900/60">{SPOTS[spot].label}</span>
      </div>

      {/* Action buttons */}
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
