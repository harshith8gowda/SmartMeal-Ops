import { AssistantPanel } from "@/components/chat/assistant-panel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-primary">Conversation</p>
          <h1 className="text-3xl font-semibold">Chat Assistant</h1>
        </div>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
      <AssistantPanel />
    </main>
  );
}
