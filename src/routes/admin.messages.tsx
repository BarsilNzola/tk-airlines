import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Mail, Plane, Users, RefreshCw } from "lucide-react";
import { SiteShell } from "@/components/tk/SiteShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Admin · TK Airlines" }, { name: "robots", content: "noindex,nofollow" }]}),
  component: AdminPage,
});

interface ContactMsg { id: string; name: string; email: string; subject: string | null; message: string; created_at: string }
interface Booking { id: string; trip_type: string; from_airport: string; to_airport: string; depart_date: string; return_date: string | null; passengers: number; cabin_class: string; created_at: string }
interface Sub { id: string; email: string; created_at: string }

function AdminPage() {
  const fn = useServerFn(adminFetch);
  const [pass, setPass] = useState("");
  const [data, setData] = useState<{ messages: ContactMsg[]; bookings: Booking[]; subscribers: Sub[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!pass) { toast.error("Enter passcode"); return; }
    setLoading(true);
    try {
      const res = await fn({ data: { passcode: pass } });
      setData(res as typeof data);
      toast.success("Loaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setLoading(false); }
  };

  if (!data) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary"><Lock className="h-6 w-6" /></div>
            <h1 className="mt-4 text-2xl font-black">Admin panel</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter the admin passcode to view contact messages, bookings and subscribers.</p>
            <form onSubmit={load} className="mt-5 space-y-3">
              <div><Label htmlFor="pc">Passcode</Label><Input id="pc" type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoFocus /></div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Verifying…" : "Unlock"}</Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">Default: <code className="rounded bg-secondary px-1.5 py-0.5">TKADMIN2026</code> · change via <code>ADMIN_PASSCODE</code> secret.</p>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Operations</p>
            <h1 className="mt-1 text-3xl font-black">Admin · Messages & Activity</h1>
          </div>
          <Button onClick={() => load()} variant="outline" disabled={loading} className="gap-2"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat icon={<Mail className="h-5 w-5" />} label="Contact messages" value={data.messages.length} />
          <Stat icon={<Plane className="h-5 w-5" />} label="Flight searches" value={data.bookings.length} />
          <Stat icon={<Users className="h-5 w-5" />} label="Newsletter subs" value={data.subscribers.length} />
        </div>

        <Tabs defaultValue="messages" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="mt-4 space-y-3">
            {data.messages.length === 0 && <Empty label="No contact messages yet." />}
            {data.messages.map((m) => (
              <article key={m.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-bold">{m.name} <span className="font-normal text-muted-foreground">· {m.email}</span></p>
                  <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
                </div>
                {m.subject && <p className="mt-1 text-sm font-semibold">{m.subject}</p>}
                <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{m.message}</p>
                <a href={`mailto:${m.email}`} className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">Reply →</a>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="bookings" className="mt-4 space-y-2">
            {data.bookings.length === 0 && <Empty label="No bookings yet." />}
            {data.bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm">
                <p className="font-bold">{b.from_airport} → {b.to_airport}</p>
                <p className="text-muted-foreground">{b.depart_date}{b.return_date ? ` ↔ ${b.return_date}` : ""} · {b.passengers} pax · {b.cabin_class}</p>
                <p className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleString()}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="subscribers" className="mt-4 space-y-2">
            {data.subscribers.length === 0 && <Empty label="No subscribers yet." />}
            {data.subscribers.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm">
                <p>{s.email}</p>
                <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </section>
    </SiteShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">{icon}</div>
      <div><p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p><p className="text-2xl font-black">{value}</p></div>
    </div>
  );
}
function Empty({ label }: { label: string }) { return <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{label}</div>; }
