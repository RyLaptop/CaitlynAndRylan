"use client";
import { useState, useMemo } from "react";

type Group = { label: string; color: string; items: string[] };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ConnectionsGame({ groups }: { groups: Group[] }) {
  const allItems = useMemo(() => shuffle(groups.flatMap((g) => g.items.map((item) => ({ item, group: g.label, color: g.color })))), [groups]);
  const [tiles, setTiles] = useState(allItems);
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<Group[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

  const toggle = (item: string) => {
    if (status !== "playing") return;
    setSelected((s) => s.includes(item) ? s.filter((x) => x !== item) : s.length < 4 ? [...s, item] : s);
  };

  const submit = () => {
    if (selected.length !== 4) return;
    const group = groups.find((g) => g.items.every((i) => selected.includes(i)));
    if (group) {
      const newSolved = [...solved, group];
      setSolved(newSolved);
      setTiles((t) => t.filter((x) => !selected.includes(x.item)));
      setSelected([]);
      if (newSolved.length === groups.length) setStatus("won");
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
      const m = mistakes + 1;
      setMistakes(m);
      setSelected([]);
      if (m >= 4) setStatus("lost");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1 mb-1">
        {Array(4).fill(null).map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full ${i < mistakes ? "bg-red-300" : "bg-gray-200"}`} />
        ))}
      </div>

      {solved.map((g) => (
        <div key={g.label} className="w-full rounded-2xl p-3 text-center animate-pop" style={{ background: g.color }}>
          <p className="font-semibold text-gray-700 text-sm font-sans">{g.label}</p>
          <p className="text-xs text-gray-600 font-sans mt-0.5">{g.items.join(" · ")}</p>
        </div>
      ))}

      <div className="grid grid-cols-4 gap-2 w-full">
        {tiles.map(({ item }) => (
          <button key={item} onClick={() => toggle(item)}
            className={`conn-tile ${selected.includes(item) ? "selected" : ""} ${wrong && selected.includes(item) ? "animate-shake" : ""} bg-cream text-gray-700 text-xs`}>
            {item}
          </button>
        ))}
      </div>

      {status === "playing" && (
        <button onClick={submit} disabled={selected.length !== 4}
          className="btn-primary px-8 py-2.5 disabled:opacity-40 font-sans">
          Submit
        </button>
      )}

      {status === "won" && (
        <div className="text-center animate-pop">
          <p className="text-3xl">🎉</p>
          <p className="font-hand text-3xl text-blush-dark font-bold">Perfect!</p>
        </div>
      )}
      {status === "lost" && (
        <div className="text-center animate-pop">
          <p className="text-2xl">💔</p>
          <p className="font-hand text-2xl text-gray-600">so close!</p>
          <div className="mt-2 flex flex-col gap-1 w-full">
            {groups.filter((g) => !solved.find((s) => s.label === g.label)).map((g) => (
              <div key={g.label} className="rounded-xl p-2 text-center text-xs font-sans" style={{ background: g.color }}>
                <strong>{g.label}</strong>: {g.items.join(", ")}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
