import type { Metadata } from "next";
import { Hero3D } from "@/components/landing/3d-hero";
import { OrbitFeatures } from "@/components/landing/orbit-features";
import { Steps3D } from "@/components/landing/steps-3d";
import { MotionFooter } from "@/components/landing/motion-footer";
import { MarketingNavV2 } from "@/components/nav/marketing-nav-v2";

export const metadata: Metadata = {
  title: {
    absolute: "MealMap — Decide dinner. Build the cart. Swiggy handles the rest.",
  },
  description:
    "Compare cooking, ordering, and dining out side by side. Plan your week and build carts in Swiggy with one tap.",
};

export default function MarketingPage() {
  return (
    <main className="bg-background">
      <MarketingNavV2 />
      <Hero3D />
      <OrbitFeatures />
      <Steps3D />
      <MotionFooter />
    </main>
  );
}
