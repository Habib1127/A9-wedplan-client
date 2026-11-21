import { Suspense } from "react";
import { BrowseClient } from "@/components/shared/browse-client";
import { CardGridSkeleton } from "@/components/shared/ui-bits";

export const metadata = { title: "Browse Services" };

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><CardGridSkeleton count={6} /></div>}>
      <BrowseClient />
    </Suspense>
  );
}
