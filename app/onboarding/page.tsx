import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { getPrisma } from "@/lib/db/prisma";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Onboarding",
  description: "Complete your SmartMeal Ops profile to unlock personalized AI meal planning and budget optimization."
};

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in" as never);
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user && user.monthlyBudget > 0) {
    redirect("/dashboard" as never);
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8 text-center">
        <p className="flex items-center justify-center gap-2 text-sm font-medium uppercase text-primary">
          <Sparkles className="h-4 w-4" /> Profile
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Welcome to SmartMeal Ops</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Tell us about your household and preferences. The AI uses this to build personalized meal plans and budget recommendations.
        </p>
      </div>
      <OnboardingForm />
    </main>
  );
}
