"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Msg = { role: "user" | "assistant"; content: string };

export function AssistantPanel() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Tell me your goal and budget. I’ll plan your smartest food move." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const next = [...messages, { role: "user" as const, content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/ai/plan", { method: "POST", body: JSON.stringify({ prompt: input }) });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.summary }]);
    setLoading(false);
  };

  return (
    <Card className="glass h-[70vh]">
      <h2 className="text-lg font-semibold">AI Copilot</h2>
      <div className="mt-4 h-[52vh] space-y-3 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "assistant" ? "mr-8 rounded-xl bg-slate-100 p-3" : "ml-8 rounded-xl bg-indigo-600 p-3 text-white"}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Dinner for 2 tonight under ₹700" />
        <Button onClick={send} disabled={loading}>{loading ? "Thinking..." : "Send"}</Button>
      </div>
    </Card>
  );
}
