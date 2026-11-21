import { requireUser } from "@/lib/session";
import { Subscription } from "@/components/dashboard/subscription";

export const metadata = { title: "Subscription" };

export default async function SubscriptionPage() {
  await requireUser(["vendor"]);
  return <Subscription />;
}
