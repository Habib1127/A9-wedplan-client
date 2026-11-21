import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SignUpForm } from "@/components/shared/auth-forms";

export const metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  if (await getSession()) redirect("/dashboard");
  return <SignUpForm />;
}
