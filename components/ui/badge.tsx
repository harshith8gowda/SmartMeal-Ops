import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors", {
  variants: {
    variant: {
      default: "border-border bg-primary-light text-primary",
      secondary: "border-border bg-secondary text-muted-foreground",
      accent: "border-border bg-order-light text-order",
      success: "border-border bg-cook-light text-cook",
      warning: "border-border bg-order-light text-order",
      dineout: "border-border bg-dineout-light text-dineout",
      outline: "border-border bg-transparent text-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
