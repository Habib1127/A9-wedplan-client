import { requireUser } from "@/lib/session";
import { Transactions } from "@/components/dashboard/admin-tables";

export const metadata = { title: "Transactions" };

export default async function Page() {
  await requireUser(["admin"]);
  return <Transactions />;
}
