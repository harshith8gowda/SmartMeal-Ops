import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/db/prisma";
import { getPantryItems } from "@/lib/db/pantry";
import { PantryManager } from "@/components/pantry/pantry-manager";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

export const metadata = {
  title: "Pantry",
  description: "Manage your pantry staples and recurring items in SmartMeal Ops."
};

export default async function PantryPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in" as never);
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    redirect("/onboarding" as never);
  }

  const pantryItems = await getPantryItems(userId);

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
            <Package className="h-4 w-4" /> Pantry
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Manage your pantry</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Link>
          </Button>
          <UserButton />
        </div>
      </div>
      <PantryManager pantryItems={pantryItems} />
    </main>
  );
}
