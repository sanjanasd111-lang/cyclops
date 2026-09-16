import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-emerald-950/60 border-emerald-500/30 text-emerald-400 font-mono",
        emerald:
          "border-emerald-500/30 bg-emerald-950/60 text-emerald-400 font-mono",
        amber:
          "border-amber-500/30 bg-amber-950/60 text-amber-400 font-mono",
        saffron:
          "border-amber-500/30 bg-amber-950/60 text-amber-400 font-mono",
        secondary:
          "border-transparent bg-slate-800 text-slate-300",
        destructive:
          "border-transparent bg-red-950/60 text-red-400 border-red-500/30",
        outline: "text-slate-300 border-slate-700",
        verified:
          "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
