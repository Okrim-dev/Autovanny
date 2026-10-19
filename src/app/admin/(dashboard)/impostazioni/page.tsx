import { createClient } from "@/lib/supabase/server";
import AdminSettings from "@/components/admin/AdminSettings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AdminSettings userEmail={user?.email ?? "admin@autovanny.com"} />;
}
