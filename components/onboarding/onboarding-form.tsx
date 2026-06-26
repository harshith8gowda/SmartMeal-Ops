"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2),
  householdSize: z.coerce.number().min(1),
  dietType: z.string(),
  dietaryGoal: z.string(),
  monthlyBudgetInr: z.coerce.number().min(1000),
  cookingSkill: z.string(),
  cuisines: z.string(),
  allergies: z.string(),
  city: z.string().min(2)
});

type FormValues = z.infer<typeof schema>;

export function OnboardingForm() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      dietType: "veg",
      dietaryGoal: "balanced",
      cookingSkill: "medium",
      householdSize: 2,
      city: "Bengaluru"
    }
  });

  if (isLoaded && user) {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    if (fullName && !control._formValues.name) {
      setValue("name", fullName);
    }
  }

  const submit = async (values: FormValues) => {
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) return toast.error("Could not save profile");
    toast.success("Profile saved. Smart recommendations unlocked.");
    router.push("/dashboard");
  };

  const selectedGoal = useWatch({ control, name: "dietaryGoal" });
  const selectedDiet = useWatch({ control, name: "dietType" });
  const selectedSkill = useWatch({ control, name: "cookingSkill" });

  return (
    <Card className="glass max-w-3xl">
      <p className="text-sm font-medium uppercase text-primary">Onboarding</p>
      <h2 className="mt-1 text-2xl font-semibold">Set up SmartMeal Ops</h2>
      <form className="mt-6 grid gap-5" onSubmit={handleSubmit(submit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Name" {...register("name")} />
          <Input type="number" placeholder="Household size" {...register("householdSize")} />
          <Input type="number" placeholder="Monthly budget INR" {...register("monthlyBudgetInr")} />
          <Input placeholder="City / location" {...register("city")} />
        </div>

        <FieldGroup title="Diet type">
          {["veg", "non-veg", "eggetarian"].map((item) => (
            <ChoiceButton key={item} active={selectedDiet === item} onClick={() => setValue("dietType", item)}>
              {item}
            </ChoiceButton>
          ))}
        </FieldGroup>

        <FieldGroup title="Dietary goal">
          {["high_protein", "weight_loss", "low_carb", "balanced"].map((item) => (
            <ChoiceButton key={item} active={selectedGoal === item} onClick={() => setValue("dietaryGoal", item)}>
              {item.replace("_", " ")}
            </ChoiceButton>
          ))}
        </FieldGroup>

        <FieldGroup title="Cooking skill">
          {["low", "medium", "high"].map((item) => (
            <ChoiceButton key={item} active={selectedSkill === item} onClick={() => setValue("cookingSkill", item)}>
              {item}
            </ChoiceButton>
          ))}
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Preferred cuisines (comma separated)" {...register("cuisines")} />
          <Textarea placeholder="Allergies (comma separated)" {...register("allergies")} />
        </div>
        {Object.values(errors)[0] && <p className="text-sm text-red-600">Please fill all required fields correctly.</p>}
        <Button disabled={isSubmitting} className="w-full md:w-fit">{isSubmitting ? "Saving..." : "Save Preferences"}</Button>
      </form>
    </Card>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white/75 text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
