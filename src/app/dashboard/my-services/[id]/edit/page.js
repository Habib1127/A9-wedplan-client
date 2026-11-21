import { requireUser } from "@/lib/session";
import { PageHeader } from "@/components/shared/ui-bits";
import { EditService } from "@/components/dashboard/edit-service";

export const metadata = { title: "Edit Service" };

export default async function EditServicePage({ params }) {
  await requireUser(["vendor"]);
  const { id } = await params;
  return (
    <>
      <PageHeader title="Edit service" />
      <EditService id={id} />
    </>
  );
}
