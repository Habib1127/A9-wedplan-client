"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await signOut();
        clearToken();
        router.push("/");
        router.refresh();
      }}
    >
      Log out
    </Button>
  );
}
