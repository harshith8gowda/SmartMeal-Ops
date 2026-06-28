import { AssistantPanel } from "@/components/chat/assistant-panel";
import { AppNav } from "@/components/layout/nav";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Chat Assistant",
  description: "Chat with the MealMap AI copilot to plan meals and decide between cooking, ordering, and dining out."
};

export default function ChatPage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto flex h-[calc(100vh-6rem)] max-w-5xl flex-col px-4 py-6 sm:px-6">
        <div className="mb-4">
          <p className="flex items-center gap-2 text-sm font-medium uppercase text-primary">
            <Sparkles className="h-4 w-4" /> Conversation
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">AI Copilot</h1>
        </div>
        <AssistantPanel />
      </main>
    </>
  );
}
