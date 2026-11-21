import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export async function requireUser(roles) {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  if (session.user.isBlocked) redirect("/blocked");
  if (roles && !roles.includes(session.user.role)) redirect("/dashboard");
  return session.user;
}
