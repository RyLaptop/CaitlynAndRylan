"use client";
import { useState } from "react";
import ideas from "@/data/date-night-ideas.json";

const vibes = ["all", "cozy", "romantic", "fun"] as const;
type Vibe = typeof vibes[number];

export default function DateNightPage() {
  const [vibe, setVibe] = useState<Vibe>("all");
  const [picked, setPicked] = useState<typeof ideas[0] | null>(null);
  const [spinning, setSpinning] = useState(false);

  const pool = vibe === "all" ? ideas : ideas.filter((i) => i.vibe === vibe);

  const spin = () => {
    setSpinning(true);
    setPicked(null);
    let count = 0;
    const interval = setInterval(() => {
      setPicked(pool[Math.floor(Math.random() * pool.length)]);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 80);
  };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-hand text-4xl text-blush-dark font-bold">Date Night 🌙</h1>
        <p className="text-sm text-gray-500 font-sans mt-1">can't decide? let fate choose</p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {vibes.map((v) => (
          <button key={v} onClick={() => setVibe(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-sans font-semibold capitalize transition ${vibe === v ? "bg-blush text-white" : "bg-cream text-gray-500 hover:bg-blush/20"}`}>
            {v === "all" ? "✨ All" : v === "cozy" ? "🛋️ Cozy" : v === "romantic" ? "💕 Romantic" : "🎉 Fun"}
          </button>
        ))}
      </div>

      <div className="tape bg-white rounded-3xl shadow-lg p-8 text-center min-h-[200px] flex flex-col items-center justify-center mt-4 mb-6">
        {picked ? (
          <div className={spinning ? "opacity-60" : "animate-pop"}>
            <p className="text-5xl mb-3">{picked.emoji}</p>
            <p className="font-hand text-3xl text-gray-700 font-bold">{picked.title}</p>
            <p className="text-sm text-gray-500 font-sans mt-2 leading-relaxed">{picked.desc}</p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-sans font-semibold capitalize ${picked.vibe === "cozy" ? "bg-sky/30 text-sky-800" : picked.vibe === "romantic" ? "bg-blush/30 text-blush-dark" : "bg-mint/30 text-green-800"}`}>
              {picked.vibe}
            </span>
          </div>
        ) : (
          <div className="text-gray-300">
            <p className="text-5xl">🌙</p>
            <p className="font-sans text-sm mt-2">Press spin to find your date!</p>
          </div>
        )}
      </div>

      <button onClick={spin} disabled={spinning}
        className="w-full py-4 bg-gradient-to-r from-blush to-lavender text-white rounded-3xl font-hand text-2xl font-bold shadow-lg hover:opacity-90 transition disabled:opacity-60">
        {spinning ? "✨ Spinning…" : "✨ Spin!"}
      </button>

      <div className="mt-8">
        <h2 className="font-hand text-2xl text-gray-600 mb-3">All Ideas</h2>
        <div className="flex flex-col gap-2">
          {pool.map((idea) => (
            <div key={idea.id} onClick={() => setPicked(idea)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-blush/20 cursor-pointer hover:border-blush/50 transition">
              <span className="text-2xl">{idea.emoji}</span>
              <div className="flex-1">
                <p className="font-sans font-semibold text-sm text-gray-700">{idea.title}</p>
                <p className="text-xs text-gray-400 font-sans">{idea.desc.slice(0, 50)}…</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
