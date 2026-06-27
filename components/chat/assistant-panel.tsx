"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

export function AssistantPanel({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Tell me your goal, budget, energy level, and timing. I will plan the smartest food move."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void fetch("/api/conversation")
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages as Msg[]);
        }
      })
      .catch(() => null)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

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
      if (!res.ok) throw new Error(data.message || "Planner failed");
      setMessages((prev) => [...prev, { role: "assistant", content: data.summary }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "I could not reach the planner. Try again in a moment.";
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <Card className={`gradient-border flex flex-col ${compact ? "h-[460px]" : "h-full min-h-[60vh]"}`}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Loading conversation...
        </div>
      </Card>
    );
  }

  return (
    <Card className={`gradient-border flex flex-col overflow-hidden ${compact ? "h-[460px]" : "h-full min-h-[60vh]"}`}>
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">AI Copilot</h2>
          <p className="text-xs text-muted-foreground">Planning cost, time, and source</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`flex-1 space-y-4 overflow-y-auto px-5 py-5 scrollbar-hide ${compact ? "max-h-[320px]" : ""}`}
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className={`flex gap-3 ${m.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  m.role === "assistant" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                }`}
              >
                {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "assistant"
                    ? "border border-white/10 bg-white/[0.05] text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div className="border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-muted-foreground">
              <span className="mr-1 inline-block h-2 w-2 animate-bounce rounded-full bg-primary" />
              <span className="mr-1 inline-block h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="border-t border-white/10 bg-white/[0.03] p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Dinner for 2 tonight under ₹700"
            className="bg-white/[0.06]"
          />
          <Button onClick={send} disabled={loading} aria-label="Send message" size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
