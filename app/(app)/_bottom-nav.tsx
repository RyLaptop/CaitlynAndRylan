"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/login/actions";

const mainLinks = [
  { href: "/home", label: "Home", emoji: "🏠" },
  { href: "/games", label: "Games", emoji: "🎮" },
  { href: "/pet", label: "Stripes", emoji: "🐯" },
  { href: "/love-notes", label: "Notes", emoji: "💌" },
];

const moreLinks = [
  { href: "/watchlist", label: "Watchlist", emoji: "🎬" },
  { href: "/bucket-list", label: "Bucket List", emoji: "🌟" },
  { href: "/photo-wall", label: "Photos", emoji: "📸" },
  { href: "/date-night", label: "Date Night", emoji: "🌙" },
  { href: "/study", label: "Study", emoji: "📚" },
  { href: "/music", label: "Music", emoji: "🎵" },
  { href: "/timeline", label: "Timeline", emoji: "📅" },
];

export default function BottomNav({ profile }: { profile: { name: string; role: string } | null }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute bottom-20 left-0 right-0 mx-4 bg-white rounded-3xl shadow-xl p-5 border border-blush/30"
            onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-semibold text-gray-400 mb-3 font-sans">
              {profile ? `${profile.name} ${profile.role === "rylan" ? "🐯" : "🌸"}` : ""}
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {moreLinks.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition ${path.startsWith(l.href) ? "bg-blush/20" : "hover:bg-cream"}`}>
                  <span className="text-2xl">{l.emoji}</span>
                  <span className="text-xs mt-1 font-sans text-gray-600">{l.label}</span>
                </Link>
              ))}
            </div>
            <button onClick={() => { signOut(); setOpen(false); }}
              className="w-full py-2.5 text-sm text-gray-500 border border-gray-200 rounded-2xl hover:bg-gray-50 font-sans">
              Sign Out
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-t border-blush/20 safe-area-pb">
        <div className="flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
          {mainLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className={`flex flex-col items-center px-3 py-1.5 rounded-2xl transition min-w-0 ${path.startsWith(l.href) ? "bg-blush/20 text-blush-dark" : "text-gray-400 hover:text-gray-600"}`}>
              <span className="text-2xl leading-none">{l.emoji}</span>
              <span className="text-[10px] mt-0.5 font-sans font-semibold">{l.label}</span>
            </Link>
          ))}
          <button onClick={() => setOpen(!open)}
            className={`flex flex-col items-center px-3 py-1.5 rounded-2xl transition ${open ? "bg-blush/20 text-blush-dark" : "text-gray-400 hover:text-gray-600"}`}>
            <span className="text-2xl leading-none">✨</span>
            <span className="text-[10px] mt-0.5 font-sans font-semibold">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
