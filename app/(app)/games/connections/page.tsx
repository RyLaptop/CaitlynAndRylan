import ConnectionsGame from "./_connections-game";
import packs from "@/data/connections-packs.json";
import Link from "next/link";

export default function ConnectionsPage({ searchParams }: { searchParams: { pack?: string } }) {
  const packId = Number(searchParams.pack) || 1;
  const pack = packs.find((p) => p.id === packId) ?? packs[0];

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/games" className="text-gray-400 hover:text-gray-600 text-xl">‹</Link>
        <h1 className="font-hand text-3xl text-blush-dark font-bold">Connections 🔗</h1>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        {packs.map((p) => (
          <Link key={p.id} href={`/games/connections?pack=${p.id}`}
            className={`px-3 py-1 rounded-full text-xs font-sans font-semibold transition ${p.id === packId ? "bg-blush text-white" : "bg-cream text-gray-500 hover:bg-blush/20"}`}>
            {p.title}
          </Link>
        ))}
      </div>

      <p className="text-sm text-gray-500 font-sans mb-4 text-center">Find 4 groups of 4 words</p>
      <ConnectionsGame key={packId} groups={pack.groups} />
    </div>
  );
}
