import { cn } from "@/lib/utils";

export const Card = ({ className, ...props }) => (
  <div className={cn("rounded-2xl border border-border bg-card", className)} {...props} />
);
