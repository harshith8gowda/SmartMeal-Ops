import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-[transform,box-shadow,filter] duration-150 ease-out active:scale-[0.97] active:translate-y-0.5 active:shadow-inner disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary-hover",
        secondary:
          "border border-border bg-secondary text-foreground transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-porcelain",
        accent:
          "relative overflow-hidden bg-accent text-accent-foreground shadow-sm hover:shadow-md hover:brightness-110",
        ghost: "text-muted-foreground transition-[transform,background-color,color] duration-150 ease-out hover:bg-porcelain hover:text-foreground",
        outline: "border border-border bg-transparent transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-porcelain"
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
