import { useEffect, useState } from "react";
import { Bell, Sparkles, Plane, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

type Notif = { id: string; title: string; body: string; category: string; link: string | null; created_at: string };

const iconFor = (c: string) =>
  c === "promo" ? <Sparkles className="h-4 w-4" /> : c === "route" ? <Plane className="h-4 w-4" /> : <Info className="h-4 w-4" />;

export function Notifications() {
  const [items, setItems] = useState<Notif[]>([]);
  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("tk_read_notifs") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setItems((data as Notif[]) ?? []));
  }, []);

  const unread = items.filter((i) => !readIds.includes(i.id)).length;
  const markAll = () => {
    const ids = items.map((i) => i.id);
    setReadIds(ids);
    try { localStorage.setItem("tk_read_notifs", JSON.stringify(ids)); } catch {}
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && <button onClick={markAll} className="text-xs font-medium text-primary hover:underline">Mark all read</button>}
        </div>
        <div className="max-h-96 overflow-auto">
          {items.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications yet.</p>}
          {items.map((n) => {
            const isRead = readIds.includes(n.id);
            const content = (
              <div className={`flex gap-3 px-4 py-3 transition hover:bg-accent ${isRead ? "opacity-70" : ""}`}>
                <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${n.category === "promo" ? "bg-primary/10 text-primary" : "bg-secondary text-foreground"}`}>{iconFor(n.category)}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-tight">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                </div>
                {!isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </div>
            );
            return n.link ? <Link key={n.id} to={n.link} className="block border-b border-border last:border-0">{content}</Link>
              : <div key={n.id} className="border-b border-border last:border-0">{content}</div>;
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
