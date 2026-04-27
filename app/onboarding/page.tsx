import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default function OnboardingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Welcome to SmartMeal Ops</h1>
      <OnboardingForm />
    </main>
  );
}
