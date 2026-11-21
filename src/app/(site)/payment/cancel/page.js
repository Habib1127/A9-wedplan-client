import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Payment Cancelled" };

export default async function PaymentCancelPage() {
  await requireUser(["vendor"]);
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-4xl">Payment cancelled</h1>
      <p className="mb-6 mt-2 text-sm text-muted">No charge was made. You can upgrade any time from your subscription page.</p>
      <Button asChild><Link href="/dashboard/subscription">Back to subscription</Link></Button>
    </div>
  );
}
