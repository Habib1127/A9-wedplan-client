import { cn } from "@/lib/utils";

const tones = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  accepted: "bg-emerald-100 text-emerald-800",
  paid: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-stone-200 text-stone-700",
  blocked: "bg-red-100 text-red-800",
  active: "bg-emerald-100 text-emerald-800",
  hidden: "bg-stone-200 text-stone-700",
  premium: "bg-gold/20 text-[#7a5a24]",
  free: "bg-sage text-primary",
  default: "bg-sage text-primary",
};

export function Badge({ tone, className, children }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", tones[tone] || tones.default, className)}>
      {children}
    </span>
  );
}
