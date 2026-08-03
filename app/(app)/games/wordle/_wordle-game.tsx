"use client";
import { useState, useEffect, useCallback } from "react";

type LetterState = "correct" | "present" | "absent" | "empty" | "filled";

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

function evaluateGuess(guess: string, word: string): LetterState[] {
  const result: LetterState[] = Array(5).fill("absent");
  const wordArr = word.split("");
  const guessArr = guess.split("");
  const used = Array(5).fill(false);

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === wordArr[i]) { result[i] = "correct"; used[i] = true; }
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const j = wordArr.findIndex((l, idx) => l === guessArr[i] && !used[idx]);
    if (j !== -1) { result[i] = "present"; used[j] = true; }
  }
  return result;
}

export default function WordleGame({ word, hint, packId }: { word: string; hint: string; packId: number }) {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterState[][]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [shake, setShake] = useState(false);
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});

  const submit = useCallback(() => {
    if (current.length !== 5 || status !== "playing") return;
    const res = evaluateGuess(current, word);
    const newGuesses = [...guesses, current];
    const newResults = [...results, res];
    setGuesses(newGuesses);
    setResults(newResults);
    setCurrent("");

    const newLS = { ...letterStates };
    current.split("").forEach((l, i) => {
      const prev = newLS[l];
      if (res[i] === "correct") newLS[l] = "correct";
      else if (res[i] === "present" && prev !== "correct") newLS[l] = "present";
      else if (!prev) newLS[l] = "absent";
    });
    setLetterStates(newLS);

    if (current === word) setStatus("won");
    else if (newGuesses.length >= 6) setStatus("lost");
  }, [current, guesses, results, status, word, letterStates]);

  const type = useCallback((key: string) => {
    if (status !== "playing") return;
    if (key === "ENTER") { if (current.length !== 5) { setShake(true); setTimeout(() => setShake(false), 400); } else submit(); }
    else if (key === "⌫" || key === "BACKSPACE") setCurrent(c => c.slice(0, -1));
    else if (/^[A-Z]$/.test(key) && current.length < 5) setCurrent(c => c + key);
  }, [status, current, submit]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => type(e.key.toUpperCase());
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [type]);

  const rows = Array(6).fill(null).map((_, i) => {
    if (i < guesses.length) return { letters: guesses[i].split(""), states: results[i] };
    if (i === guesses.length && status === "playing") return { letters: current.split("").concat(Array(5 - current.length).fill("")), states: Array(5).fill("empty") as LetterState[] };
    return { letters: Array(5).fill(""), states: Array(5).fill("empty") as LetterState[] };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-gray-500 font-sans italic">"{hint}"</p>

      <div className="flex flex-col gap-1.5">
        {rows.map((row, ri) => (
          <div key={ri} className={`flex gap-1.5 ${shake && ri === guesses.length ? "animate-shake" : ""}`}>
            {row.letters.map((l, li) => {
              const state = ri < guesses.length ? row.states[li] : (l ? "filled" : "empty");
              return (
                <div key={li} className={`wordle-tile ${state} ${ri < guesses.length ? "animate-flip-in" : ""}`}
                  style={{ animationDelay: ri < guesses.length ? `${li * 80}ms` : "0ms" }}>
                  {l}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {status === "won" && (
        <div className="bg-mint/30 rounded-2xl p-4 text-center animate-pop">
          <p className="text-2xl">🎉</p>
          <p className="font-hand text-2xl text-gray-700 font-bold">You got it!</p>
          <p className="text-sm text-gray-500 font-sans">in {guesses.length} {guesses.length === 1 ? "try" : "tries"}</p>
        </div>
      )}
      {status === "lost" && (
        <div className="bg-blush/20 rounded-2xl p-4 text-center animate-pop">
          <p className="text-2xl">💔</p>
          <p className="font-hand text-2xl text-gray-700 font-bold">the word was {word}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5 mt-2">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-1">
            {row.map((k) => {
              const ls = letterStates[k];
              const isWide = k === "ENTER" || k === "⌫";
              return (
                <button key={k} onClick={() => type(k)}
                  className={`${isWide ? "px-2 text-xs" : "w-9"} h-10 rounded-lg font-semibold font-sans text-sm transition flex items-center justify-center
                    ${ls === "correct" ? "bg-green-300 text-green-900" : ls === "present" ? "bg-yellow-200 text-yellow-900" : ls === "absent" ? "bg-gray-300 text-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {k}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
