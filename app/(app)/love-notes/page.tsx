import { createClient } from "@/lib/supabase/server";
import { addNote, deleteNote } from "./actions";
import Image from "next/image";
import BackBtn from "../_back-btn";

const MOODS = ["💕","🌸","🐯","✨","🥰","💌","🌷","💫","🤗","😊"];

export default async function LoveNotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: notes } = await supabase
    .from("love_notes")
    .select("*, profiles(name, role)")
    .order("created_at", { ascending: false });

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <BackBtn href="/home" />
        <div className="flex items-center gap-2 flex-1">
          <Image src="/envelope-doodle.svg" alt="" width={44} height={32} className="opacity-80"/>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Love Notes</h1>
        </div>
        <Image src="/pushpin-heart.svg" alt="" width={28} height={36} className="opacity-70"/>
      </div>
      <p className="text-sm text-gray-500 font-sans mb-4 ml-12">little reminders just for us</p>

      <form action={addNote} className="bg-white rounded-3xl shadow-lg p-5 mb-4 relative">
        <Image src="/tape-corner.svg" alt="" width={40} height={40} className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-90 pointer-events-none"/>
        <textarea name="content" required placeholder="Write a little note… 💕"
          rows={3} className="w-full border-2 border-blush/30 rounded-2xl p-3 text-sm font-sans outline-none focus:border-blush bg-cream resize-none mt-1" />
        <div className="flex items-center gap-2 mt-3">
          <select name="mood" className="border-2 border-blush/30 rounded-xl px-3 py-2 text-sm font-sans bg-cream focus:border-blush outline-none">
            {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <button type="submit" className="ml-auto btn-primary px-6 py-2 font-sans text-sm">Send 💌</button>
        </div>
      </form>

      {/* Washi tape divider */}
      <div className="-mx-4 mb-4 overflow-hidden">
        <Image src="/washi-tape-stripe-sage.svg" alt="" width={400} height={55} className="w-full opacity-60"/>
      </div>

      <div className="flex flex-col gap-5">
        {notes?.map((note: any) => {
          const isMe = note.user_id === user!.id;
          const role = note.profiles?.role;
          return (
            <div key={note.id}
              className={`relative bg-white rounded-3xl shadow-sm p-5 ${isMe ? "ml-4" : "mr-4"} animate-fade-in`}>
              {/* pushpin */}
              <Image src="/pushpin-heart.svg" alt="" width={22} height={28}
                className="absolute -top-3 left-4 opacity-80 pointer-events-none"/>
              <div className="flex items-start gap-2 mt-1">
                <span className="text-2xl">{note.mood}</span>
                <div className="flex-1">
                  <p className="text-sm font-sans text-gray-700 leading-relaxed">{note.content}</p>
                  <p className="text-xs text-gray-400 font-sans mt-2">
                    — {note.profiles?.name} {role === "rylan" ? "🐯" : "🌸"} · {new Date(note.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                {isMe && (
                  <form action={deleteNote.bind(null, note.id)}>
                    <button type="submit" className="text-gray-300 hover:text-red-300 text-lg transition">×</button>
                  </form>
                )}
              </div>
              {/* heart stitched decoration on some notes */}
              {note.mood === "💕" && (
                <Image src="/heart-stitched.svg" alt="" width={28} height={26}
                  className="absolute -bottom-3 right-4 opacity-60 pointer-events-none"/>
              )}
            </div>
          );
        })}
        {!notes?.length && (
          <div className="text-center py-12 text-gray-300 flex flex-col items-center gap-3">
            <Image src="/envelope-doodle.svg" alt="" width={80} height={58} className="opacity-40"/>
            <p className="font-sans text-sm">No notes yet — write the first one!</p>
          </div>
        )}
      </div>

      <style>{`
        .btn-primary { background: linear-gradient(135deg, #FFB7C5, #F48FB1); color: white; border-radius: 14px; font-weight: 700; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
