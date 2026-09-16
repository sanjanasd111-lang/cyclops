import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm dark:bg-emerald-600 dark:hover:bg-emerald-500",
        emerald:
          "bg-emerald-700 text-white hover:bg-emerald-600 shadow-sm",
        amber:
          "bg-amber-600 text-white hover:bg-amber-500 shadow-sm",
        saffron:
          "bg-amber-600 text-white hover:bg-amber-500 shadow-sm",
        gradient:
          "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm",
        outline:
          "border border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white dark:border-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-800",
        secondary:
          "bg-slate-800 text-slate-100 hover:bg-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        ghost:
          "text-slate-400 hover:bg-slate-800 hover:text-slate-200 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200",
        link: "text-emerald-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 rounded-md px-2.5 text-[11px]",
        lg: "h-11 rounded-xl px-5 text-sm font-semibold",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
