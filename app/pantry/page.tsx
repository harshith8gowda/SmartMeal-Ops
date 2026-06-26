import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/db/prisma";
import { getPantryItems } from "@/lib/db/pantry";
import { PantryManager } from "@/components/pantry/pantry-manager";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-primary">Pantry</p>
          <h1 className="text-3xl font-semibold">Manage your pantry</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="secondary">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <UserButton />
        </div>
      </div>
      <PantryManager pantryItems={pantryItems} />
    </main>
  );
}
