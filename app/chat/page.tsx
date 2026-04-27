import { AssistantPanel } from "@/components/chat/assistant-panel";

export default function ChatPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Chat Assistant</h1>
      <AssistantPanel />
    </main>
  );
}
