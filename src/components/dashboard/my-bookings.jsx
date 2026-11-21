"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { fmtDate, money } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { SmartImage } from "@/components/shared/smart-image";
import { DataBoundary, EmptyState, PageHeader } from "@/components/shared/ui-bits";

export function MyBookings() {
  const { data, loading, error, reload } = useAsync(() => api("/api/customer/bookings"), []);
  const [details, setDetails] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  async function cancel() {
    setBusy(true);
    try {
      const res = await api(`/api/customer/bookings/${cancelTarget._id}/cancel`, { method: "PATCH" });
      toast.success(res.message);
      setCancelTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      reload();
    }
  }

  return (
    <>
      <PageHeader title="My bookings" text="Follow each request and cancel any that are still pending." />
      <DataBoundary loading={loading} error={error} onRetry={reload}>
        {data && (!data.data.length ? (
          <EmptyState title="No booking requests yet" text="Find a service you like and send your first request." action={<Button asChild><Link href="/services">Browse services</Link></Button>} />
        ) : (
          <div className="grid gap-4">
            {data.data.map((b) => (
              <Card key={b._id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <SmartImage src={b.service?.images?.[0]} className="h-24 w-full rounded-xl object-cover sm:w-36" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-2xl">{b.service?.serviceName || "Service removed"}</h3>
                  <p className="text-sm text-muted">{b.vendor?.businessName || b.vendor?.name} · Event on {fmtDate(b.eventDate)}</p>
                  <p className="text-sm text-muted">{b.eventLocation} · Requested {fmtDate(b.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={b.status}>{b.status}</Badge>
                  <Button size="sm" variant="outline" onClick={() => setDetails(b)}>Details</Button>
                  {b.status === "pending" && <Button size="sm" variant="danger" onClick={() => setCancelTarget(b)}>Cancel</Button>}
                </div>
              </Card>
            ))}
          </div>
        ))}
      </DataBoundary>

      <Dialog open={!!details} onOpenChange={(v) => !v && setDetails(null)}>
        <DialogContent title={details?.service?.serviceName || "Booking details"} description="Your booking request">
          {details && (
            <dl className="space-y-3 text-sm">
              <Row label="Status"><Badge tone={details.status}>{details.status}</Badge></Row>
              <Row label="Vendor">{details.vendor?.businessName || details.vendor?.name}</Row>
              <Row label="Vendor email">{details.vendor?.email}</Row>
              <Row label="Service price">{money(details.service?.price)}</Row>
              <Row label="Event date">{fmtDate(details.eventDate)}</Row>
              <Row label="Event location">{details.eventLocation}</Row>
              <Row label="Requested on">{fmtDate(details.createdAt)}</Row>
              {details.message && <Row label="Your message">{details.message}</Row>}
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!cancelTarget} onOpenChange={(v) => !v && setCancelTarget(null)}>
        <DialogContent title="Cancel this request?" description="The vendor will no longer see it as pending.">
          <div className="flex justify-end gap-2">
            <DialogClose asChild><Button variant="outline">Keep request</Button></DialogClose>
            <Button variant="danger" loading={busy} onClick={cancel}>Cancel request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
