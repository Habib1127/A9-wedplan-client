import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SignInForm } from "@/components/shared/auth-forms";

export const metadata = { title: "Sign In" };

export default async function SignInPage() {
  if (await getSession()) redirect("/dashboard");
  return <Suspense><SignInForm /></Suspense>;
}
