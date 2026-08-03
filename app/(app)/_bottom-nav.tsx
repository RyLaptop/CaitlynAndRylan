"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/login/actions";
import { useState } from "react";

const allLinks = [
  { href: "/home",        label: "Home",     emoji: "🏠" },
  { href: "/games",       label: "Games",    emoji: "🎮" },
  { href: "/pet",         label: "Stripes",  emoji: "🐯" },
  { href: "/love-notes",  label: "Notes",    emoji: "💌" },
  { href: "/watchlist",   label: "Watch",    emoji: "🎬" },
  { href: "/bucket-list", label: "Bucket",   emoji: "🌟" },
  { href: "/photo-wall",  label: "Photos",   emoji: "📸" },
  { href: "/date-night",  label: "Date",     emoji: "🌙" },
  { href: "/study",       label: "Study",    emoji: "📚" },
  { href: "/music",       label: "Music",    emoji: "🎵" },
  { href: "/timeline",    label: "Timeline", emoji: "📅" },
];

export default function BottomNav({ profile }: { profile: { name: string; role: string } | null }) {
  const path = usePathname();
  const [showSignOut, setShowSignOut] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-blush/20 shadow-lg">
      {showSignOut && (
        <div className="border-b border-gray-100 px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-sans">
            {profile?.name} {profile?.role === "rylan" ? "🐯" : "🌸"}
          </span>
          <button onClick={() => signOut()} className="text-xs text-red-400 font-sans font-semibold hover:text-red-500">
            Sign Out
          </button>
        </div>
      )}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-2 py-2 min-w-max mx-auto justify-center">
          {allLinks.map((l) => {
            const active = l.href === "/home" ? path === "/home" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href}
                className={`flex flex-col items-center px-3 py-2 rounded-2xl transition min-w-[52px] ${active ? "bg-blush/20 text-blush-dark" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}>
                <span className="text-xl leading-none">{l.emoji}</span>
                <span className="text-[9px] mt-0.5 font-sans font-semibold whitespace-nowrap">{l.label}</span>
              </Link>
            );
          })}
          <button onClick={() => setShowSignOut(!showSignOut)}
            className="flex flex-col items-center px-3 py-2 rounded-2xl transition min-w-[52px] text-gray-400 hover:text-gray-600 hover:bg-gray-50">
            <span className="text-xl leading-none">⚙️</span>
            <span className="text-[9px] mt-0.5 font-sans font-semibold">More</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
