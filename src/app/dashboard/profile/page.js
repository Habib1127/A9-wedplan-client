import { requireUser } from "@/lib/session";
import { ProfileSettings } from "@/components/dashboard/profile-form";

export const metadata = { title: "Profile Settings" };

export default async function ProfilePage() {
  await requireUser();
  return <ProfileSettings />;
}
