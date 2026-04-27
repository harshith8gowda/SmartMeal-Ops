import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-primary">Profile</p>
          <h1 className="text-3xl font-semibold">Welcome to SmartMeal Ops</h1>
        </div>
        <Button asChild variant="secondary">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <OnboardingForm />
    </main>
  );
}
