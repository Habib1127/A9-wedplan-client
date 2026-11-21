import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-8xl text-gold">404</p>
        <h1 className="mt-2 text-4xl">This page does not exist</h1>
        <p className="mt-2 text-sm text-muted">The link may be broken or the page may have moved.</p>
        <Button asChild className="mt-6"><Link href="/">Go to home</Link></Button>
      </main>
      <Footer />
    </>
  );
}
