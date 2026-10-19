import { createClient } from "@/lib/supabase/server";
import AdminVehicles from "@/components/admin/AdminVehicles";
import type { Car, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminVehiclesPage() {
  const supabase = await createClient();
  const [{ data }, { data: categories }] = await Promise.all([
    supabase.from("cars").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("position").order("name"),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <AdminVehicles
        cars={(data ?? []) as Car[]}
        categories={(categories ?? []) as Category[]}
      />
    </div>
  );
}
