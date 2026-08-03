"use client";
import { useState, useRef } from "react";

export default function MdUploader({ deckId }: { deckId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState<{ text: string; ok: boolean } | null>(null);
  const inputRef              = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".md") && !file.name.endsWith(".txt")) {
      setMsg({ text: "Please upload a .md or .txt file", ok: false });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("deck_id", deckId);
      const res  = await fetch("/api/parse-study", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) {
        setMsg({ text: data.error ?? "Failed to parse file", ok: false });
      } else {
        setMsg({ text: `Added ${data.count} flashcard${data.count !== 1 ? "s" : ""} from your file! 🎉`, ok: true });
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err: any) {
      setMsg({ text: err?.message ?? "Upload failed", ok: false });
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="mt-4">
      <label className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed cursor-pointer transition
        ${loading ? "border-gray-200 bg-gray-50" : "border-blush/40 bg-cream/50 hover:border-blush"}`}>
        <span className="text-2xl">{loading ? "⏳" : "📄"}</span>
        <div className="flex-1">
          <p className="font-sans font-semibold text-sm text-gray-700">
            {loading ? "Parsing file…" : "Upload .md file → auto-generate cards"}
          </p>
          <p className="text-xs text-gray-400 font-sans">
            Detects **Term**: Definition, ## Headings, - bullet: patterns
          </p>
        </div>
        <input ref={inputRef} type="file" accept=".md,.txt" className="hidden" onChange={handleFile} disabled={loading}/>
      </label>
      {msg && (
        <p className={`mt-2 text-xs font-sans text-center font-semibold ${msg.ok ? "text-mint" : "text-red-400"}`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
