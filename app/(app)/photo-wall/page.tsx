import { createClient } from "@/lib/supabase/server";
import { deletePhoto } from "./actions";
import UploadForm from "./_upload-form";
import Image from "next/image";
import BackBtn from "../_back-btn";

export default async function PhotoWallPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: photos } = await supabase
    .from("photos")
    .select("*, profiles(name, role)")
    .order("created_at", { ascending: false });

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <BackBtn href="/home" />
        <div>
          <h1 className="font-hand text-3xl text-blush-dark font-bold">Photo Wall 📸</h1>
          <p className="text-xs text-gray-500 font-sans">our memories ✨</p>
        </div>
      </div>

      <UploadForm />

      <div className="grid grid-cols-2 gap-3">
        {photos?.map((photo: any) => (
          <div key={photo.id} className="polaroid relative group mt-2">
            <div className="relative w-full aspect-square overflow-hidden rounded-sm">
              <Image src={photo.url} alt={photo.caption || "Photo"} fill className="object-cover" />
            </div>
            {photo.caption && (
              <p className="font-hand text-sm text-gray-600 mt-1 text-center">{photo.caption}</p>
            )}
            <p className="text-xs text-gray-400 font-sans text-center mt-0.5">
              {photo.profiles?.name} {photo.profiles?.role === "rylan" ? "🐯" : "🌸"}
            </p>
            {photo.user_id === user!.id && (
              <form action={deletePhoto.bind(null, photo.id, photo.storage_path)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
                <button type="submit"
                  className="w-6 h-6 bg-red-400 text-white rounded-full text-xs flex items-center justify-center shadow">×</button>
              </form>
            )}
          </div>
        ))}
        {!photos?.length && (
          <div className="col-span-2 text-center py-12 text-gray-300">
            <p className="text-5xl">📸</p>
            <p className="font-sans text-sm mt-2">Upload your first photo together!</p>
          </div>
        )}
      </div>
    </div>
  );
}
