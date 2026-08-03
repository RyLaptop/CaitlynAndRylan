"use client";
import { useState, useRef } from "react";
import { uploadPhoto } from "./actions";

export default function UploadForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await uploadPhoto(fd);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setPreview(null);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="tape bg-white rounded-3xl shadow-lg p-5 mb-6 mt-4">
      <div className="flex flex-col gap-2">
        <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blush/40 rounded-2xl h-28 cursor-pointer hover:border-blush transition bg-cream/50 overflow-hidden relative">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <span className="text-3xl">📷</span>
              <span className="text-xs text-gray-400 font-sans mt-1">Click to choose a photo</span>
            </>
          )}
          <input name="photo" type="file" accept="image/*" required className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }} />
        </label>
        <input name="caption" placeholder="Caption… (optional)" className="input-field" />
        {error && <p className="text-red-400 text-xs font-sans text-center">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary py-2.5 font-sans">
          {loading ? "Uploading…" : "Upload 📸"}
        </button>
      </div>
      <style>{`
        .input-field { width:100%;padding:10px 14px;border:2px solid #f0e0e8;border-radius:12px;font-size:0.875rem;outline:none;background:#fff8f0;font-family:var(--font-nunito); }
        .input-field:focus { border-color:#FFB7C5; }
        .btn-primary { width:100%;padding:11px;background:linear-gradient(135deg,#FFB7C5,#F48FB1);color:white;border-radius:14px;font-weight:700;font-size:0.95rem;transition:opacity 0.2s;border:none;cursor:pointer; }
        .btn-primary:hover { opacity:0.9; }
        .btn-primary:disabled { opacity:0.6;cursor:not-allowed; }
      `}</style>
    </form>
  );
}
