"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { money } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { SmartImage } from "@/components/shared/smart-image";
import { DataBoundary, EmptyState, PageHeader } from "@/components/shared/ui-bits";

export function MyServices() {
  const { data, loading, error, reload } = useAsync(() => api("/api/vendor/services"), []);
  const [target, setTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function toggle(service) {
    setBusyId(service._id);
    try {
      const res = await api(`/api/vendor/services/${service._id}/availability`, { method: "PATCH", body: { isActive: !service.isActive } });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function remove() {
    setBusyId(target._id);
    try {
      const res = await api(`/api/vendor/services/${target._id}`, { method: "DELETE" });
      toast.success(res.message);
      setTarget(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageHeader title="My services" text="Track approval status and control which services customers can book." action={<Button asChild><Link href="/dashboard/add-service"><Plus className="h-4 w-4" />Add service</Link></Button>} />
      <DataBoundary loading={loading} error={error} onRetry={reload}>
        {data && (!data.data.length ? (
          <EmptyState title="No services yet" text="Add your first service and send it for admin approval." action={<Button asChild><Link href="/dashboard/add-service">Add service</Link></Button>} />
        ) : (
          <div className="grid gap-4">
            {data.data.map((s) => (
              <Card key={s._id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <SmartImage src={s.images?.[0]} className="h-28 w-full rounded-xl object-cover sm:w-40" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-2xl">{s.serviceName}</h3>
                  <p className="text-sm text-muted">{s.category} · {s.location} · {money(s.price)}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge tone={s.status}>{s.status}</Badge>
                    <Badge tone={s.isActive ? "active" : "hidden"}>{s.isActive ? "Available" : "Hidden"}</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" loading={busyId === s._id} onClick={() => toggle(s)}>{s.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}{s.isActive ? "Hide" : "Show"}</Button>
                  <Button asChild size="sm" variant="outline"><Link href={`/dashboard/my-services/${s._id}/edit`}><Pencil className="h-4 w-4" />Edit</Link></Button>
                  <Button size="sm" variant="danger" onClick={() => setTarget(s)}><Trash2 className="h-4 w-4" />Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </DataBoundary>
      <Dialog open={!!target} onOpenChange={(v) => !v && setTarget(null)}>
        <DialogContent title="Delete this service?" description={`"${target?.serviceName}" will be removed permanently.`}>
          <div className="flex justify-end gap-2">
            <DialogClose asChild><Button variant="outline">Keep it</Button></DialogClose>
            <Button variant="danger" loading={busyId === target?._id} onClick={remove}>Delete service</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
