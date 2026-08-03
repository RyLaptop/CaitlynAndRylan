import { createClient } from "@/lib/supabase/server";
import { addDeck, deleteDeck, addCard, deleteCard } from "./actions";
import FlashcardViewer from "./_flashcard-viewer";
import MdUploader from "./_md-uploader";
import BackBtn from "../_back-btn";

export default async function StudyPage({ searchParams }: { searchParams: Promise<{ deck?: string }> }) {
  const { deck } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: decks } = await supabase
    .from("decks")
    .select("*, profiles(name, role)")
    .order("created_at", { ascending: false });

  const activeDeckId = deck ?? decks?.[0]?.id ?? null;
  const activeDeck = decks?.find((d: any) => d.id === activeDeckId);

  const { data: cards } = activeDeckId
    ? await supabase.from("flashcards").select("*").eq("deck_id", activeDeckId).order("created_at")
    : { data: [] };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <BackBtn href="/home" />
        <div>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Study Together 📚</h1>
          <p className="text-xs text-gray-500 font-sans">shared flashcard decks</p>
        </div>
      </div>

      <form action={addDeck} className="tape bg-white rounded-3xl shadow-lg p-5 mb-5 mt-4">
        <p className="font-hand text-lg text-gray-600 mb-3">Create New Deck</p>
        <div className="flex flex-col gap-2">
          <input name="name" required placeholder="Deck name (e.g. Bio Midterm)…" className="input-field" />
          <input name="subject" placeholder="Subject (e.g. Biology)…" className="input-field" />
          <button type="submit" className="btn-primary py-2.5 font-sans">Create Deck ✨</button>
        </div>
      </form>

      {decks && decks.length > 0 && (
        <div className="mb-5">
          <p className="font-hand text-lg text-gray-600 mb-2">Your Decks</p>
          <div className="flex gap-2 flex-wrap">
            {decks.map((d: any) => (
              <div key={d.id} className={`flex items-center gap-1 rounded-full text-xs font-sans font-semibold transition px-3 py-1.5 ${d.id === activeDeckId ? "bg-blush text-white" : "bg-cream text-gray-500"}`}>
                <a href={`/study?deck=${d.id}`} className="flex-1">📚 {d.name}{d.subject ? ` · ${d.subject}` : ""}</a>
                <form action={deleteDeck.bind(null, d.id)}>
                  <button type="submit" className="opacity-50 hover:opacity-100 ml-1 leading-none">×</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeDeck ? (
        <>
          <div className="mb-6">
            <p className="font-hand text-xl text-gray-600 mb-3">📖 {activeDeck.name}</p>
            <FlashcardViewer cards={cards ?? []} />
          </div>

          <MdUploader deckId={activeDeckId!} />

          <form action={addCard} className="tape bg-white rounded-3xl shadow-lg p-5 mt-4">
            <p className="font-hand text-lg text-gray-600 mb-3">Add a Card</p>
            <input type="hidden" name="deck_id" value={activeDeckId!} />
            <div className="flex flex-col gap-2">
              <textarea name="front" required placeholder="Front — question or term…" rows={2}
                className="w-full border-2 border-blush/30 rounded-2xl p-3 text-sm font-sans outline-none focus:border-blush bg-cream resize-none" />
              <textarea name="back" required placeholder="Back — answer or definition…" rows={2}
                className="w-full border-2 border-blush/30 rounded-2xl p-3 text-sm font-sans outline-none focus:border-blush bg-cream resize-none" />
              <button type="submit" className="btn-primary py-2.5 font-sans">Add Card</button>
            </div>
          </form>

          {cards && cards.length > 0 && (
            <div className="mt-5 mb-8">
              <p className="font-hand text-lg text-gray-600 mb-2">All {cards.length} Cards</p>
              <div className="flex flex-col gap-2">
                {cards.map((c: any) => (
                  <div key={c.id} className="flex items-start gap-3 p-4 bg-white rounded-2xl border-2 border-blush/20">
                    <div className="flex-1">
                      <p className="text-sm font-sans font-semibold text-gray-700">{c.front}</p>
                      <p className="text-xs text-gray-500 font-sans mt-1">{c.back}</p>
                    </div>
                    <form action={deleteCard.bind(null, c.id)}>
                      <button type="submit" className="text-gray-200 hover:text-red-300 text-lg mt-0.5">×</button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-300">
          <p className="text-5xl">📚</p>
          <p className="font-sans text-sm mt-2">Create a deck above to start studying!</p>
        </div>
      )}

      <style>{`
        .input-field { width: 100%; padding: 10px 14px; border: 2px solid #f0e0e8; border-radius: 12px; font-size: 0.875rem; outline: none; background: #fff8f0; font-family: var(--font-nunito); }
        .input-field:focus { border-color: #FFB7C5; }
        .btn-primary { width: 100%; padding: 11px; background: linear-gradient(135deg, #FFB7C5, #F48FB1); color: white; border-radius: 14px; font-weight: 700; font-size: 0.95rem; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
