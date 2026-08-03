import { createClient } from "@/lib/supabase/server";
import { uploadPhoto, deletePhoto } from "./actions";
import Image from "next/image";

export default async function PhotoWallPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: photos } = await supabase
    .from("photos")
    .select("*, profiles(name, role)")
    .order("created_at", { ascending: false });

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-hand text-4xl text-blush-dark font-bold">Photo Wall 📸</h1>
        <p className="text-sm text-gray-500 font-sans mt-1">our memories ✨</p>
      </div>

      <form action={uploadPhoto} encType="multipart/form-data"
        className="tape bg-white rounded-3xl shadow-lg p-5 mb-6 mt-4">
        <div className="flex flex-col gap-2">
          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blush/40 rounded-2xl h-24 cursor-pointer hover:border-blush transition bg-cream/50">
            <span className="text-2xl">📷</span>
            <span className="text-xs text-gray-400 font-sans mt-1">Click to choose a photo</span>
            <input name="photo" type="file" accept="image/*" required className="hidden" />
          </label>
          <input name="caption" placeholder="Caption… (optional)" className="input-field" />
          <button type="submit" className="btn-primary py-2.5 font-sans">Upload 📸</button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-3">
        {photos?.map((photo: any) => (
          <div key={photo.id} className="polaroid relative group mt-2">
            <div className="relative w-full aspect-square overflow-hidden">
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
                <button type="submit" className="w-6 h-6 bg-red-400 text-white rounded-full text-xs flex items-center justify-center">×</button>
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

      <style>{`
        .input-field { width: 100%; padding: 10px 14px; border: 2px solid #f0e0e8; border-radius: 12px; font-size: 0.875rem; outline: none; background: #fff8f0; font-family: var(--font-nunito); }
        .input-field:focus { border-color: #FFB7C5; }
        .btn-primary { width: 100%; padding: 11px; background: linear-gradient(135deg, #FFB7C5, #F48FB1); color: white; border-radius: 14px; font-weight: 700; font-size: 0.95rem; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
