"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck, CreditCard, Crown, Home, LayoutDashboard, LogOut, Menu, PlusCircle, Receipt, Settings, ShieldCheck, Store, Users, X,
} from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

const NAV = {
  vendor: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/my-services", label: "My Services", icon: Store },
    { href: "/dashboard/add-service", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/booking-requests", label: "Booking Requests", icon: CalendarCheck },
    { href: "/dashboard/subscription", label: "Subscription", icon: Crown },
    { href: "/dashboard/profile", label: "Profile Settings", icon: Settings },
  ],
  customer: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/my-bookings", label: "My Bookings", icon: CalendarCheck },
    { href: "/dashboard/profile", label: "Profile Settings", icon: Settings },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/manage-users", label: "Manage Users", icon: Users },
    { href: "/dashboard/manage-services", label: "Manage Services", icon: ShieldCheck },
    { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
    { href: "/dashboard/profile", label: "Profile Settings", icon: Settings },
  ],
};

export function Sidebar({ role, name }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = NAV[role] || NAV.customer;

  async function handleLogout() {
    await signOut();
    clearToken();
    toast.success("You have been logged out");
    router.push("/");
    router.refresh();
  }

  const panel = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-5"><Logo /></div>
      <div className="mx-4 mb-4 rounded-xl bg-sage/70 px-4 py-3">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs capitalize text-muted">{role} dashboard</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sage/60", pathname === href && "bg-primary text-primary-foreground hover:bg-primary")}
          >
            <Icon className="h-4 w-4" />{label}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-border p-3">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sage/60"><Home className="h-4 w-4" />Back to site</Link>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sage/60 cursor-pointer"><LogOut className="h-4 w-4" />Logout</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Logo />
        <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-full p-2 cursor-pointer"><Menu className="h-5 w-5" /></button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-background shadow-xl">
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-full p-2 cursor-pointer"><X className="h-4 w-4" /></button>
            {panel}
          </aside>
        </div>
      )}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-background lg:block">{panel}</aside>
    </>
  );
}
