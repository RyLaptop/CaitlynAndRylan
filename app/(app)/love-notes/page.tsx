import { createClient } from "@/lib/supabase/server";
import { addNote, deleteNote } from "./actions";
import Link from "next/link";

const MOODS = ["💕","🌸","🐯","✨","🥰","💌","🌷","💫","🤗","😊"];

export default async function LoveNotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: notes } = await supabase
    .from("love_notes")
    .select("*, profiles(name, role)")
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase.from("profiles").select("name, role").eq("id", user!.id).single();

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-hand text-4xl text-blush-dark font-bold">Love Notes 💌</h1>
        <p className="text-sm text-gray-500 font-sans mt-1">little reminders just for us</p>
      </div>

      <form action={addNote} className="tape bg-white rounded-3xl shadow-lg p-5 mb-6 mt-4">
        <textarea name="content" required placeholder="Write a little note… 💕"
          rows={3} className="w-full border-2 border-blush/30 rounded-2xl p-3 text-sm font-sans outline-none focus:border-blush bg-cream resize-none" />
        <div className="flex items-center gap-2 mt-3">
          <select name="mood" className="border-2 border-blush/30 rounded-xl px-3 py-2 text-sm font-sans bg-cream focus:border-blush outline-none">
            {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <button type="submit" className="ml-auto btn-primary px-6 py-2 font-sans text-sm">Send 💌</button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {notes?.map((note: any) => {
          const isMe = note.user_id === user!.id;
          const role = note.profiles?.role;
          const tapeColor = role === "rylan" ? "tape-yellow" : "tape-lavender";
          return (
            <div key={note.id} className={`tape ${tapeColor} bg-white rounded-3xl shadow-sm p-5 mt-2 ${isMe ? "ml-4" : "mr-4"} animate-fade-in`}>
              <div className="flex items-start gap-2">
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
            </div>
          );
        })}
        {!notes?.length && (
          <div className="text-center py-12 text-gray-300">
            <p className="text-5xl">💌</p>
            <p className="font-sans text-sm mt-2">No notes yet — write the first one!</p>
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
