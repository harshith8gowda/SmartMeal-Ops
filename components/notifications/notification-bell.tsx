"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    function loadCount() {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => setUnread(data.unreadCount ?? 0))
        .catch(() => setUnread(0));
    }

    loadCount();
    const interval = setInterval(loadCount, 30000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") loadCount();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href={{ pathname: "/notifications" }}>
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </Link>
    </Button>
  );
}
