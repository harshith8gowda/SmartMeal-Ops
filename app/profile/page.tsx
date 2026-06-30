"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/nav";
import { AddressForm, type Address } from "@/components/profile/address-form";
import { PreferenceForm, type Preference } from "@/components/profile/preference-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Link2, Loader2 } from "lucide-react";

type ProfileUser = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
};

type Profile = {
  user: ProfileUser;
  preference: Preference | null;
};

const DIETARY_GOAL_LABELS: Record<string, string> = {
  BALANCED: "Balanced",
  HIGH_PROTEIN: "High protein",
  WEIGHT_LOSS: "Weight loss",
  LOW_CARB: "Low carb"
};

function getInitials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data));
    fetch("/api/address")
      .then((res) => res.json())
      .then((data) => setAddresses(data.addresses || []));
  }, []);

  async function handleConnectSwiggy() {
    setConnecting(true);
    try {
      const res = await fetch("/api/swiggy/connect", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Could not start Swiggy connection");
      }
    } finally {
      setConnecting(false);
    }
  }

  const user = profile?.user;
  const preference = profile?.preference;
  const goalLabel = preference?.dietaryGoal ? DIETARY_GOAL_LABELS[preference.dietaryGoal.toUpperCase()] : null;

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-6">
          <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
            <User className="h-4 w-4" /> Profile
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Your settings</h1>
          <p className="mt-2 text-muted-foreground">Manage addresses, preferences, and your Swiggy connection.</p>
        </div>

        {profile === null || addresses === null ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="grid gap-6">
            <Card className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={user.name || "Profile"}
                      className="h-14 w-14 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-primary-light text-primary font-semibold">
                      {getInitials(user?.name || null)}
                    </div>
                  )}
                  <div>
                    <h2 className="font-display text-lg font-semibold">{user?.name || "MealMap user"}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    {goalLabel && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Badge variant="secondary">{goalLabel}</Badge>
                        {preference?.diet?.[0] && (
                          <Badge variant="outline" className="capitalize">{preference.diet[0]}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="secondary" onClick={handleConnectSwiggy} disabled={connecting} className="gap-2">
                  {connecting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Link2 className="h-4 w-4" />
                  Connect Swiggy
                </Button>
              </div>
            </Card>

            <PreferenceForm preference={preference || undefined} />
            <AddressForm addresses={addresses} />
          </div>
        )}
      </main>
    </>
  );
}
