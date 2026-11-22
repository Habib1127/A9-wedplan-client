import { requireUser } from "@/lib/session";
import { Overview } from "@/components/dashboard/overview";

export default async function DashboardHome() {
  const user = await requireUser();
  return <Overview role={user.role} name={user.name} />;
}
