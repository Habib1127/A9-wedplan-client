"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { fmtDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataBoundary, EmptyState, PageHeader } from "@/components/shared/ui-bits";

export function BookingRequests() {
  const { data, loading, error, reload } = useAsync(() => api("/api/vendor/bookings"), []);
  const [busy, setBusy] = useState(null);

  async function act(id, status) {
    setBusy(id + status);
    try {
      const res = await api(`/api/vendor/bookings/${id}`, { method: "PATCH", body: { status } });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err.message);
      reload();
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader title="Booking requests" text="Accept or reject requests. A request can only be answered once." />
      <DataBoundary loading={loading} error={error} onRetry={reload}>
        {data && (!data.data.length ? (
          <EmptyState title="No booking requests yet" text="Requests from customers will show up here." />
        ) : (
          <div className="grid gap-4">
            {data.data.map((b) => (
              <Card key={b._id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl">{b.service?.serviceName || "Deleted service"}</h3>
                    <p className="text-sm text-muted">Requested {fmtDate(b.createdAt)}</p>
                  </div>
                  <Badge tone={b.status}>{b.status}</Badge>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div><dt className="text-muted">Customer</dt><dd className="font-medium">{b.customer?.name}</dd><dd className="text-muted">{b.customer?.email}</dd></div>
                  <div><dt className="text-muted">Event date</dt><dd className="font-medium">{fmtDate(b.eventDate)}</dd></div>
                  <div><dt className="text-muted">Event location</dt><dd className="font-medium">{b.eventLocation}</dd></div>
                </dl>
                {b.message && <p className="mt-4 rounded-xl bg-sage/50 px-4 py-3 text-sm">{b.message}</p>}
                {b.status === "pending" && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" loading={busy === b._id + "accepted"} onClick={() => act(b._id, "accepted")}><Check className="h-4 w-4" />Accept</Button>
                    <Button size="sm" variant="danger" loading={busy === b._id + "rejected"} onClick={() => act(b._id, "rejected")}><X className="h-4 w-4" />Reject</Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ))}
      </DataBoundary>
    </>
  );
}
