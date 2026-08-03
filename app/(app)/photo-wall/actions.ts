"use server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient();
  const svc = createServiceClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const file = formData.get("photo") as File;
  const caption = String(formData.get("caption") || "");
  if (!file || file.size === 0) return;

  const ext = file.name.split(".").pop();
  const path = `${user.id}/${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await svc.storage.from("photos").upload(path, buf, { contentType: file.type });
  if (upErr) return;

  const { data: { publicUrl } } = svc.storage.from("photos").getPublicUrl(path);
  await svc.from("photos").insert({ user_id: user.id, url: publicUrl, caption, storage_path: path });
  revalidatePath("/photo-wall");
}

export async function deletePhoto(id: string, storagePath: string) {
  const supabase = await createClient();
  const svc = createServiceClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await svc.storage.from("photos").remove([storagePath]);
  await svc.from("photos").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/photo-wall");
}
