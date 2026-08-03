import { createServiceClient } from "@/lib/supabase/service";
import { petAction } from "./actions";

function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function getMood(hunger: number, happiness: number, energy: number) {
  const avg = (hunger + happiness + energy) / 3;
  if (avg >= 75) return { emoji: "🐯", anim: "animate-pet-bounce", mood: "happy & playful!" };
  if (avg >= 50) return { emoji: "🐯", anim: "animate-pet-breathe", mood: "doing okay~" };
  if (avg >= 25) return { emoji: "😿", anim: "", mood: "needs some love…" };
  return { emoji: "😿", anim: "animate-shake", mood: "please take care of me!" };
}

export default async function PetPage() {
  const svc = createServiceClient();
  const { data: pet } = await svc.from("pets").select("*, profiles(name)").eq("id", 1).maybeSingle();

  const hunger = pet?.hunger ?? 50;
  const happiness = pet?.happiness ?? 50;
  const energy = pet?.energy ?? 50;
  const { emoji, anim, mood } = getMood(hunger, happiness, energy);

  const lastBy = pet?.profiles?.name ?? null;
  const lastAction = pet?.last_action ?? null;

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-4">
        <h1 className="font-hand text-4xl text-blush-dark font-bold">Stripes 🐯</h1>
        <p className="text-sm text-gray-500 font-sans">our baby siberian tiger cub</p>
      </div>

      <div className="tape bg-white rounded-3xl shadow-lg p-6 text-center mt-4 mb-6">
        <div className={`text-9xl select-none ${anim}`}>{emoji}</div>
        <p className="font-hand text-xl text-gray-600 mt-3">{mood}</p>
        {lastBy && (
          <p className="text-xs text-gray-400 font-sans mt-1">
            last cared for by {lastBy} · {lastAction === "feed" ? "fed 🍗" : lastAction === "play" ? "played 🎾" : "put to sleep 💤"}
          </p>
        )}
      </div>

      <div className="tape bg-white rounded-3xl p-5 shadow-sm mb-6 mt-4 flex flex-col gap-4">
        <div>
          <div className="flex justify-between text-xs font-sans text-gray-500 mb-1.5">
            <span>🍗 Hunger</span><span>{hunger}%</span>
          </div>
          <StatBar value={hunger} color="bg-peach" />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans text-gray-500 mb-1.5">
            <span>💕 Happiness</span><span>{happiness}%</span>
          </div>
          <StatBar value={happiness} color="bg-blush" />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans text-gray-500 mb-1.5">
            <span>⚡ Energy</span><span>{energy}%</span>
          </div>
          <StatBar value={energy} color="bg-mint" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <form action={petAction.bind(null, "feed")}>
          <button type="submit" className="w-full py-4 bg-peach/30 rounded-2xl flex flex-col items-center gap-1 hover:bg-peach/50 transition active:scale-95">
            <span className="text-3xl">🍗</span>
            <span className="text-xs font-sans font-semibold text-gray-600">Feed</span>
          </button>
        </form>
        <form action={petAction.bind(null, "play")}>
          <button type="submit" className="w-full py-4 bg-blush/20 rounded-2xl flex flex-col items-center gap-1 hover:bg-blush/30 transition active:scale-95">
            <span className="text-3xl">🎾</span>
            <span className="text-xs font-sans font-semibold text-gray-600">Play</span>
          </button>
        </form>
        <form action={petAction.bind(null, "sleep")}>
          <button type="submit" className="w-full py-4 bg-lavender/20 rounded-2xl flex flex-col items-center gap-1 hover:bg-lavender/30 transition active:scale-95">
            <span className="text-3xl">💤</span>
            <span className="text-xs font-sans font-semibold text-gray-600">Sleep</span>
          </button>
        </form>
      </div>

      <p className="text-xs text-gray-400 font-sans text-center mt-4">
        Both of you share Stripes — take care of her together! 🐾
      </p>
    </div>
  );
}
