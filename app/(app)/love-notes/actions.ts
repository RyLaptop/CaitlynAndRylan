"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const content = String(formData.get("content")).trim();
  const mood = String(formData.get("mood") || "💕");
  if (!content) return;

  await supabase.from("love_notes").insert({ user_id: user.id, content, mood });
  revalidatePath("/love-notes");
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("love_notes").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/love-notes");
}
