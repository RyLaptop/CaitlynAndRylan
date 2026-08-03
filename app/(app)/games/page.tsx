import Link from "next/link";
import BackBtn from "../_back-btn";

const originalGames = [
  { href: "/games/wordle",         emoji: "🟩", label: "Wordle",         desc: "Guess the 5-letter word in 6 tries", color: "bg-mint/30" },
  { href: "/games/connections",    emoji: "🔗", label: "Connections",    desc: "Find 4 groups of 4",                  color: "bg-lavender/30" },
  { href: "/games/deep-questions", emoji: "💬", label: "Deep Questions", desc: "How deep can we go?",                color: "bg-blush/30" },
  { href: "/games/anagram",        emoji: "🔤", label: "Anagram",        desc: "Unscramble the word",                color: "bg-peach/30" },
  { href: "/games/contexto",       emoji: "🧠", label: "Contexto",       desc: "Find the secret word by context",    color: "bg-sky/30" },
];

const gamePigeonGames = [
  { href: "/games/word-hunt",   emoji: "🔍", label: "Word Hunt",   desc: "Find hidden words in the grid",   color: "bg-mint/30" },
  { href: "/games/sea-battle",  emoji: "🚢", label: "Sea Battle",  desc: "Battleship — sink the AI fleet",  color: "bg-sky/30" },
  { href: "/games/the-loop",    emoji: "🔄", label: "The Loop",    desc: "Rotate tiles to form a loop",     color: "bg-lavender/30" },
];

function GameCard({ g }: { g: typeof originalGames[0] }) {
  return (
    <Link href={g.href}
      className={`tape ${g.color} rounded-3xl p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform active:scale-[0.99] mt-2`}>
      <span className="text-3xl">{g.emoji}</span>
      <div className="flex-1">
        <p className="font-hand text-xl text-gray-700 font-bold">{g.label}</p>
        <p className="text-xs text-gray-500 font-sans">{g.desc}</p>
      </div>
      <span className="text-gray-300 text-xl">›</span>
    </Link>
  );
}

export default function GamesPage() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BackBtn href="/home" />
        <div>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Game Room 🎮</h1>
          <p className="text-xs text-gray-500 font-sans">play together, even apart</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-6">
        {originalGames.map((g) => <GameCard key={g.href} g={g} />)}
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px bg-blush/20"/>
        <span className="text-xs font-sans font-semibold text-gray-400">Game Pigeon Style</span>
        <div className="flex-1 h-px bg-blush/20"/>
      </div>

      <div className="flex flex-col gap-1">
        {gamePigeonGames.map((g) => <GameCard key={g.href} g={g} />)}
      </div>
    </div>
  );
}
