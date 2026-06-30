import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-secondary px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-flour focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
