import { HeroV2 } from "@/components/landing/hero-v2";
import { FeaturesV2 } from "@/components/landing/features-v2";
import { HowItWorksV2 } from "@/components/landing/how-it-works-v2";
import { FooterV2 } from "@/components/landing/footer-v2";
import { MarketingNavV2 } from "@/components/nav/marketing-nav-v2";

export default function MarketingPage() {
  return (
    <main className="bg-background">
      <MarketingNavV2 />
      <HeroV2 />
      <FeaturesV2 />
      <HowItWorksV2 />
      <FooterV2 />
    </main>
  );
}
