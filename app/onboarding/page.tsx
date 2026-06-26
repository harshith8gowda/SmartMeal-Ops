import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { getPrisma } from "@/lib/db/prisma";

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
      <div className="mb-6">
        <p className="text-sm font-medium uppercase text-primary">Profile</p>
        <h1 className="text-3xl font-semibold">Welcome to SmartMeal Ops</h1>
      </div>
      <OnboardingForm />
    </main>
  );
}
