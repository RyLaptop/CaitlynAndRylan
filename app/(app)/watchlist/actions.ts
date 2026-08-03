"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const title = String(formData.get("title")).trim();
  const type = String(formData.get("type") || "movie");
  const where = String(formData.get("where") || "");
  if (!title) return;
  await supabase.from("watchlist").insert({ user_id: user.id, title, type, where });
  revalidatePath("/watchlist");
}

export async function toggleWatched(id: string, watched: boolean) {
  const supabase = await createClient();
  await supabase.from("watchlist").update({ watched: !watched }).eq("id", id);
  revalidatePath("/watchlist");
}

export async function deleteItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("watchlist").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/watchlist");
}
