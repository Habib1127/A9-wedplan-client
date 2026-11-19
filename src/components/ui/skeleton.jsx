import { cn } from "@/lib/utils";

export const Skeleton = ({ className }) => <div className={cn("animate-pulse rounded-xl bg-sage/70", className)} />;
