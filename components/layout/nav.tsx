"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CalendarDays, ShoppingBag, Package, User, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/meal-plan", label: "Meal Plan", icon: CalendarDays },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/pantry", label: "Pantry", icon: Package },
  { href: "/profile", label: "Profile", icon: User }
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-flour backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            MM
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">MealMap</span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Button
                key={item.href}
                variant={active ? "secondary" : "ghost"}
                size="sm"
                asChild
                className="gap-2"
              >
                <Link href={{ pathname: item.href }}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <UserButton />
        </div>
      </div>

      <nav className="flex items-center justify-center gap-1 border-t border-border px-4 py-2 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Button
              key={item.href}
              variant={active ? "secondary" : "ghost"}
              size="sm"
              asChild
              className="gap-1 px-2"
            >
              <Link href={{ pathname: item.href }}>
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </nav>
    </header>
  );
}
