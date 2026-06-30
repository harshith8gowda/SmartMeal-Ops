"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useMotionPreference } from "@/lib/hooks/use-reduced-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  householdSize: z.coerce.number().min(1),
  monthlyBudgetInr: z.coerce.number().min(100),
  cookingSkill: z.enum(["low", "medium", "high"]),
  diet: z.string(),
  dietaryGoal: z.enum(["high_protein", "weight_loss", "low_carb", "balanced"]),
  allergies: z.string(),
  cuisines: z.string(),
  addressLabel: z.string().min(1),
  address: z.string().min(3),
  city: z.string().min(2),
  pincode: z.string().min(4)
});

type FormValues = z.infer<typeof schema>;

const COOKING_SKILL_OPTIONS = [
  { value: "low", label: "Beginner" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "Expert" }
];

const DIETARY_GOAL_OPTIONS = [
  { value: "balanced", label: "Balanced" },
  { value: "high_protein", label: "High protein" },
  { value: "weight_loss", label: "Weight loss" },
  { value: "low_carb", label: "Low carb" }
];

export function OnboardingForm() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      householdSize: 2,
      monthlyBudgetInr: 500,
      cookingSkill: "medium",
      diet: "veg",
      dietaryGoal: "balanced",
      cuisines: "",
      allergies: "",
      addressLabel: "Home",
      address: "",
      city: "Bengaluru",
      pincode: ""
    }
  });

  if (isLoaded && user) {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    if (fullName && !control._formValues.name) {
      setValue("name", fullName);
    }
  }

  const submit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      householdSize: values.householdSize,
      monthlyBudgetInr: values.monthlyBudgetInr,
      cookingSkill: values.cookingSkill,
      diet: [values.diet],
      dietaryGoal: values.dietaryGoal,
      cuisines: values.cuisines,
      allergies: values.allergies,
      address: {
        label: values.addressLabel,
        address: values.address,
        city: values.city,
        pincode: values.pincode
      }
    };

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return toast.error("Could not save profile");
    toast.success("Profile saved. Welcome to MealMap.");
    router.push("/dashboard");
  };

  const selectedDiet = useWatch({ control, name: "diet" });
  const { reduceMotion } = useMotionPreference();

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="mx-auto max-w-3xl border-border bg-flour text-foreground shadow-sm">
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
              <label className="text-xs font-medium text-muted-foreground">Default budget (₹)</label>
              <Input type="number" placeholder="500" {...register("monthlyBudgetInr")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Cook skill</label>
              <select
                {...register("cookingSkill")}
                className="w-full rounded-xl border border-border bg-porcelain px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
              >
                {COOKING_SKILL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <FieldGroup title="Diet type">
            {["veg", "non-veg", "eggetarian"].map((item) => (
              <ChoiceButton key={item} active={selectedDiet === item} onClick={() => setValue("diet", item)}>
                {item}
              </ChoiceButton>
            ))}
          </FieldGroup>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Dietary goal</label>
            <select
              {...register("dietaryGoal")}
              className="w-full rounded-xl border border-border bg-porcelain px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            >
              {DIETARY_GOAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Address label</label>
              <Input placeholder="Home" {...register("addressLabel")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">City</label>
              <Input placeholder="Bengaluru" {...register("city")} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Full address</label>
              <Input placeholder="123, 1st Main, Koramangala" {...register("address")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Pincode</label>
              <Input placeholder="560034" {...register("pincode")} />
            </div>
          </div>

          {Object.values(errors)[0] && (
            <p className="text-sm text-error">Please fill all required fields correctly.</p>
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
      aria-pressed={active}
      className={`rounded-xl border px-4 py-2 text-sm capitalize transition-all duration-200 ${
        active
          ? "border-primary/50 bg-primary-light text-primary"
          : "border-border bg-porcelain/50 text-muted-foreground hover:bg-porcelain hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
