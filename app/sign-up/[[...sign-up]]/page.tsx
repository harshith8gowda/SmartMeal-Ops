import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your SmartMeal Ops account and start optimizing your food decisions with AI."
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <SignUp />
    </main>
  );
}
