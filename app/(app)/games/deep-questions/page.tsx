"use client";
import { useState } from "react";
import Link from "next/link";
import data from "@/data/deep-questions.json";

const cats = Object.keys(data.categories) as (keyof typeof data.categories)[];
const allQ = cats.flatMap((c) => data.categories[c]);

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DeepQuestionsPage() {
  const [cat, setCat] = useState<keyof typeof data.categories | "All">("All");
  const [pool, setPool] = useState<string[]>(() => shuffle(allQ));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const questions = cat === "All" ? pool : data.categories[cat];
  const q = questions[idx % questions.length];

  const next = () => {
    setFlipped(false);
    setTimeout(() => setIdx((i) => i + 1), 150);
  };

  const changecat = (c: typeof cat) => {
    setCat(c);
    setIdx(0);
    setFlipped(false);
    if (c === "All") setPool(shuffle(allQ));
  };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-xl">‹</Link>
        <h1 className="font-hand text-3xl text-blush-dark font-bold">Deep Questions 💬</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(["All", ...cats] as const).map((c) => (
          <button key={c} onClick={() => changecat(c)}
            className={`px-3 py-1 rounded-full text-xs font-sans font-semibold transition ${cat === c ? "bg-blush text-white" : "bg-cream text-gray-500 hover:bg-blush/20"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div onClick={() => setFlipped(!flipped)}
          className="tape bg-white rounded-3xl shadow-lg p-8 w-full text-center cursor-pointer min-h-[180px] flex flex-col items-center justify-center mt-4 hover:shadow-xl transition-shadow active:scale-[0.98] transition-transform">
          <p className={`font-hand text-2xl text-gray-700 font-bold leading-snug transition-opacity duration-150 ${flipped ? "opacity-100" : "opacity-100"}`}>
            {q}
          </p>
          <p className="text-xs text-gray-400 mt-4 font-sans">tap to reflect</p>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button onClick={() => { setIdx((i) => (i - 1 + questions.length) % questions.length); setFlipped(false); }}
            className="w-12 h-12 rounded-full bg-cream text-gray-500 text-xl flex items-center justify-center hover:bg-blush/20 transition">
            ‹
          </button>
          <p className="text-xs text-gray-400 font-sans">{(idx % questions.length) + 1} / {questions.length}</p>
          <button onClick={next}
            className="w-12 h-12 rounded-full bg-blush/20 text-blush-dark text-xl flex items-center justify-center hover:bg-blush/30 transition">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
