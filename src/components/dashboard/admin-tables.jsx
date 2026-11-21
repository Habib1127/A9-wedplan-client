"use client";

import { useEffect, useState } from "react";
import { Ban, Check, Trash2, UserCheck, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { fmtDate, money } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/input";
import { SmartImage } from "@/components/shared/smart-image";
import { DataBoundary, EmptyState, PageHeader } from "@/components/shared/ui-bits";
import { CATEGORIES } from "@/lib/constants";

function useDebounced(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const th = "px-4 py-3 text-left text-xs font-medium text-muted";
const td = "px-4 py-3 align-middle";

function TableShell({ children }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">{children}</table>
    </Card>
  );
}

export function ManageUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const q = useDebounced(search);
  const { data, loading, error, reload } = useAsync(() => api(`/api/admin/users?search=${encodeURIComponent(q)}&role=${role}`), [q, role]);
  const [detail, setDetail] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function toggleBlock(user) {
    setBusyId(user.id);
    try {
      const res = await api(`/api/admin/users/${user.id}/block`, { method: "PATCH", body: { isBlocked: !user.isBlocked } });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function openDetail(id) {
    try {
      const res = await api(`/api/admin/users/${id}`);
      setDetail(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <PageHeader title="Manage users" text="Search accounts, review details and block or unblock access." />
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px]">
        <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search users" />
        <Select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role">
          <option value="">All roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </Select>
      </div>
      <DataBoundary loading={loading} error={error} onRetry={reload}>
        {data && (!data.data.length ? <EmptyState title="No users found" text="Try a different search or role filter." /> : (
          <TableShell>
            <thead className="border-b border-border bg-sage/40"><tr><th className={th}>User</th><th className={th}>Role</th><th className={th}>Plan</th><th className={th}>Status</th><th className={th}>Joined</th><th className={th}></th></tr></thead>
            <tbody className="divide-y divide-border">
              {data.data.map((u) => (
                <tr key={u.id}>
                  <td className={td}><p className="font-medium">{u.name}</p><p className="text-muted">{u.email}</p></td>
                  <td className={td}><Badge>{u.role}</Badge></td>
                  <td className={td}>{u.role === "vendor" ? <Badge tone={u.subscriptionPlan}>{u.subscriptionPlan}</Badge> : "-"}</td>
                  <td className={td}><Badge tone={u.isBlocked ? "blocked" : "active"}>{u.isBlocked ? "Blocked" : "Active"}</Badge></td>
                  <td className={td}>{fmtDate(u.createdAt)}</td>
                  <td className={`${td} text-right`}>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openDetail(u.id)}>Details</Button>
                      {u.role !== "admin" && (
                        <Button size="sm" variant={u.isBlocked ? "default" : "danger"} loading={busyId === u.id} onClick={() => toggleBlock(u)}>
                          {u.isBlocked ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}{u.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ))}
      </DataBoundary>
      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent title={detail?.name || "User"} description={detail?.email}>
          {detail && (
            <dl className="space-y-3 text-sm">
              {[
                ["Role", detail.role],
                ["Status", detail.isBlocked ? "Blocked" : "Active"],
                ["Business", detail.businessName || "-"],
                ["Phone", detail.phone || "-"],
                ["Plan", detail.role === "vendor" ? detail.subscriptionPlan : "-"],
                ["Services", detail.serviceCount],
                ["Bookings", detail.bookingCount],
                ["Joined", fmtDate(detail.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-2"><dt className="text-muted">{k}</dt><dd className="font-medium capitalize">{v}</dd></div>
              ))}
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ManageServices() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const q = useDebounced(search);
  const { data, loading, error, reload } = useAsync(
    () => api(`/api/admin/services?search=${encodeURIComponent(q)}&status=${status}&category=${encodeURIComponent(category)}`),
    [q, status, category],
  );
  const [target, setTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function setServiceStatus(id, next) {
    setBusyId(id);
    try {
      const res = await api(`/api/admin/services/${id}/status`, { method: "PATCH", body: { status: next } });
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
      const res = await api(`/api/admin/services/${target._id}`, { method: "DELETE" });
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
      <PageHeader title="Manage services" text="Approve or reject submissions and remove inappropriate listings." />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_190px_230px]">
        <Input placeholder="Search by service name" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search services" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </Select>
      </div>
      <DataBoundary loading={loading} error={error} onRetry={reload}>
        {data && (!data.data.length ? <EmptyState title="No services found" text="Adjust the filters to see more." /> : (
          <TableShell>
            <thead className="border-b border-border bg-sage/40"><tr><th className={th}>Service</th><th className={th}>Vendor</th><th className={th}>Price</th><th className={th}>Status</th><th className={th}></th></tr></thead>
            <tbody className="divide-y divide-border">
              {data.data.map((s) => (
                <tr key={s._id}>
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <SmartImage src={s.images?.[0]} className="h-12 w-16 rounded-lg object-cover" />
                      <div><p className="font-medium">{s.serviceName}</p><p className="text-muted">{s.category}</p></div>
                    </div>
                  </td>
                  <td className={td}><p>{s.vendor?.name}</p><p className="text-muted">{s.vendor?.email}</p></td>
                  <td className={td}>{money(s.price)}</td>
                  <td className={td}><Badge tone={s.status}>{s.status}</Badge></td>
                  <td className={`${td} text-right`}>
                    <div className="flex justify-end gap-2">
                      {s.status !== "approved" && <Button size="sm" loading={busyId === s._id} onClick={() => setServiceStatus(s._id, "approved")}><Check className="h-4 w-4" />Approve</Button>}
                      {s.status !== "rejected" && <Button size="sm" variant="outline" loading={busyId === s._id} onClick={() => setServiceStatus(s._id, "rejected")}><X className="h-4 w-4" />Reject</Button>}
                      {s.status === "approved" && <Button size="sm" variant="ghost" onClick={() => setServiceStatus(s._id, "pending")}>Unpublish</Button>}
                      <Button size="sm" variant="danger" onClick={() => setTarget(s)} aria-label="Delete service"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ))}
      </DataBoundary>
      <Dialog open={!!target} onOpenChange={(v) => !v && setTarget(null)}>
        <DialogContent title="Delete this service?" description={`"${target?.serviceName}" will be removed and its pending requests cancelled.`}>
          <div className="flex justify-end gap-2">
            <DialogClose asChild><Button variant="outline">Keep it</Button></DialogClose>
            <Button variant="danger" loading={busyId === target?._id} onClick={remove}>Delete service</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function Transactions() {
  const { data, loading, error, reload } = useAsync(() => api("/api/admin/transactions"), []);
  return (
    <>
      <PageHeader title="Transactions" text="Payments are recorded from verified Stripe events and cannot be edited." />
      <DataBoundary loading={loading} error={error} onRetry={reload}>
        {data && (!data.data.length ? <EmptyState title="No transactions yet" text="Premium subscriptions will appear here after Stripe confirms them." /> : (
          <TableShell>
            <thead className="border-b border-border bg-sage/40"><tr><th className={th}>Vendor</th><th className={th}>Plan</th><th className={th}>Amount</th><th className={th}>Status</th><th className={th}>Date</th></tr></thead>
            <tbody className="divide-y divide-border">
              {data.data.map((t) => (
                <tr key={t._id}>
                  <td className={td}><p className="font-medium">{t.vendor?.name}</p><p className="text-muted">{t.vendor?.email}</p></td>
                  <td className={td}><Badge tone={t.plan}>{t.plan}</Badge></td>
                  <td className={td}>{t.amount} {t.currency?.toUpperCase()}</td>
                  <td className={td}><Badge tone={t.status}>{t.status}</Badge></td>
                  <td className={td}>{fmtDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        ))}
      </DataBoundary>
    </>
  );
}
