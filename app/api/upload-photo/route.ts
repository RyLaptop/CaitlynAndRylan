import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("photo") as File;
    const caption = String(formData.get("caption") || "");

    if (!file || file.size === 0) return NextResponse.json({ error: "No file selected" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const arrayBuf = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuf);

    const svc = createServiceClient();
    const { error: upErr } = await svc.storage.from("photos").upload(path, uint8, {
      contentType: file.type,
      upsert: false,
    });

    if (upErr) return NextResponse.json({ error: `Storage error: ${upErr.message}` }, { status: 500 });

    const { data: { publicUrl } } = svc.storage.from("photos").getPublicUrl(path);

    const { error: dbErr } = await svc.from("photos").insert({
      user_id: user.id,
      url: publicUrl,
      caption,
      storage_path: path,
    });

    if (dbErr) return NextResponse.json({ error: `DB error: ${dbErr.message}` }, { status: 500 });

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
