import { requireUser } from "@/lib/session";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata = { title: "Dashboard" };

export default async function DashboardLayout({ children }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar role={user.role} name={user.name} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
