import { requireUser } from "@/lib/session";
import { MyBookings } from "@/components/dashboard/my-bookings";

export const metadata = { title: "My Bookings" };

export default async function MyBookingsPage() {
  await requireUser(["customer"]);
  return <MyBookings />;
}
