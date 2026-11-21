import Link from "next/link";

export function Logo({ light }) {
  return (
    <Link href="/" className={`font-display text-3xl tracking-tight ${light ? "text-primary-foreground" : "text-primary"}`}>
      Wed<span className="text-gold">Plan</span>
    </Link>
  );
}
