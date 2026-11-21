"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">An unexpected error happened. Try again in a moment.</p>
      <Button className="mt-6" onClick={reset}>Try again</Button>
    </main>
  );
}
