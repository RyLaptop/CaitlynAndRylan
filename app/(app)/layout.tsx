import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BottomNav from "./_bottom-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav profile={profile} />
    </div>
  );
}
