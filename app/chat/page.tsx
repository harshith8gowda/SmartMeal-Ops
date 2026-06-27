import { AssistantPanel } from "@/components/chat/assistant-panel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata = {
  title: "Chat Assistant",
  description: "Chat with the SmartMeal Ops AI copilot to plan meals, optimize costs, and decide between cooking, ordering, and dining out."
};

export default function ChatPage() {
  return (
    <main className="mx-auto flex h-[calc(100vh-2rem)] max-w-5xl flex-col px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
            <Sparkles className="h-4 w-4" /> Conversation
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">AI Copilot</h1>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Link>
        </Button>
      </div>
      <AssistantPanel />
    </main>
  );
}
