import { requireUser } from "@/lib/session";
import { MyServices } from "@/components/dashboard/my-services";

export const metadata = { title: "My Services" };

export default async function MyServicesPage() {
  await requireUser(["vendor"]);
  return <MyServices />;
}
