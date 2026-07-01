"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Bell, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type Notification = {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  actionUrl?: string | null;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to load notifications");
        setNotifications([]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: string) {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error("Failed to update");
      setNotifications((prev) =>
        prev ? prev.map((n) => (n.id === id ? { ...n, read: true } : n)) : prev
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function markAllRead() {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ all: true })
      });
      if (!res.ok) throw new Error("Failed to update");
      setNotifications((prev) => (prev ? prev.map((n) => ({ ...n, read: true })) : prev));
      setUnreadCount(0);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function deleteNotification(id: string) {
    try {
      const res = await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      let wasUnread = false;
      setNotifications((prev) => {
        const target = prev?.find((n) => n.id === id);
        wasUnread = target?.read === false;
        return prev ? prev.filter((n) => n.id !== id) : prev;
      });
      if (wasUnread) setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
        <ScrollReveal>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
                <Bell className="h-4 w-4" /> Notifications
              </p>
              <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Notification center
              </h1>
              <p className="mt-2 text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "You're all caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
                <Check className="h-4 w-4" />
                Mark all read
              </Button>
            )}
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : notifications?.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="Meal plans, reminders, and alerts will appear here."
          />
        ) : (
          <div className="space-y-3">
            {notifications?.map((notification) => (
              <ScrollReveal key={notification.id}>
                <div
                  className={`flex items-start justify-between gap-4 rounded-2xl border p-4 transition-colors ${
                    notification.read ? "border-border bg-flour" : "border-primary bg-primary-light/30"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => markRead(notification.id)}
                        aria-label="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-error"
                      onClick={() => deleteNotification(notification.id)}
                      aria-label="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
