"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export function AssistantPanel({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Tell me your goal, budget, energy level, and timing. I will plan the smartest food move." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const next = [...messages, { role: "user" as const, content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: input })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.summary }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I could not reach the planner. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`glass ${compact ? "h-[460px]" : "h-[70vh]"}`}>
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Copilot</h2>
      </div>
      <div className={`${compact ? "h-[320px]" : "h-[52vh]"} mt-4 space-y-3 overflow-auto pr-1`}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === "assistant" ? "mr-8 rounded-lg bg-muted p-3 text-sm" : "ml-8 rounded-lg bg-primary p-3 text-sm text-primary-foreground"}>
            {m.content}
          </div>
        ))}
        {loading ? <div className="mr-8 rounded-lg bg-muted p-3 text-sm text-muted-foreground">Thinking through cost, time, and source...</div> : null}
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void send();
          }}
          placeholder="Dinner for 2 tonight under ₹700"
        />
        <Button onClick={send} disabled={loading} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
