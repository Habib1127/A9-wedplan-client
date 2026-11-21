import { requireUser } from "@/lib/session";
import { ManageServices } from "@/components/dashboard/admin-tables";

export const metadata = { title: "Manage Services" };

export default async function Page() {
  await requireUser(["admin"]);
  return <ManageServices />;
}
