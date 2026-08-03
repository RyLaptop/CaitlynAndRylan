"use server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const svc = createServiceClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const name = String(formData.get("name"));
  const role = String(formData.get("role")) as "rylan" | "caitlyn";

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  if (data.user) {
    await svc.from("profiles").upsert({ id: data.user.id, name, role });
  }
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
