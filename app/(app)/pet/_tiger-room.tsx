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

function TigerSVG({ action, flipped }: { action: string; flipped: boolean }) {
  const isWalking  = action === "walk";
  const isSleeping = action === "sleep";
  const isScratching = action === "scratch";

  return (
    <svg
      viewBox="0 0 215 205"
      width="120" height="115"
      style={{
        transform: flipped ? "scaleX(-1)" : undefined,
        transition: "transform 0.4s",
        display: "block",
        overflow: "visible",
      }}
    >
      <style>{`
        @keyframes cr-tailWag {
          0%,100% { transform: rotate(-9deg); }
          50%      { transform: rotate(11deg); }
        }
        @keyframes cr-legA {
          0%,100% { transform: rotate(-19deg); }
          50%      { transform: rotate(19deg); }
        }
        @keyframes cr-legB {
          0%,100% { transform: rotate(19deg); }
          50%      { transform: rotate(-19deg); }
        }
        @keyframes cr-bodyBob {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes cr-scratchArm {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes cr-zzz {
          0%   { opacity: 0; transform: translate(0px,0px) scale(0.7); }
          35%  { opacity: 1; }
          100% { opacity: 0; transform: translate(7px,-18px) scale(1.25); }
        }
      `}</style>

      <g style={{ animation: isWalking ? "cr-bodyBob 0.55s ease-in-out infinite" : undefined }}>

        {/* === TAIL (pivot at body left edge ~x44 y122) === */}
        <g style={{ transformOrigin: "44px 122px", animation: "cr-tailWag 1.1s ease-in-out infinite" }}>
          <path d="M44 122 Q16 102 14 128 Q12 153 26 151"
            stroke="#f5b04a" strokeWidth="11" fill="none" strokeLinecap="round"/>
          <path d="M44 122 Q16 102 14 128 Q12 153 26 151"
            stroke="#6b3a15" strokeWidth="3" fill="none" strokeLinecap="round"
            strokeDasharray="8,12" opacity="0.65"/>
        </g>

        {/* === BACK FAR leg (darker, behind body) — legB phase === */}
        {!isScratching && (
          <g style={{ transformOrigin: "68px 154px", animation: isWalking ? "cr-legB 0.55s ease-in-out infinite" : undefined }}>
            <rect x="62" y="154" width="12" height="33" rx="6" fill="#c87820"/>
            <ellipse cx="68" cy="188" rx="9" ry="5" fill="#a86010"/>
          </g>
        )}

        {/* === FRONT FAR leg (darker, behind body) — legA phase === */}
        {!isScratching && (
          <g style={{ transformOrigin: "132px 154px", animation: isWalking ? "cr-legA 0.55s ease-in-out infinite" : undefined }}>
            <rect x="126" y="154" width="12" height="33" rx="6" fill="#c87820"/>
            <ellipse cx="132" cy="188" rx="9" ry="5" fill="#a86010"/>
          </g>
        )}

        {/* === BODY === */}
        <ellipse cx="100" cy="126" rx="58" ry="28" fill="#f5b04a"/>
        {/* Belly */}
        <ellipse cx="110" cy="136" rx="36" ry="16" fill="#fde8c8"/>
        {/* Body stripes */}
        <path d="M74 100 Q65 112 72 126" stroke="#6b3a15" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M93  97 Q84 109 91 123" stroke="#6b3a15" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M111 97 Q102 109 109 123" stroke="#6b3a15" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.7"/>

        {/* === SCRATCHING ARMS (front legs reaching forward-up) === */}
        {isScratching && (
          <>
            <g style={{ transformOrigin: "142px 154px", animation: "cr-scratchArm 0.38s ease-in-out infinite" }}>
              <line x1="142" y1="158" x2="170" y2="122" stroke="#f5b04a" strokeWidth="13" strokeLinecap="round"/>
              <circle cx="170" cy="122" r="9" fill="#e09030"/>
              <line x1="164" y1="113" x2="170" y2="120" stroke="#fffde0" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="170" y1="111" x2="172" y2="119" stroke="#fffde0" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="175" y1="114" x2="174" y2="120" stroke="#fffde0" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
            <g style={{ transformOrigin: "132px 154px", animation: "cr-scratchArm 0.38s ease-in-out infinite", animationDelay: "0.19s" }}>
              <line x1="132" y1="158" x2="158" y2="126" stroke="#d88830" strokeWidth="11" strokeLinecap="round"/>
              <circle cx="158" cy="126" r="7" fill="#b86820"/>
            </g>
            {/* Back legs stay planted */}
            <rect x="62"  y="154" width="12" height="33" rx="6" fill="#c87820"/>
            <ellipse cx="68"  cy="188" rx="9" ry="5" fill="#a86010"/>
            <rect x="72"  y="154" width="14" height="35" rx="7" fill="#f5b04a"/>
            <ellipse cx="79"  cy="190" rx="10" ry="6" fill="#e09030"/>
          </>
        )}

        {/* === FRONT NEAR leg (bright, in front of body) — legA phase === */}
        {!isScratching && (
          <g style={{ transformOrigin: "143px 154px", animation: isWalking ? "cr-legA 0.55s ease-in-out infinite" : undefined }}>
            <rect x="136" y="154" width="14" height="35" rx="7" fill="#f5b04a"/>
            <ellipse cx="143" cy="190" rx="10" ry="6" fill="#e09030"/>
          </g>
        )}

        {/* === BACK NEAR leg (bright, in front of body) — legB phase === */}
        {!isScratching && (
          <g style={{ transformOrigin: "79px 154px", animation: isWalking ? "cr-legB 0.55s ease-in-out infinite" : undefined }}>
            <rect x="72" y="154" width="14" height="35" rx="7" fill="#f5b04a"/>
            <ellipse cx="79" cy="190" rx="10" ry="6" fill="#e09030"/>
          </g>
        )}

        {/* === HEAD (circle, attached to front/right of body) === */}
        <circle cx="156" cy="84" r="42" fill="#f5b04a"/>

        {/* Left ear */}
        <polygon points="130,56 122,26 152,50" fill="#f5b04a"/>
        <polygon points="131,57 126,30 150,51" fill="#ffb7c5"/>
        {/* Right ear */}
        <polygon points="174,51 180,22 196,46" fill="#f5b04a"/>
        <polygon points="175,52 181,27 193,47" fill="#ffb7c5"/>

        {/* Head stripes */}
        <path d="M138 50 Q130 60 134 72" stroke="#6b3a15" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M151 46 Q143 56 147 68" stroke="#6b3a15" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M126 74 Q118 80 122 92" stroke="#6b3a15" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.6"/>

        {/* === EYES === */}
        {!isSleeping ? (
          <>
            {/* Main near eye (left from viewer) */}
            <circle cx="140" cy="80" r="13" fill="white"/>
            <circle cx="140" cy="80" r="9"  fill="#87CEEB"/>
            <circle cx="141" cy="80" r="6"  fill="#1a1a2e"/>
            <circle cx="143" cy="77" r="2.2" fill="white"/>
            {/* Far eye (partially visible) */}
            <circle cx="168" cy="77" r="9"   fill="white"/>
            <circle cx="168" cy="77" r="6.5" fill="#87CEEB"/>
            <circle cx="169" cy="77" r="4"   fill="#1a1a2e"/>
            <circle cx="171" cy="75" r="1.5" fill="white"/>
          </>
        ) : (
          <>
            <path d="M130 80 Q140 74 150 80" stroke="#6b3a15" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M159 77 Q167 71 175 77" stroke="#6b3a15" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </>
        )}

        {/* Cheek blushes */}
        <ellipse cx="126" cy="93" rx="13" ry="8" fill="#ffb7c5" opacity="0.55"/>
        <ellipse cx="183" cy="90" rx="9"  ry="6" fill="#ffb7c5" opacity="0.45"/>

        {/* Nose */}
        {!isSleeping && <ellipse cx="193" cy="89" rx="7" ry="5" fill="#ffb7c5"/>}

        {/* Mouth */}
        {!isSleeping && (
          <>
            <path d="M187 94 Q193 99 199 94" stroke="#cc8888" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <line x1="193" y1="94" x2="193" y2="99" stroke="#cc8888" strokeWidth="1.5" strokeLinecap="round"/>
          </>
        )}

        {/* Whiskers (extend right toward nose direction) */}
        {!isSleeping && (
          <>
            <line x1="192" y1="89" x2="212" y2="84" stroke="#ccc" strokeWidth="1.2"/>
            <line x1="192" y1="92" x2="213" y2="92" stroke="#ccc" strokeWidth="1.2"/>
            <line x1="192" y1="89" x2="212" y2="94" stroke="#ccc" strokeWidth="1.2"/>
          </>
        )}

        {/* ZZZ floating when sleeping */}
        {isSleeping && (
          <>
            <text x="196" y="64" fontSize="13" fill="#b0c4de" fontWeight="bold"
              style={{ animation: "cr-zzz 2.2s ease-in-out infinite" }}>z</text>
            <text x="205" y="47" fontSize="17" fill="#b0c4de" fontWeight="bold"
              style={{ animation: "cr-zzz 2.2s ease-in-out infinite", animationDelay: "0.75s" }}>z</text>
          </>
        )}
      </g>
    </svg>
  );
}

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
      const idx = Math.floor(Math.random() * SPOT_ORDER.length);
      moveTo(SPOT_ORDER[idx]);
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

      {/* Window top-left */}
      <div className="absolute top-4 left-4 w-20 h-24 bg-sky/60 rounded-lg border-4 border-amber-200 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#87CEEB 60%,#86efac 100%)" }}/>
        <div className="absolute top-2 right-3 w-6 h-6 bg-yellow-300 rounded-full shadow"/>
        <div className="absolute top-0 left-0 w-4 h-full bg-pink-200/70 rounded-br-xl"/>
        <div className="absolute top-0 right-0 w-4 h-full bg-pink-200/70 rounded-bl-xl"/>
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-200/80"/>
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-200/80"/>
      </div>

      {/* Cat tree left */}
      <div className="absolute bottom-14 left-6">
        <CatTree/>
      </div>

      {/* Scratching post right */}
      <div className="absolute bottom-14 right-6">
        <ScratchingPost/>
      </div>

      {/* Tiger */}
      <div className="absolute bottom-14 transition-all duration-700 ease-in-out"
        style={{ left: `${posX}%`, transform: "translateX(-50%)" }}>
        <TigerSVG action={action} flipped={flipped}/>
      </div>

      {/* Floor line */}
      <div className="absolute bottom-14 left-0 right-0 h-0.5 bg-amber-900/20"/>

      {/* Spot label */}
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
