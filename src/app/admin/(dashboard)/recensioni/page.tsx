import { createClient } from "@/lib/supabase/server";
import AdminReviews from "@/components/admin/AdminReviews";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .order("position")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl">
      <AdminReviews reviews={(data ?? []) as Review[]} />
    </div>
  );
}
