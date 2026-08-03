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

      {/* Washi tape divider */}
      <div className="-mx-4 mb-4 overflow-hidden">
        <Image src="/washi-tape-heart-lavender.svg" alt="" width={400} height={55} className="w-full opacity-60"/>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {photos?.map((photo: any) => (
          <div key={photo.id} className="relative group">
            {/* Polaroid frame */}
            <div className="relative bg-white shadow-lg rounded-sm p-2 pb-8 rotate-[-1deg] hover:rotate-0 transition-transform duration-300"
              style={{ boxShadow: "2px 4px 14px rgba(0,0,0,0.13)" }}>
              {/* Tape piece on top */}
              <Image src="/tape-corner.svg" alt="" width={48} height={48}
                className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-85 pointer-events-none z-10"/>
              {/* Photo */}
              <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                <Image src={photo.url} alt={photo.caption || "Photo"} fill className="object-cover"/>
              </div>
              {/* Caption area */}
              <div className="pt-2 text-center px-1">
                {photo.caption && (
                  <p className="font-hand text-sm text-gray-600 leading-tight">{photo.caption}</p>
                )}
                <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                  {photo.profiles?.name} {photo.profiles?.role === "rylan" ? "🐯" : "🌸"}
                </p>
              </div>
            </div>
            {/* Delete button */}
            {photo.user_id === user!.id && (
              <form action={deletePhoto.bind(null, photo.id, photo.storage_path)}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition z-20">
                <button type="submit"
                  className="w-6 h-6 bg-red-400 text-white rounded-full text-xs flex items-center justify-center shadow">×</button>
              </form>
            )}
          </div>
        ))}
        {!photos?.length && (
          <div className="col-span-2 text-center py-12 flex flex-col items-center gap-3">
            <Image src="/polaroid-frame.svg" alt="" width={120} height={145} className="opacity-40"/>
            <p className="font-sans text-sm text-gray-300">Upload your first photo together!</p>
          </div>
        )}
      </div>
      <div className="h-8"/>
    </div>
  );
}
