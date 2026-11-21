"use client";

import { api } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { DataBoundary } from "@/components/shared/ui-bits";
import { ServiceForm } from "@/components/dashboard/service-form";

export function EditService({ id }) {
  const { data, loading, error, reload } = useAsync(() => api(`/api/vendor/services/${id}`), [id]);
  return (
    <DataBoundary loading={loading} error={error} onRetry={reload}>
      {data && <ServiceForm initial={data.data} serviceId={id} />}
    </DataBoundary>
  );
}
