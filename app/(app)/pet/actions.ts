"use server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type Action = "feed" | "play" | "sleep";

const COSTS: Record<Action, Partial<{ hunger: number; happiness: number; energy: number }>> = {
  feed:  { hunger: 30 },
  play:  { happiness: 25, energy: -15 },
  sleep: { energy: 40 },
};

export async function petAction(action: Action) {
  const supabase = await createClient();
  const svc = createServiceClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: pet } = await svc.from("pets").select("*").eq("id", 1).single();
  if (!pet) return;

  const delta = COSTS[action];
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const updates: Record<string, number | string> = {
    last_interaction: new Date().toISOString(),
    last_action: action,
    last_interacted_by: user.id,
  };
  if (delta.hunger !== undefined) updates.hunger = clamp(pet.hunger + delta.hunger);
  if (delta.happiness !== undefined) updates.happiness = clamp(pet.happiness + delta.happiness);
  if (delta.energy !== undefined) updates.energy = clamp(pet.energy + delta.energy);

  await svc.from("pets").update(updates).eq("id", 1);
  revalidatePath("/pet");
}
