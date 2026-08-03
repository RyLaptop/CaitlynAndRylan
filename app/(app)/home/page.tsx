import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

const features = [
  { href: "/games",       emoji: "🎮", label: "Games",       color: "bg-sky/30",      desc: "Wordle, Connections & more" },
  { href: "/love-notes",  emoji: "💌", label: "Love Notes",  color: "bg-blush/30",    desc: "Leave each other notes" },
  { href: "/pet",         emoji: "🐯", label: "Stripes",     color: "bg-peach/30",    desc: "Our baby tiger" },
  { href: "/photo-wall",  emoji: "📸", label: "Photo Wall",  color: "bg-lavender/30", desc: "Our memories" },
  { href: "/watchlist",   emoji: "🎬", label: "Watchlist",   color: "bg-mint/30",     desc: "Shows & movies" },
  { href: "/bucket-list", emoji: "🌟", label: "Bucket List", color: "bg-peach/30",    desc: "Things to do together" },
  { href: "/date-night",  emoji: "🌙", label: "Date Night",  color: "bg-lavender/30", desc: "Virtual date ideas" },
  { href: "/study",       emoji: "📚", label: "Study Tools", color: "bg-sky/30",      desc: "Flashcards & notes" },
  { href: "/music",       emoji: "🎵", label: "Music Vibes", color: "bg-mint/30",     desc: "Songs that remind us" },
  { href: "/timeline",    emoji: "📅", label: "Timeline",    color: "bg-blush/30",    desc: "Our story" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("name, role").eq("id", user!.id).single();

  const greeting = profile?.role === "rylan" ? "hey tiger 🐯" : "hey love 🌸";

  return (
    <div className="px-4 pt-8 pb-4 max-w-lg mx-auto relative">

      {/* Floating decorations */}
      <Image src="/sparkle-star.svg" alt="" width={36} height={36} className="absolute top-6 right-4 opacity-50 animate-float pointer-events-none" style={{ animationDelay: "0.3s" }}/>
      <Image src="/flower.svg"       alt="" width={44} height={44} className="absolute top-16 left-0 opacity-30 animate-float pointer-events-none" style={{ animationDelay: "1.1s" }}/>
      <Image src="/sparkle-star.svg" alt="" width={24} height={24} className="absolute top-32 right-2 opacity-40 animate-float pointer-events-none" style={{ animationDelay: "0.7s" }}/>

      <div className="text-center mb-2 relative z-10">
        <h1 className="font-hand text-5xl text-blush-dark font-bold">C & R 💕</h1>
        <p className="font-hand text-2xl text-gray-500 mt-1">{greeting}</p>
      </div>

      {/* Washi tape divider */}
      <div className="my-4 -mx-4 overflow-hidden">
        <Image src="/washi-tape-heart-lavender.svg" alt="" width={400} height={60} className="w-full opacity-70"/>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {features.map((f) => (
          <Link key={f.href} href={f.href}
            className={`relative ${f.color} rounded-3xl p-4 flex flex-col gap-1 hover:scale-[1.02] transition-transform active:scale-[0.98] mt-3`}>
            {/* tape corner */}
            <Image src="/tape-corner.svg" alt="" width={32} height={32} className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-80 pointer-events-none"/>
            <span className="text-3xl mt-1">{f.emoji}</span>
            <span className="font-hand text-xl text-gray-700 font-bold leading-tight">{f.label}</span>
            <span className="text-xs text-gray-500 font-sans">{f.desc}</span>
          </Link>
        ))}
      </div>

      {/* Bottom washi tape */}
      <div className="mt-8 -mx-4 overflow-hidden">
        <Image src="/washi-tape-dot-pink.svg" alt="" width={400} height={60} className="w-full opacity-60"/>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4 mb-8">
        <Image src="/heart-stitched.svg" alt="" width={40} height={36} className="opacity-50"/>
        <p className="text-center text-xs text-gray-400 font-sans">made with 💕 just for us</p>
        <Image src="/heart-stitched.svg" alt="" width={40} height={36} className="opacity-50" style={{ transform: "scaleX(-1)" }}/>
      </div>
    </div>
  );
}
