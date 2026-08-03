"use client";
import { useState, useTransition } from "react";
import { signIn, signUp } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const handle = (action: typeof signIn | typeof signUp) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await action(fd);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative floating emoji */}
      {["💕","⭐","🌸","✨","🐯","💌","🌷","💫"].map((e, i) => (
        <span key={i} className="absolute text-2xl animate-float select-none pointer-events-none opacity-40"
          style={{ top: `${10 + (i * 11) % 80}%`, left: `${5 + (i * 13) % 85}%`, animationDelay: `${i * 0.4}s` }}>
          {e}
        </span>
      ))}

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🐯💕</div>
          <h1 className="font-hand text-5xl text-blush-dark font-bold">C & R</h1>
          <p className="text-gray-500 text-sm mt-1 font-sans">our little corner of the internet</p>
        </div>

        {/* Card */}
        <div className="tape bg-white rounded-3xl shadow-lg p-6 relative mt-4">
          {/* Tab switcher */}
          <div className="flex rounded-2xl bg-cream p-1 mb-6">
            {(["in","up"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${mode === m ? "bg-blush text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {m === "in" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 text-xs mb-3 text-center">{error}</p>}

          {mode === "in" ? (
            <form onSubmit={handle(signIn)} className="space-y-3">
              <input name="email" type="email" required placeholder="Email" className="input-field" />
              <input name="password" type="password" required placeholder="Password" className="input-field" />
              <button type="submit" disabled={pending} className="btn-primary w-full">
                {pending ? "Signing in…" : "Sign In 💕"}
              </button>
            </form>
          ) : (
            <form onSubmit={handle(signUp)} className="space-y-3">
              <input name="name" required placeholder="Your name" className="input-field" />
              <input name="email" type="email" required placeholder="Email" className="input-field" />
              <input name="password" type="password" required placeholder="Password (6+ chars)" minLength={6} className="input-field" />
              <div>
                <label className="text-xs text-gray-500 font-semibold block mb-1">Who are you? 🥰</label>
                <select name="role" required className="input-field">
                  <option value="">— pick one —</option>
                  <option value="rylan">Rylan 🐯</option>
                  <option value="caitlyn">Caitlyn 🌸</option>
                </select>
              </div>
              <button type="submit" disabled={pending} className="btn-primary w-full">
                {pending ? "Creating account…" : "Create Account ✨"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">made with 💕 just for us</p>
      </div>

      <style>{`
        .input-field { width: 100%; padding: 10px 14px; border: 2px solid #f0e0e8; border-radius: 12px; font-size: 0.875rem; outline: none; background: #fff8f0; font-family: var(--font-nunito); }
        .input-field:focus { border-color: #FFB7C5; }
        .btn-primary { padding: 11px; background: linear-gradient(135deg, #FFB7C5, #F48FB1); color: white; border-radius: 14px; font-weight: 700; font-size: 0.95rem; transition: opacity 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
