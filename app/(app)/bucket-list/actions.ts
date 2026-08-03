"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const text = String(formData.get("text")).trim();
  const emoji = String(formData.get("emoji") || "🌟");
  if (!text) return;
  await supabase.from("bucket_list").insert({ user_id: user.id, text, emoji });
  revalidatePath("/bucket-list");
}

export async function toggleDone(id: string, done: boolean) {
  const supabase = await createClient();
  await supabase.from("bucket_list").update({ done: !done }).eq("id", id);
  revalidatePath("/bucket-list");
}

export async function deleteItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("bucket_list").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/bucket-list");
}
