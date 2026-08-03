"use client";
import { useState } from "react";

type Card = { id: string; front: string; back: string };

export default function FlashcardViewer({ cards }: { cards: Card[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards.length) return <p className="text-center text-gray-400 font-sans text-sm py-8">No cards yet — add some below!</p>;

  const card = cards[idx];

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs text-gray-400 font-sans">{idx + 1} / {cards.length}</p>

      <div className="flip-card w-full h-44 cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
          <div className="flip-card-front bg-blush/10 rounded-3xl border-2 border-blush/30 flex items-center justify-center p-6">
            <p className="font-hand text-2xl text-gray-700 font-bold text-center">{card.front}</p>
          </div>
          <div className="flip-card-back bg-mint/20 rounded-3xl border-2 border-mint/40 flex items-center justify-center p-6">
            <p className="font-hand text-2xl text-green-800 font-bold text-center">{card.back}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 font-sans">tap to flip</p>

      <div className="flex gap-4">
        <button onClick={() => { setIdx((i) => (i - 1 + cards.length) % cards.length); setFlipped(false); }}
          className="w-12 h-12 rounded-full bg-cream text-gray-500 text-xl hover:bg-blush/20 transition flex items-center justify-center">
          ‹
        </button>
        <button onClick={() => { setFlipped(false); setIdx(() => Math.floor(Math.random() * cards.length)); }}
          className="w-12 h-12 rounded-full bg-blush/20 text-blush-dark text-xl hover:bg-blush/30 transition flex items-center justify-center">
          🔀
        </button>
        <button onClick={() => { setIdx((i) => (i + 1) % cards.length); setFlipped(false); }}
          className="w-12 h-12 rounded-full bg-cream text-gray-500 text-xl hover:bg-blush/20 transition flex items-center justify-center">
          ›
        </button>
      </div>
    </div>
  );
}
