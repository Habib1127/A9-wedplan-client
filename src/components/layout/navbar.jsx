"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { cn, initials } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SmartImage } from "@/components/shared/smart-image";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user;

  async function handleLogout() {
    await signOut();
    clearToken();
    toast.success("You have been logged out");
    router.push("/");
    router.refresh();
  }

  const linkClass = (href) =>
    cn("rounded-full px-4 py-2 text-sm transition-colors hover:bg-sage/70", pathname === href && "bg-sage font-medium text-primary");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => <Link key={l.href} href={l.href} className={linkClass(l.href)}>{l.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-sage" />
          ) : user ? (
            <ProfileMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/sign-in">Sign In</Link></Button>
              <Button asChild><Link href="/sign-up">Sign Up</Link></Button>
            </>
          )}
        </div>
        <button className="rounded-full p-2 md:hidden cursor-pointer" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="space-y-1 border-t border-border bg-background px-4 pb-4 pt-2 md:hidden" onClick={() => setOpen(false)}>
          {links.map((l) => <Link key={l.href} href={l.href} className={cn(linkClass(l.href), "block")}>{l.label}</Link>)}
          {user ? (
            <>
              <Link href="/dashboard" className="block rounded-full px-4 py-2 text-sm hover:bg-sage/70">Dashboard</Link>
              <Link href="/dashboard/profile" className="block rounded-full px-4 py-2 text-sm hover:bg-sage/70">Profile Settings</Link>
              <button onClick={handleLogout} className="block w-full rounded-full px-4 py-2 text-left text-sm hover:bg-sage/70 cursor-pointer">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" className="flex-1"><Link href="/sign-in">Sign In</Link></Button>
              <Button asChild className="flex-1"><Link href="/sign-up">Sign Up</Link></Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function ProfileMenu({ user, onLogout }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 cursor-pointer">
        {user.image ? (
          <SmartImage src={user.image} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{initials(user.name)}</span>
        )}
        <span className="max-w-28 truncate text-sm">{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard className="h-4 w-4" />Dashboard</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/dashboard/profile"><Settings className="h-4 w-4" />Profile Settings</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onLogout}><LogOut className="h-4 w-4" />Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
