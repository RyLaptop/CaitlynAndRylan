"use client";
import { useState } from "react";
import Link from "next/link";
import allTrivia from "@/data/trivia.json";

const CATEGORIES = [
  { key: "medicine",   emoji: "🩺", label: "Medicine",    color: "bg-red-100 text-red-600" },
  { key: "science",    emoji: "🔬", label: "Science",     color: "bg-sky/30 text-sky-700" },
  { key: "history",    emoji: "📜", label: "History",     color: "bg-amber-100 text-amber-700" },
  { key: "popculture", emoji: "🎬", label: "Pop Culture", color: "bg-blush/30 text-blush-dark" },
  { key: "animals",    emoji: "🐾", label: "Animals",     color: "bg-mint/30 text-green-700" },
] as const;

type CatKey = typeof CATEGORIES[number]["key"];
type Question = { q: string; a: string[]; correct: number };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TriviaPage() {
  const [cat, setCat]             = useState<CatKey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx]           = useState(0);
  const [score, setScore]         = useState(0);
  const [chosen, setChosen]       = useState<number | null>(null);
  const [done, setDone]           = useState(false);

  const startGame = (key: CatKey) => {
    const pool = (allTrivia as Record<string, Question[]>)[key];
    setQuestions(shuffle(pool).slice(0, 8));
    setCat(key);
    setQIdx(0);
    setScore(0);
    setChosen(null);
    setDone(false);
  };

  const pick = (idx: number) => {
    if (chosen !== null) return;
    setChosen(idx);
    const correct = questions[qIdx].correct;
    if (idx === correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) {
        setDone(true);
      } else {
        setQIdx((q) => q + 1);
        setChosen(null);
      }
    }, 1100);
  };

  const category = CATEGORIES.find((c) => c.key === cat);
  const q        = questions[qIdx];
  const total    = questions.length;

  // Category select screen
  if (!cat) {
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/games" className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">‹</Link>
          <div>
            <h1 className="font-hand text-3xl text-blush-dark font-bold">Trivia 🧪</h1>
            <p className="text-xs text-gray-500 font-sans">pick a category and test your knowledge!</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((c) => (
            <button key={c.key} onClick={() => startGame(c.key)}
              className={`${c.color} rounded-3xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-sm text-left`}>
              <span className="text-4xl">{c.emoji}</span>
              <div>
                <p className="font-hand text-2xl font-bold">{c.label}</p>
                <p className="text-xs font-sans opacity-70">10 questions</p>
              </div>
              <span className="ml-auto text-xl opacity-40">›</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Results screen
  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setCat(null)} className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">‹</button>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Trivia Results</h1>
        </div>
        <div className="tape bg-white rounded-3xl p-8 text-center shadow-lg">
          <p className="text-6xl mb-4">{pct >= 88 ? "🏆" : pct >= 62 ? "🎉" : pct >= 38 ? "😅" : "💀"}</p>
          <p className="font-hand text-5xl font-bold text-blush-dark">{score}/{total}</p>
          <p className="font-hand text-2xl text-gray-600 mt-1 mb-2">
            {pct >= 88 ? "Genius! 🧠" : pct >= 62 ? "Solid! 👏" : pct >= 38 ? "Not bad!" : "Study up! 📚"}
          </p>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blush to-lavender transition-all duration-700"
              style={{ width: `${pct}%` }}/>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => startGame(cat)}
              className="btn-primary px-6 py-3 font-sans font-bold">
              Try Again {category?.emoji}
            </button>
            <button onClick={() => setCat(null)}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-sans font-bold hover:bg-gray-200 transition">
              Change Category
            </button>
          </div>
        </div>
        <style>{`.btn-primary{background:linear-gradient(135deg,#FFB7C5,#F48FB1);color:white;border-radius:14px;font-weight:700;transition:opacity 0.2s;border:none;cursor:pointer}.btn-primary:hover{opacity:.9}`}</style>
      </div>
    );
  }

  // Question screen
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setCat(null)} className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">‹</button>
        <div className="flex-1">
          <p className="font-hand text-xl text-blush-dark font-bold">{category?.emoji} {category?.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blush to-lavender rounded-full transition-all duration-500"
                style={{ width: `${((qIdx) / total) * 100}%` }}/>
            </div>
            <span className="text-xs font-sans text-gray-400">{qIdx + 1}/{total}</span>
          </div>
        </div>
        <span className="text-sm font-sans font-bold text-mint">Score: {score}</span>
      </div>

      {/* Question card */}
      <div className="tape bg-white rounded-3xl shadow-lg p-6 mb-5 mt-2 min-h-[110px] flex items-center">
        <p className="font-hand text-2xl text-gray-700 font-bold leading-snug">{q.q}</p>
      </div>

      {/* Answers */}
      <div className="flex flex-col gap-3">
        {q.a.map((ans, i) => {
          const isCorrect = i === q.correct;
          const isChosen  = i === chosen;
          let bg = "bg-white border-2 border-blush/20 hover:border-blush/50";
          if (chosen !== null) {
            if (isCorrect)      bg = "bg-mint/20 border-2 border-mint text-mint-dark";
            else if (isChosen)  bg = "bg-red-100 border-2 border-red-300 text-red-600";
            else                bg = "bg-gray-50 border-2 border-gray-100 opacity-60";
          }
          return (
            <button key={i} onClick={() => pick(i)}
              className={`${bg} rounded-2xl p-4 text-left transition-all font-sans text-sm font-semibold text-gray-700 flex items-center gap-3`}>
              <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs
                ${chosen === null ? "bg-blush/20 text-blush-dark" : isCorrect ? "bg-mint text-white" : isChosen ? "bg-red-400 text-white" : "bg-gray-200 text-gray-400"}`}>
                {["A","B","C","D"][i]}
              </span>
              {ans}
              {chosen !== null && isCorrect && <span className="ml-auto">✓</span>}
              {chosen !== null && isChosen && !isCorrect && <span className="ml-auto">✗</span>}
            </button>
          );
        })}
      </div>

      <style>{`.btn-primary{background:linear-gradient(135deg,#FFB7C5,#F48FB1);color:white;border-radius:14px;font-weight:700;transition:opacity 0.2s;border:none;cursor:pointer}.btn-primary:hover{opacity:.9}`}</style>
    </div>
  );
}
