"use client";

import * as Primitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = Primitive.Root;
export const DropdownMenuTrigger = Primitive.Trigger;

export const DropdownMenuContent = ({ className, ...props }) => (
  <Primitive.Portal>
    <Primitive.Content align="end" sideOffset={8} className={cn("z-50 min-w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg", className)} {...props} />
  </Primitive.Portal>
);

export const DropdownMenuItem = ({ className, ...props }) => (
  <Primitive.Item className={cn("flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-sage", className)} {...props} />
);

export const DropdownMenuLabel = ({ className, ...props }) => <Primitive.Label className={cn("px-3 py-2", className)} {...props} />;
export const DropdownMenuSeparator = () => <Primitive.Separator className="my-1 h-px bg-border" />;
