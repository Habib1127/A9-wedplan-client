import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-border bg-card px-3.5 text-sm placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-gold disabled:opacity-60";

export const Input = ({ className, ...props }) => <input className={cn(field, "h-11", className)} {...props} />;
export const Textarea = ({ className, ...props }) => <textarea className={cn(field, "min-h-28 py-2.5", className)} {...props} />;
export const Select = ({ className, children, ...props }) => (
  <select className={cn(field, "h-11 cursor-pointer", className)} {...props}>{children}</select>
);
export const Label = ({ className, ...props }) => <label className={cn("mb-1.5 block text-sm font-medium", className)} {...props} />;
export const FieldError = ({ children }) => (children ? <p className="mt-1 text-xs text-danger">{children}</p> : null);
