import { createClient } from "@/lib/supabase/server";
import { addDeck, deleteDeck, addCard, deleteCard } from "./actions";
import FlashcardViewer from "./_flashcard-viewer";

export default async function StudyPage({ searchParams }: { searchParams: { deck?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: decks } = await supabase
    .from("decks")
    .select("*, profiles(name, role)")
    .order("created_at", { ascending: false });

  const activeDeckId = searchParams.deck ?? decks?.[0]?.id ?? null;
  const activeDeck = decks?.find((d: any) => d.id === activeDeckId);

  const { data: cards } = activeDeckId
    ? await supabase.from("flashcards").select("*").eq("deck_id", activeDeckId).order("created_at")
    : { data: [] };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-hand text-4xl text-blush-dark font-bold">Study Together 📚</h1>
        <p className="text-sm text-gray-500 font-sans mt-1">shared flashcard decks</p>
      </div>

      <form action={addDeck} className="tape bg-white rounded-3xl shadow-lg p-5 mb-5 mt-4">
        <p className="font-hand text-lg text-gray-600 mb-2">New Deck</p>
        <div className="flex gap-2">
          <input name="name" required placeholder="Deck name…" className="input-field flex-1" />
          <input name="subject" placeholder="Subject" className="input-field w-28" />
          <button type="submit" className="btn-primary px-4 font-sans text-sm">+</button>
        </div>
      </form>

      {decks && decks.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          {decks.map((d: any) => (
            <a key={d.id} href={`/study?deck=${d.id}`}
              className={`px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition flex items-center gap-1 ${d.id === activeDeckId ? "bg-blush text-white" : "bg-cream text-gray-500 hover:bg-blush/20"}`}>
              📚 {d.name}
              <form action={deleteDeck.bind(null, d.id)} className="ml-1">
                <button type="submit" className="text-current opacity-50 hover:opacity-100 leading-none" onClick={(e) => e.stopPropagation()}>×</button>
              </form>
            </a>
          ))}
        </div>
      )}

      {activeDeck ? (
        <>
          <div className="mb-6">
            <FlashcardViewer cards={cards ?? []} />
          </div>

          <form action={addCard} className="tape bg-white rounded-3xl shadow-lg p-5 mt-4">
            <p className="font-hand text-lg text-gray-600 mb-2">Add Card to "{activeDeck.name}"</p>
            <input type="hidden" name="deck_id" value={activeDeckId!} />
            <div className="flex flex-col gap-2">
              <input name="front" required placeholder="Front (question)…" className="input-field" />
              <input name="back" required placeholder="Back (answer)…" className="input-field" />
              <button type="submit" className="btn-primary py-2.5 font-sans">Add Card</button>
            </div>
          </form>

          {cards && cards.length > 0 && (
            <div className="mt-4">
              <p className="font-hand text-lg text-gray-600 mb-2">All Cards ({cards.length})</p>
              <div className="flex flex-col gap-2">
                {cards.map((c: any) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-blush/20">
                    <div className="flex-1">
                      <p className="text-sm font-sans font-semibold text-gray-700">{c.front}</p>
                      <p className="text-xs text-gray-500 font-sans">{c.back}</p>
                    </div>
                    <form action={deleteCard.bind(null, c.id)}>
                      <button type="submit" className="text-gray-200 hover:text-red-300 text-lg">×</button>
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
          <p className="font-sans text-sm mt-2">Create a deck to start studying!</p>
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
