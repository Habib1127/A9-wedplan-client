import { requireUser } from "@/lib/session";
import { ManageUsers } from "@/components/dashboard/admin-tables";

export const metadata = { title: "Manage Users" };

export default async function Page() {
  await requireUser(["admin"]);
  return <ManageUsers />;
}
