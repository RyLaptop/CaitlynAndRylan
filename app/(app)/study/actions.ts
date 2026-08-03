"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addDeck(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const name = String(formData.get("name")).trim();
  const subject = String(formData.get("subject") || "");
  if (!name) return;
  await supabase.from("decks").insert({ user_id: user.id, name, subject });
  revalidatePath("/study");
}

export async function deleteDeck(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("flashcards").delete().eq("deck_id", id);
  await supabase.from("decks").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/study");
}

export async function addCard(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const deck_id = String(formData.get("deck_id"));
  const front = String(formData.get("front")).trim();
  const back = String(formData.get("back")).trim();
  if (!front || !back) return;
  await supabase.from("flashcards").insert({ deck_id, front, back });
  revalidatePath("/study");
}

export async function deleteCard(id: string) {
  const supabase = await createClient();
  await supabase.from("flashcards").delete().eq("id", id);
  revalidatePath("/study");
}
