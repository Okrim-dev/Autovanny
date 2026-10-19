import { createClient } from "@/lib/supabase/server";
import AdminCategories from "@/components/admin/AdminCategories";
import { getAdminCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("position")
    .order("name");

  return (
    <div className="mx-auto max-w-6xl">
      <AdminCategories categories={(data ?? []) as Awaited<ReturnType<typeof getAdminCategories>>} />
    </div>
  );
}
