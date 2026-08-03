"use server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient();
  const svc = createServiceClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const file = formData.get("photo") as File;
  const caption = String(formData.get("caption") || "");
  if (!file || file.size === 0) return { error: "Please select a photo" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const arrayBuf = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuf);

  const { error: upErr } = await svc.storage.from("photos").upload(path, uint8, {
    contentType: file.type,
    upsert: false,
  });

  if (upErr) return { error: `Upload failed: ${upErr.message}` };

  const { data: { publicUrl } } = svc.storage.from("photos").getPublicUrl(path);

  const { error: dbErr } = await svc.from("photos").insert({
    user_id: user.id,
    url: publicUrl,
    caption,
    storage_path: path,
  });

  if (dbErr) return { error: `Save failed: ${dbErr.message}` };

  revalidatePath("/photo-wall");
}

export async function deletePhoto(id: string, storagePath: string) {
  const svc = createServiceClient();
  await svc.storage.from("photos").remove([storagePath]);
  await svc.from("photos").delete().eq("id", id);
  revalidatePath("/photo-wall");
}
