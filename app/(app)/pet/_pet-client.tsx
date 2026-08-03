"use client";
import { useState, useTransition } from "react";
import TigerRoom from "./_tiger-room";
import { petAction } from "./actions";

type Stats = { hunger: number; happiness: number; energy: number };

function StatBar({ value, color, label, emoji }: { value: number; color: string; label: string; emoji: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-sans text-gray-500 mb-1.5">
        <span>{emoji} {label}</span><span>{value}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }}/>
      </div>
    </div>
  );
}

function getMoodText(hunger: number, happiness: number, energy: number) {
  const avg = (hunger + happiness + energy) / 3;
  if (avg >= 75) return "happy & playful! 🎉";
  if (avg >= 50) return "doing okay~";
  if (avg >= 25) return "needs some love…";
  return "please take care of me! 😿";
}

export default function PetClient({ initialStats, lastBy, lastAction: lastAct }: {
  initialStats: Stats;
  lastBy: string | null;
  lastAction: string | null;
}) {
  const [stats, setStats] = useState(initialStats);
  const [pending, startTransition] = useTransition();
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const handle = (action: "feed" | "play" | "sleep") => {
    startTransition(async () => {
      await petAction(action);
      if (action === "feed") {
        setStats((s) => ({ ...s, hunger: clamp(s.hunger + 30) }));
        setActionMsg("Stripes ate happily! 🍗");
      } else if (action === "play") {
        setStats((s) => ({ ...s, happiness: clamp(s.happiness + 25), energy: clamp(s.energy - 15) }));
        setActionMsg("Stripes had a blast! 🎾");
      } else {
        setStats((s) => ({ ...s, energy: clamp(s.energy + 40) }));
        setActionMsg("Stripes is napping… 💤");
      }
      setTimeout(() => setActionMsg(null), 2500);
    });
  };

  return (
    <div>
      <TigerRoom onAction={handle} />

      {actionMsg && (
        <div className="text-center mt-3 animate-pop">
          <span className="bg-blush/20 text-blush-dark text-sm font-sans font-semibold px-4 py-2 rounded-full">
            {actionMsg}
          </span>
        </div>
      )}

      <p className="text-center font-hand text-xl text-gray-600 mt-3">
        {getMoodText(stats.hunger, stats.happiness, stats.energy)}
      </p>
      {lastBy && (
        <p className="text-center text-xs text-gray-400 font-sans mb-4">
          last cared for by {lastBy}
        </p>
      )}

      <div className="tape bg-white rounded-3xl p-5 shadow-sm mt-4 flex flex-col gap-4">
        <StatBar value={stats.hunger}    color="bg-peach"  label="Hunger"    emoji="🍗"/>
        <StatBar value={stats.happiness} color="bg-blush"  label="Happiness" emoji="💕"/>
        <StatBar value={stats.energy}    color="bg-mint"   label="Energy"    emoji="⚡"/>
      </div>

      <p className="text-xs text-gray-400 font-sans text-center mt-4 mb-8">
        Both of you share Stripes — tap the buttons in the room to care for her! 🐾
      </p>
    </div>
  );
}
