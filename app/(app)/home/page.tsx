import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const features = [
  { href: "/games", emoji: "🎮", label: "Games", color: "bg-sky/30", desc: "Wordle, Connections & more" },
  { href: "/love-notes", emoji: "💌", label: "Love Notes", color: "bg-blush/30", desc: "Leave each other notes" },
  { href: "/pet", emoji: "🐯", label: "Stripes", color: "bg-peach/30", desc: "Our baby tiger" },
  { href: "/photo-wall", emoji: "📸", label: "Photo Wall", color: "bg-lavender/30", desc: "Our memories" },
  { href: "/watchlist", emoji: "🎬", label: "Watchlist", color: "bg-mint/30", desc: "Shows & movies" },
  { href: "/bucket-list", emoji: "🌟", label: "Bucket List", color: "bg-peach/30", desc: "Things to do together" },
  { href: "/date-night", emoji: "🌙", label: "Date Night", color: "bg-lavender/30", desc: "Virtual date ideas" },
  { href: "/study", emoji: "📚", label: "Study Tools", color: "bg-sky/30", desc: "Flashcards & notes" },
  { href: "/music", emoji: "🎵", label: "Music Vibes", color: "bg-mint/30", desc: "Spotify & playlists" },
  { href: "/timeline", emoji: "📅", label: "Timeline", color: "bg-blush/30", desc: "Our story" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("name, role").eq("id", user!.id).single();

  const greeting = profile?.role === "rylan" ? "hey tiger 🐯" : "hey love 🌸";

  return (
    <div className="px-4 pt-8 pb-4 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-hand text-5xl text-blush-dark font-bold">C & R 💕</h1>
        <p className="font-hand text-2xl text-gray-500 mt-1">{greeting}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {features.map((f) => (
          <Link key={f.href} href={f.href}
            className={`tape ${f.color} rounded-3xl p-4 flex flex-col gap-1 hover:scale-[1.02] transition-transform active:scale-[0.98] mt-3`}>
            <span className="text-3xl">{f.emoji}</span>
            <span className="font-hand text-xl text-gray-700 font-bold leading-tight">{f.label}</span>
            <span className="text-xs text-gray-500 font-sans">{f.desc}</span>
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 font-sans">made with 💕 just for us</p>
    </div>
  );
}
