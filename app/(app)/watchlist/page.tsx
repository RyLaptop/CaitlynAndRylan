import { createClient } from "@/lib/supabase/server";
import { addItem, toggleWatched, deleteItem } from "./actions";
import BackBtn from "../_back-btn";

export default async function WatchlistPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("watchlist")
    .select("*, profiles(name, role)")
    .order("watched", { ascending: true })
    .order("created_at", { ascending: false });

  const unwatched = items?.filter((i: any) => !i.watched) ?? [];
  const watched = items?.filter((i: any) => i.watched) ?? [];

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BackBtn href="/home" />
        <div>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Watchlist 🎬</h1>
          <p className="text-xs text-gray-500 font-sans">movies & shows to watch together</p>
        </div>
      </div>

      <form action={addItem} className="tape bg-white rounded-3xl shadow-lg p-5 mb-6 mt-4">
        <div className="flex flex-col gap-2">
          <input name="title" required placeholder="Title…" className="input-field" />
          <div className="flex gap-2">
            <select name="type" className="input-field flex-1">
              <option value="movie">🎬 Movie</option>
              <option value="show">📺 Show</option>
              <option value="anime">🗾 Anime</option>
              <option value="documentary">🎥 Documentary</option>
            </select>
            <input name="where" placeholder="Netflix, Hulu…" className="input-field flex-1" />
          </div>
          <button type="submit" className="btn-primary py-2.5 font-sans">Add to List ✨</button>
        </div>
      </form>

      {unwatched.length > 0 && (
        <>
          <h2 className="font-hand text-2xl text-gray-600 mb-3">Up Next ({unwatched.length})</h2>
          <div className="flex flex-col gap-2 mb-6">
            {unwatched.map((item: any) => <WatchItem key={item.id} item={item} />)}
          </div>
        </>
      )}

      {watched.length > 0 && (
        <>
          <h2 className="font-hand text-2xl text-gray-400 mb-3">Watched ✓</h2>
          <div className="flex flex-col gap-2">
            {watched.map((item: any) => <WatchItem key={item.id} item={item} />)}
          </div>
        </>
      )}

      {!items?.length && (
        <div className="text-center py-12 text-gray-300">
          <p className="text-5xl">🎬</p>
          <p className="font-sans text-sm mt-2">Add something to watch together!</p>
        </div>
      )}

      <style>{`
        .input-field { width: 100%; padding: 10px 14px; border: 2px solid #f0e0e8; border-radius: 12px; font-size: 0.875rem; outline: none; background: #fff8f0; font-family: var(--font-nunito); }
        .input-field:focus { border-color: #FFB7C5; }
        .btn-primary { width: 100%; padding: 11px; background: linear-gradient(135deg, #FFB7C5, #F48FB1); color: white; border-radius: 14px; font-weight: 700; font-size: 0.95rem; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}

function WatchItem({ item }: { item: any }) {
  const typeEmoji: Record<string, string> = { movie: "🎬", show: "📺", anime: "🗾", documentary: "🎥" };
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition ${item.watched ? "border-mint/40 bg-mint/10 opacity-60" : "border-blush/20 bg-white"}`}>
      <span className="text-xl">{typeEmoji[item.type] ?? "🎬"}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-sans font-semibold text-sm text-gray-700 truncate ${item.watched ? "line-through text-gray-400" : ""}`}>{item.title}</p>
        <p className="text-xs text-gray-400 font-sans">{item.where} · added by {item.profiles?.name}</p>
      </div>
      <form action={toggleWatched.bind(null, item.id, item.watched)}>
        <button type="submit" className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs transition ${item.watched ? "bg-mint border-mint text-white" : "border-gray-200 hover:border-mint"}`}>
          {item.watched ? "✓" : ""}
        </button>
      </form>
      <form action={deleteItem.bind(null, item.id)}>
        <button type="submit" className="text-gray-200 hover:text-red-300 text-lg transition">×</button>
      </form>
    </div>
  );
}
