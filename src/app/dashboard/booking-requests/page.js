import { requireUser } from "@/lib/session";
import { BookingRequests } from "@/components/dashboard/booking-requests";

export const metadata = { title: "Booking Requests" };

export default async function BookingRequestsPage() {
  await requireUser(["vendor"]);
  return <BookingRequests />;
}
