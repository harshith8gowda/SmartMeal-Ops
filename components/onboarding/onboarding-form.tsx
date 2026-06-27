"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

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
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="gradient-border mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Set up your profile</CardTitle>
          <CardDescription>Personalize the copilot for your household</CardDescription>
        </CardHeader>
        <form className="grid gap-6 px-5 pb-6" onSubmit={handleSubmit(submit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <Input placeholder="Your name" {...register("name")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Household size</label>
              <Input type="number" placeholder="2" {...register("householdSize")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Monthly budget (₹)</label>
              <Input type="number" placeholder="6000" {...register("monthlyBudgetInr")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">City</label>
              <Input placeholder="Bengaluru" {...register("city")} />
            </div>
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
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Preferred cuisines</label>
              <Input placeholder="indian, chinese, italian" {...register("cuisines")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Allergies</label>
              <Textarea placeholder="peanuts, shellfish" {...register("allergies")} />
            </div>
          </div>

          {Object.values(errors)[0] && (
            <p className="text-sm text-red-400">Please fill all required fields correctly.</p>
          )}

          <Button disabled={isSubmitting} className="w-full md:w-fit">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-sm capitalize transition-all duration-200 ${
        active
          ? "border-primary/50 bg-primary/15 text-primary shadow-[0_0_16px_-4px_hsl(var(--primary)/0.4)]"
          : "border-white/10 bg-white/[0.05] text-muted-foreground hover:bg-white/[0.10] hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
