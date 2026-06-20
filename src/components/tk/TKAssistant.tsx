import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const QUICK = [
  "What's the baggage allowance in Economy?",
  "How do I check in online?",
  "How do TK Miles tiers work?",
  "Can I bring my pet on board?",
];

export function TKAssistant() {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setInput("");
    await sendMessage({ text });
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="rounded-xl bg-secondary p-4 text-sm">
              <p className="font-semibold">👋 Hi, I'm TK Assistant.</p>
              <p className="mt-1 text-muted-foreground">Ask me about bookings, baggage, check-in, loyalty, destinations, or anything travel.</p>
            </div>
            <div className="grid gap-2">
              {QUICK.map((q) => (
                <button key={q} onClick={() => send(q)} className="rounded-lg border border-border px-3 py-2 text-left text-xs transition hover:border-primary hover:bg-accent">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
              <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                {text || (busy && !isUser ? "Thinking…" : "")}
              </div>
            </div>
          );
        })}
        {busy && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-secondary"><Bot className="h-4 w-4" /></div>
            <div className="rounded-2xl bg-secondary px-3 py-2 text-sm text-muted-foreground">Thinking…</div>
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); void send(input); }}
        className="border-t border-border p-2"
      >
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); } }}
            placeholder="Ask TK Assistant anything…"
            rows={1}
            className="min-h-[44px] resize-none"
          />
          <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send"><Send className="h-4 w-4" /></Button>
        </div>
      </form>
    </div>
  );
}
