"use client";

import Link from "next/link";
import { CalendarCheck, CheckCircle2, Clock, Crown, Layers, ShieldCheck, Store, Users, XCircle, Receipt, UserCheck, ListChecks } from "lucide-react";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/use-async";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataBoundary, PageHeader, StatCard, CardGridSkeleton } from "@/components/shared/ui-bits";

const config = {
  vendor: {
    path: "/api/vendor/overview",
    title: "Vendor overview",
    cards: (d) => [
      ["Total services", d.totalServices, Layers],
      ["Active services", d.activeServices, Store],
      ["Pending booking requests", d.pendingBookings, Clock],
      ["Accepted bookings", d.acceptedBookings, CheckCircle2],
    ],
  },
  customer: {
    path: "/api/customer/bookings/overview",
    title: "Your bookings",
    cards: (d) => [
      ["Total booking requests", d.total, CalendarCheck],
      ["Pending", d.pending, Clock],
      ["Accepted", d.accepted, CheckCircle2],
      ["Rejected", d.rejected, XCircle],
    ],
  },
  admin: {
    path: "/api/admin/overview",
    title: "Platform overview",
    cards: (d) => [
      ["Registered users", d.totalUsers, Users],
      ["Vendors", d.totalVendors, Store],
      ["Customers", d.totalCustomers, UserCheck],
      ["Total services", d.totalServices, Layers],
      ["Pending services", d.pendingServices, ListChecks],
      ["Transactions", d.totalTransactions, Receipt],
    ],
  },
};

export function Overview({ role, name }) {
  const c = config[role];
  const { data, loading, error, reload } = useAsync(() => api(c.path), [role]);
  return (
    <>
      <PageHeader title={c.title} text={`Welcome back, ${name}.`} />
      <DataBoundary loading={loading} error={error} onRetry={reload} skeleton={<CardGridSkeleton count={4} />}>
        {data && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {c.cards(data.data).map(([label, value, icon]) => <StatCard key={label} label={label} value={value} icon={icon} />)}
              {role === "vendor" && (
                <StatCard label="Current plan" value={<Badge tone={data.data.plan} className="text-base">{data.data.plan}</Badge>} icon={Crown} />
              )}
            </div>
            <div className="mt-8">
              {role === "vendor" && data.data.plan === "free" && <Button asChild variant="gold"><Link href="/dashboard/subscription">Upgrade to Premium</Link></Button>}
              {role === "customer" && <Button asChild><Link href="/services">Find more services</Link></Button>}
              {role === "admin" && data.data.pendingServices > 0 && <Button asChild><Link href="/dashboard/manage-services"><ShieldCheck className="h-4 w-4" />Review pending services</Link></Button>}
            </div>
          </>
        )}
      </DataBoundary>
    </>
  );
}
