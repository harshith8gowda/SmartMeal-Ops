import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700", className)} {...props} />;
}
