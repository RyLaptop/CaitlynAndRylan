import WordleGame from "./_wordle-game";
import packs from "@/data/wordle-packs.json";
import Link from "next/link";

export default async function WordlePage({ searchParams }: { searchParams: Promise<{ pack?: string }> }) {
  const { pack: packParam } = await searchParams;
  const packId = Number(packParam) || 1;
  const pack = packs.find((p) => p.id === packId) ?? packs[0];

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-xl">‹</Link>
        <h1 className="font-hand text-3xl text-blush-dark font-bold">Wordle 🟩</h1>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {packs.map((p) => (
          <Link key={p.id} href={`/games/wordle?pack=${p.id}`}
            className={`px-3 py-1 rounded-full text-xs font-sans font-semibold transition ${p.id === packId ? "bg-blush text-white" : "bg-cream text-gray-500 hover:bg-blush/20"}`}>
            #{p.id}
          </Link>
        ))}
      </div>

      <WordleGame word={pack.word} hint={pack.hint} packId={packId} />
    </div>
  );
}
