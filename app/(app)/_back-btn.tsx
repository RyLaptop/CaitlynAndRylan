"use client";
import { useRouter } from "next/navigation";

export default function BackBtn({ href }: { href?: string }) {
  const router = useRouter();
  return (
    <button onClick={() => href ? router.push(href) : router.back()}
      className="text-gray-400 hover:text-gray-600 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition flex-shrink-0">
      ‹
    </button>
  );
}
