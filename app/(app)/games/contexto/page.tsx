"use client";
import { useState } from "react";
import Link from "next/link";

const SECRET_WORDS = [
  { word: "LOVE", words: ["heart","us","feel","care","sweet","warm","hug","kiss","bond","soul","adore","glow","cherish","embrace","devotion","affection","tender","passion","delight","forever","joy","together","trust","bliss","connection","romance","dream","soft","pure","gentle"] },
  { word: "HOME", words: ["cozy","safe","warm","family","bed","roof","door","kitchen","rest","comfort","belong","shelter","walls","light","peace","nest","haven","living","hearth","room","welcome","settle","return","place","familiar","retreat","anchor","together","calm","inside"] },
  { word: "NIGHT", words: ["moon","stars","sleep","dark","dream","quiet","late","sky","owl","silence","rest","calm","still","glow","cool","deep","soft","dusk","hour","shadow","wonder","lamp","pillow","hush","cozy","twinkle","slumber","serene","peaceful","midnight"] },
];

function getSimilarity(guess: string, target: string, wordList: string[]): number {
  const g = guess.toLowerCase();
  const t = target.toLowerCase();
  if (g === t) return 1;
  const idx = wordList.indexOf(g);
  if (idx === -1) return -1;
  return 1 - (idx + 1) / wordList.length;
}

function getColor(sim: number) {
  if (sim >= 0.8) return "bg-green-200 text-green-800";
  if (sim >= 0.5) return "bg-yellow-100 text-yellow-800";
  if (sim >= 0.2) return "bg-orange-100 text-orange-800";
  return "bg-gray-100 text-gray-600";
}

export default function ContextoPage() {
  const [secretIdx] = useState(() => Math.floor(Math.random() * SECRET_WORDS.length));
  const secret = SECRET_WORDS[secretIdx];
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<{ word: string; sim: number; rank: number }[]>([]);
  const [won, setWon] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const guess = () => {
    const w = input.trim().toUpperCase();
    if (!w || guesses.find((g) => g.word === w)) { setInput(""); return; }

    if (w === secret.word) {
      setGuesses([{ word: w, sim: 1, rank: 0 }, ...guesses]);
      setWon(true);
      setInput("");
      return;
    }

    const rank = secret.words.indexOf(w.toLowerCase());
    const sim = rank === -1 ? -1 : 1 - (rank + 1) / secret.words.length;

    if (sim === -1) { setNotFound(true); setTimeout(() => setNotFound(false), 1500); setInput(""); return; }
    setGuesses([{ word: w, sim, rank: rank + 1 }, ...guesses]);
    setInput("");
  };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-xl">‹</Link>
        <h1 className="font-hand text-3xl text-blush-dark font-bold">Contexto 🧠</h1>
      </div>

      <div className="tape bg-white rounded-3xl p-5 shadow-lg mb-4 mt-4">
        <p className="text-sm text-gray-500 font-sans text-center">Find the secret word by guessing related words!</p>
        <p className="text-xs text-gray-400 font-sans text-center mt-1">Closer = greener. You've guessed {guesses.length} times.</p>
      </div>

      {won ? (
        <div className="text-center animate-pop mb-4">
          <p className="text-4xl">🎉</p>
          <p className="font-hand text-3xl text-blush-dark font-bold">The word was {secret.word}!</p>
          <p className="text-sm text-gray-500 font-sans">Found in {guesses.length} guesses</p>
        </div>
      ) : (
        <div className="flex gap-2 mb-4">
          <input value={input} onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && guess()}
            placeholder="Type a word..." className="input-field flex-1" />
          <button onClick={guess} className="btn-primary px-5 font-sans">Go</button>
        </div>
      )}

      {notFound && <p className="text-center text-sm text-gray-400 font-sans mb-2">Word not in list, try another!</p>}

      <div className="flex flex-col gap-2">
        {guesses.map((g) => (
          <div key={g.word} className={`flex items-center justify-between px-4 py-2.5 rounded-2xl font-sans ${g.sim === 1 ? "bg-green-300 text-green-900" : getColor(g.sim)}`}>
            <span className="font-semibold">{g.word}</span>
            <span className="text-xs">{g.sim === 1 ? "🎯 Found!" : `#${g.rank}`}</span>
          </div>
        ))}
      </div>

      <style>{`
        .input-field { width: 100%; padding: 10px 14px; border: 2px solid #f0e0e8; border-radius: 12px; font-size: 0.875rem; outline: none; background: #fff8f0; }
        .input-field:focus { border-color: #FFB7C5; }
        .btn-primary { padding: 11px 20px; background: linear-gradient(135deg, #FFB7C5, #F48FB1); color: white; border-radius: 14px; font-weight: 700; font-size: 0.95rem; transition: opacity 0.2s; border: none; cursor: pointer; white-space: nowrap; }
        .btn-primary:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
