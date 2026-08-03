"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addSong(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const title = String(formData.get("title")).trim();
  const artist = String(formData.get("artist")).trim();
  const note = String(formData.get("note") || "");
  const spotify_url = String(formData.get("spotify_url") || "");
  if (!title) return;
  await supabase.from("songs").insert({ user_id: user.id, title, artist, note, spotify_url });
  revalidatePath("/music");
}

export async function deleteSong(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("songs").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/music");
}
