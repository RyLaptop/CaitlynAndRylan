import { createClient } from "@/lib/supabase/server";
import { addSong, deleteSong } from "./actions";

export default async function MusicPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: songs } = await supabase
    .from("songs")
    .select("*, profiles(name, role)")
    .order("created_at", { ascending: false });

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-hand text-4xl text-blush-dark font-bold">Music Vibes 🎵</h1>
        <p className="text-sm text-gray-500 font-sans mt-1">songs that make us think of us</p>
      </div>

      <form action={addSong} className="tape bg-white rounded-3xl shadow-lg p-5 mb-6 mt-4">
        <div className="flex flex-col gap-2">
          <input name="title" required placeholder="Song title…" className="input-field" />
          <input name="artist" placeholder="Artist…" className="input-field" />
          <input name="note" placeholder="Why this song? 💕" className="input-field" />
          <input name="spotify_url" placeholder="Spotify link (optional)" className="input-field" />
          <button type="submit" className="btn-primary py-2.5 font-sans">Add Song 🎵</button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {songs?.map((song: any) => (
          <div key={song.id} className={`tape bg-white rounded-3xl p-4 shadow-sm mt-2 ${song.profiles?.role === "rylan" ? "tape-yellow" : "tape-lavender"}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl mt-0.5">🎵</span>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-bold text-gray-700 text-sm">{song.title}</p>
                {song.artist && <p className="text-xs text-gray-500 font-sans">{song.artist}</p>}
                {song.note && <p className="text-xs text-blush-dark font-sans italic mt-1">"{song.note}"</p>}
                <div className="flex items-center gap-2 mt-1.5">
                  <p className="text-xs text-gray-400 font-sans">
                    — {song.profiles?.name} {song.profiles?.role === "rylan" ? "🐯" : "🌸"}
                  </p>
                  {song.spotify_url && (
                    <a href={song.spotify_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-green-600 font-sans font-semibold hover:underline">
                      ▶ Spotify
                    </a>
                  )}
                </div>
              </div>
              {song.user_id === user!.id && (
                <form action={deleteSong.bind(null, song.id)}>
                  <button type="submit" className="text-gray-200 hover:text-red-300 text-lg">×</button>
                </form>
              )}
            </div>
          </div>
        ))}
        {!songs?.length && (
          <div className="text-center py-12 text-gray-300">
            <p className="text-5xl">🎵</p>
            <p className="font-sans text-sm mt-2">Add songs that remind you of each other!</p>
          </div>
        )}
      </div>

      <style>{`
        .input-field { width: 100%; padding: 10px 14px; border: 2px solid #f0e0e8; border-radius: 12px; font-size: 0.875rem; outline: none; background: #fff8f0; font-family: var(--font-nunito); }
        .input-field:focus { border-color: #FFB7C5; }
        .btn-primary { width: 100%; padding: 11px; background: linear-gradient(135deg, #FFB7C5, #F48FB1); color: white; border-radius: 14px; font-weight: 700; font-size: 0.95rem; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
