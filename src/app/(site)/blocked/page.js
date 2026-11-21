import { LogoutButton } from "@/components/shared/logout-button";

export const metadata = { title: "Account blocked" };

export default function BlockedPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="text-4xl">Your account is blocked</h1>
      <p className="mb-6 mt-2 text-sm text-muted">An admin has blocked this account, so dashboards and bookings are unavailable. Contact hello@wedplan.com if you think this is a mistake.</p>
      <LogoutButton />
    </div>
  );
}
