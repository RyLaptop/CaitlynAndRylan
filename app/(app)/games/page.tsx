import Link from "next/link";

const games = [
  { href: "/games/wordle", emoji: "🟩", label: "Wordle", desc: "Guess our word in 6 tries", color: "bg-mint/30" },
  { href: "/games/connections", emoji: "🔗", label: "Connections", desc: "Find 4 groups of 4", color: "bg-lavender/30" },
  { href: "/games/deep-questions", emoji: "💬", label: "Deep Questions", desc: "How deep can we go?", color: "bg-blush/30" },
  { href: "/games/anagram", emoji: "🔤", label: "Anagram", desc: "Unscramble the word", color: "bg-peach/30" },
  { href: "/games/contexto", emoji: "🧠", label: "Contexto", desc: "Find the secret word", color: "bg-sky/30" },
];

export default function GamesPage() {
  return (
    <div className="px-4 pt-8 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-hand text-4xl text-blush-dark font-bold">Game Room 🎮</h1>
        <p className="text-sm text-gray-500 font-sans mt-1">play together, even apart</p>
      </div>

      <div className="flex flex-col gap-3">
        {games.map((g) => (
          <Link key={g.href} href={g.href}
            className={`tape ${g.color} rounded-3xl p-5 flex items-center gap-4 hover:scale-[1.01] transition-transform active:scale-[0.99] mt-2`}>
            <span className="text-4xl">{g.emoji}</span>
            <div>
              <p className="font-hand text-2xl text-gray-700 font-bold">{g.label}</p>
              <p className="text-xs text-gray-500 font-sans">{g.desc}</p>
            </div>
            <span className="ml-auto text-gray-300 text-xl">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
