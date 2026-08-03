"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMilestone(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const title = String(formData.get("title")).trim();
  const date = String(formData.get("date")).trim();
  const note = String(formData.get("note") || "");
  const emoji = String(formData.get("emoji") || "💕");
  if (!title || !date) return;
  await supabase.from("timeline").insert({ user_id: user.id, title, date, note, emoji });
  revalidatePath("/timeline");
}

export async function deleteMilestone(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("timeline").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/timeline");
}
