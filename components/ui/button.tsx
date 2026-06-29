import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-[transform,box-shadow,filter] duration-150 ease-out-strong active:scale-[0.97] active:translate-y-0.5 active:shadow-inner disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden bg-primary text-primary-foreground shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_28px_-4px_hsl(var(--primary)/0.6)] hover:brightness-110",
        secondary:
          "border border-white/10 bg-white/[0.06] text-foreground backdrop-blur-sm transition-[transform,background-color,border-color] duration-150 ease-out-strong hover:bg-white/[0.10] hover:border-white/15",
        accent:
          "relative overflow-hidden bg-accent text-accent-foreground shadow-[0_0_20px_-5px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_28px_-4px_hsl(var(--accent)/0.6)] hover:brightness-110",
        ghost: "text-muted-foreground transition-[transform,background-color,color] duration-150 ease-out-strong hover:bg-white/[0.06] hover:text-foreground",
        outline: "border border-border bg-transparent transition-[transform,background-color,border-color] duration-150 ease-out-strong hover:bg-white/[0.04]"
      },
      size: {
        default: "h-11 px-5 py-2",
        lg: "h-12 px-6 text-base",
        sm: "h-9 px-3 text-xs",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size, className }), child.props.className)
      });
    }

    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";
