import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        gold: "bg-gold text-white hover:bg-gold/90",
        outline: "border border-border bg-card hover:bg-sage/50",
        ghost: "hover:bg-sage/60",
        danger: "bg-danger text-white hover:bg-danger/90",
      },
      size: { default: "h-10 px-5", sm: "h-8 px-3 text-xs", lg: "h-12 px-7 text-base", icon: "h-9 w-9" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({ className, variant, size, asChild, loading, children, disabled, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(variants({ variant, size }), className)} disabled={disabled || loading} {...props}>
      {asChild ? children : (<>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{children}</>)}
    </Comp>
  );
}
