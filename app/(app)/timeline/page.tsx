import { createClient } from "@/lib/supabase/server";
import { addMilestone, deleteMilestone } from "./actions";
import Image from "next/image";
import BackBtn from "../_back-btn";

const EMOJIS = ["💕","🌸","🐯","✨","🎉","🌙","☕","✈️","🎶","📸","🥰","💌","🌟","🍜","🎬"];

export default async function TimelinePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: events } = await supabase
    .from("timeline")
    .select("*, profiles(name, role)")
    .order("date", { ascending: true });

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <BackBtn href="/home" />
        <div>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Our Story 📅</h1>
          <p className="text-xs text-gray-500 font-sans">every milestone, forever saved</p>
        </div>
        <Image src="/heart-solid.svg" alt="" width={28} height={26} className="opacity-60 ml-auto"/>
      </div>

      <form action={addMilestone} className="relative bg-white rounded-3xl shadow-lg p-5 mb-6">
        <Image src="/tape-corner.svg" alt="" width={40} height={40} className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-90 pointer-events-none"/>
        <div className="flex flex-col gap-2 mt-1">
          <input name="title" required placeholder="Milestone title…" className="input-field" />
          <input name="date" type="date" required className="input-field" />
          <input name="note" placeholder="A little note about this day…" className="input-field" />
          <div className="flex gap-2">
            <select name="emoji" className="input-field w-24">
              {EMOJIS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <button type="submit" className="btn-primary flex-1 py-2.5 font-sans">Add 💕</button>
          </div>
        </div>
      </form>

      <div className="relative">
        {events && events.length > 0 && (
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-blush/30" />
        )}

        <div className="flex flex-col gap-6">
          {events?.map((ev: any, i: number) => (
            <div key={ev.id}>
              {/* Washi tape between entries */}
              {i > 0 && i % 3 === 0 && (
                <div className="-mx-4 mb-4 overflow-hidden opacity-50">
                  <Image src={i % 6 === 0 ? "/washi-tape-dot-pink.svg" : "/washi-tape-stripe-sage.svg"}
                    alt="" width={400} height={55} className="w-full"/>
                </div>
              )}
              <div className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-blush/20 border-2 border-blush/40 flex items-center justify-center flex-shrink-0 z-10 text-xl">
                  {ev.emoji}
                </div>
                <div className="relative bg-white rounded-3xl p-4 shadow-sm flex-1 mt-1">
                  <Image src="/tape-corner.svg" alt="" width={32} height={32} className="absolute -top-3 right-4 opacity-80 pointer-events-none"/>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-hand text-xl text-gray-700 font-bold">{ev.title}</p>
                      <p className="text-xs text-blush-dark font-sans font-semibold">
                        {new Date(ev.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                      {ev.note && <p className="text-sm text-gray-500 font-sans mt-1 leading-relaxed">{ev.note}</p>}
                      <p className="text-xs text-gray-400 font-sans mt-1">
                        added by {ev.profiles?.name} {ev.profiles?.role === "rylan" ? "🐯" : "🌸"}
                      </p>
                    </div>
                    {ev.user_id === user!.id && (
                      <form action={deleteMilestone.bind(null, ev.id)}>
                        <button type="submit" className="text-gray-200 hover:text-red-300 text-lg ml-2">×</button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!events?.length && (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <Image src="/sparkle-star.svg" alt="" width={60} height={60} className="opacity-30"/>
              <p className="font-sans text-sm text-gray-300">Add your first milestone!</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .input-field { width: 100%; padding: 10px 14px; border: 2px solid #f0e0e8; border-radius: 12px; font-size: 0.875rem; outline: none; background: #fff8f0; font-family: var(--font-nunito); }
        .input-field:focus { border-color: #FFB7C5; }
        .btn-primary { padding: 11px; background: linear-gradient(135deg, #FFB7C5, #F48FB1); color: white; border-radius: 14px; font-weight: 700; font-size: 0.95rem; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
