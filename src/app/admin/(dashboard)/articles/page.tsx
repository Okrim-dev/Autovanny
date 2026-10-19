import { createClient } from "@/lib/supabase/server";
import AdminArticles from "@/components/admin/AdminArticles";
import type { Article } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl">
      <AdminArticles articles={(data ?? []) as Article[]} />
    </div>
  );
}
