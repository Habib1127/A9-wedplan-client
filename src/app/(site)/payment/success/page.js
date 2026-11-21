import { requireUser } from "@/lib/session";
import { PaymentStatus } from "@/components/shared/payment-status";

export const metadata = { title: "Payment Success" };

export default async function PaymentSuccessPage({ searchParams }) {
  await requireUser(["vendor"]);
  const { session_id: sessionId } = await searchParams;
  return <PaymentStatus sessionId={sessionId} />;
}
