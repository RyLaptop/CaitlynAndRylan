import { createServiceClient } from "@/lib/supabase/service";
import PetClient from "./_pet-client";

export default async function PetPage() {
  const svc = createServiceClient();
  const { data: pet } = await svc
    .from("pets")
    .select("*, profiles(name)")
    .eq("id", 1)
    .maybeSingle();

  const hunger    = pet?.hunger    ?? 60;
  const happiness = pet?.happiness ?? 70;
  const energy    = pet?.energy    ?? 80;
  const lastBy    = pet?.profiles?.name ?? null;
  const lastAction = pet?.last_action ?? null;

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-4">
        <h1 className="font-hand text-4xl text-blush-dark font-bold">Stripes 🐯</h1>
        <p className="text-sm text-gray-500 font-sans">our baby siberian tiger cub</p>
      </div>

      <PetClient
        initialStats={{ hunger, happiness, energy }}
        lastBy={lastBy}
        lastAction={lastAction}
      />
    </div>
  );
}
