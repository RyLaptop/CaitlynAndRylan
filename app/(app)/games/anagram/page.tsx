"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

const words = [
  { word: "HEART", hint: "💕 What we share" },
  { word: "TIGER", hint: "🐯 Stripes!" },
  { word: "BLUSH", hint: "🌸 What you make me do" },
  { word: "DREAM", hint: "💭 About you" },
  { word: "SWEET", hint: "✨ That's you" },
  { word: "FLAME", hint: "🔥 Us" },
  { word: "TULIP", hint: "🌷 For Caitlyn" },
  { word: "SPARK", hint: "⚡ That feeling" },
  { word: "MAPLE", hint: "🍁 Fall vibes" },
  { word: "NIGHT", hint: "🌙 When we call" },
];

function scramble(w: string) {
  const a = w.split("");
  let s = w;
  while (s === w) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    s = a.join("");
  }
  return s;
}

export default function AnagramPage() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * words.length));
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "wrong">("playing");

  const current = words[idx];
  const anagram = useMemo(() => scramble(current.word), [idx]);

  const check = () => {
    if (guess.toUpperCase() === current.word) setStatus("won");
    else { setStatus("wrong"); setTimeout(() => setStatus("playing"), 600); }
  };

  const next = () => {
    setIdx((i) => (i + 1) % words.length);
    setGuess("");
    setStatus("playing");
  };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-xl">‹</Link>
        <h1 className="font-hand text-3xl text-blush-dark font-bold">Anagram 🔤</h1>
      </div>

      <div className="tape bg-white rounded-3xl shadow-lg p-6 text-center mt-4">
        <p className="text-xs text-gray-400 font-sans mb-2">Unscramble this word</p>
        <p className="font-hand text-5xl text-blush-dark font-bold tracking-widest mb-2">{anagram}</p>
        <p className="text-sm text-gray-500 font-sans italic">{current.hint}</p>
      </div>

      {status === "won" ? (
        <div className="mt-6 text-center animate-pop">
          <p className="text-4xl">🎉</p>
          <p className="font-hand text-3xl text-blush-dark font-bold">Yes! {current.word}</p>
          <button onClick={next} className="btn-primary px-8 py-2.5 mt-4 font-sans">Next Word</button>
        </div>
      ) : (
        <div className={`mt-6 flex flex-col items-center gap-3 ${status === "wrong" ? "animate-shake" : ""}`}>
          <input value={guess} onChange={(e) => setGuess(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && check()}
            maxLength={5} placeholder="Your answer..."
            className="input-field text-center text-xl uppercase tracking-widest font-hand max-w-xs" />
          <button onClick={check} disabled={guess.length === 0} className="btn-primary px-8 py-2.5 font-sans disabled:opacity-40">
            Check
          </button>
          {status === "wrong" && <p className="text-red-400 text-sm font-sans">Try again! 💪</p>}
        </div>
      )}

      <style>{`
        .input-field { width: 100%; padding: 10px 14px; border: 2px solid #f0e0e8; border-radius: 12px; font-size: 1.2rem; outline: none; background: #fff8f0; }
        .input-field:focus { border-color: #FFB7C5; }
        .btn-primary { padding: 11px; background: linear-gradient(135deg, #FFB7C5, #F48FB1); color: white; border-radius: 14px; font-weight: 700; font-size: 0.95rem; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
