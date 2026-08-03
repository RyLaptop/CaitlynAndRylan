import { createClient } from "@/lib/supabase/server";
import { addItem, toggleDone, deleteItem } from "./actions";
import BackBtn from "../_back-btn";

const EMOJIS = ["🌟","✈️","🏖️","🍣","🎡","🌸","🎶","🐾","🌈","🏕️","🎭","🌙","🎨","🚀","🍰"];

export default async function BucketListPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("bucket_list")
    .select("*, profiles(name, role)")
    .order("done", { ascending: true })
    .order("created_at", { ascending: false });

  const todo = items?.filter((i: any) => !i.done) ?? [];
  const done = items?.filter((i: any) => i.done) ?? [];

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BackBtn href="/home" />
        <div>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Bucket List 🌟</h1>
          <p className="text-xs text-gray-500 font-sans">things to do together someday</p>
        </div>
      </div>

      <form action={addItem} className="tape bg-white rounded-3xl shadow-lg p-5 mb-6 mt-4">
        <div className="flex flex-col gap-2">
          <input name="text" required placeholder="Something we want to do…" className="input-field" />
          <div className="flex gap-2">
            <select name="emoji" className="input-field w-24">
              {EMOJIS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <button type="submit" className="btn-primary flex-1 py-2.5 font-sans">Add 🌟</button>
          </div>
        </div>
      </form>

      {todo.length > 0 && (
        <>
          <h2 className="font-hand text-2xl text-gray-600 mb-3">To Do ✨</h2>
          <div className="flex flex-col gap-2 mb-6">
            {todo.map((item: any) => <BucketItem key={item.id} item={item} />)}
          </div>
        </>
      )}

      {done.length > 0 && (
        <>
          <h2 className="font-hand text-2xl text-gray-400 mb-3">Done! 🎉 ({done.length})</h2>
          <div className="flex flex-col gap-2">
            {done.map((item: any) => <BucketItem key={item.id} item={item} />)}
          </div>
        </>
      )}

      {!items?.length && (
        <div className="text-center py-12 text-gray-300">
          <p className="text-5xl">🌟</p>
          <p className="font-sans text-sm mt-2">Dream big — what do we want to do together?</p>
        </div>
      )}

      <style>{`
        .input-field { width: 100%; padding: 10px 14px; border: 2px solid #f0e0e8; border-radius: 12px; font-size: 0.875rem; outline: none; background: #fff8f0; font-family: var(--font-nunito); }
        .input-field:focus { border-color: #FFB7C5; }
        .btn-primary { padding: 11px; background: linear-gradient(135deg, #FFB7C5, #F48FB1); color: white; border-radius: 14px; font-weight: 700; font-size: 0.95rem; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}

function BucketItem({ item }: { item: any }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition ${item.done ? "border-mint/40 bg-mint/10 opacity-70" : "border-blush/20 bg-white"}`}>
      <span className="text-2xl">{item.emoji}</span>
      <div className="flex-1">
        <p className={`font-sans font-semibold text-sm text-gray-700 ${item.done ? "line-through text-gray-400" : ""}`}>{item.text}</p>
        <p className="text-xs text-gray-400 font-sans">added by {item.profiles?.name}</p>
      </div>
      <form action={toggleDone.bind(null, item.id, item.done)}>
        <button type="submit" className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs transition ${item.done ? "bg-mint border-mint text-white" : "border-gray-200 hover:border-mint"}`}>
          {item.done ? "✓" : ""}
        </button>
      </form>
      <form action={deleteItem.bind(null, item.id)}>
        <button type="submit" className="text-gray-200 hover:text-red-300 text-lg transition ml-1">×</button>
      </form>
    </div>
  );
}
