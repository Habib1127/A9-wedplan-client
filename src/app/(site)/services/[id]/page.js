import { requireUser } from "@/lib/session";
import { ServiceDetails } from "@/components/shared/service-details";

export const metadata = { title: "Service Details" };

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params;
  const user = await requireUser();
  return <ServiceDetails id={id} user={{ id: user.id, role: user.role }} />;
}
