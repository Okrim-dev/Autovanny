import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Accesso Admin",
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/admin");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #d03732 0, transparent 45%), radial-gradient(circle at 80% 80%, #d03732 0, transparent 45%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center text-white">
          <div className="flex items-center justify-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-lg font-black text-white">
              A
            </span>
            <div className="text-left">
              <p className="text-lg font-bold leading-tight tracking-tight">AutoVanny</p>
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-7 shadow-2xl sm:p-8">
          <h1 className="text-xl font-bold tracking-tight text-ink">Accedi all&apos;area riservata</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Inserisci le tue credenziali per gestire il parco auto e il blog.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
