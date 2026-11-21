import { requireUser } from "@/lib/session";
import { PageHeader } from "@/components/shared/ui-bits";
import { ServiceForm } from "@/components/dashboard/service-form";

export const metadata = { title: "Add Service" };

export default async function AddServicePage() {
  await requireUser(["vendor"]);
  return (
    <>
      <PageHeader title="Add a service" text="Free vendors can keep up to 3 active services." />
      <ServiceForm />
    </>
  );
}
