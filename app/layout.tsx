import type { Metadata } from "next";
import { Caveat, Nunito } from "next/font/google";
import "./globals.css";

const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", weight: ["400", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "C & R 💕",
  description: "Our little corner of the internet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${caveat.variable} ${nunito.variable}`}>
      <body className="bg-cream min-h-screen">{children}</body>
    </html>
  );
}
