import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, Search, User, Plane, Calendar, MapPin, X } from "lucide-react";
import { SiteShell } from "@/components/tk/SiteShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BRAND } from "@/lib/constants";

export const Route = createFileRoute("/manage-booking")({
  head: () => ({ meta: [
    { title: "Manage Booking · TK Airlines" },
    { name: "description", content: "View, change, or cancel your TK Airlines booking with your reference and surname." },
  ]}),
  component: ManageBookingPage,
});

interface Booking {
  ref: string; surname: string; from: string; to: string; depart: string; cabin: string; seat: string; status: string;
}

function ManageBookingPage() {
  const [ref, setRef] = useState("");
  const [surname, setSurname] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const find = (e: React.FormEvent) => {
    e.preventDefault();
    if (ref.trim().length < 5 || !surname.trim()) { toast.error("Enter a valid 6-char booking reference and surname"); return; }
    setLoading(true);
    setTimeout(() => {
      const seed = [...ref.toUpperCase()].reduce((a, c) => a + c.charCodeAt(0), 0);
      const routes = [["LHR","IST"],["JFK","CDG"],["DXB","SIN"],["IST","LAX"]];
      const r = routes[seed % routes.length];
      setBooking({
        ref: ref.toUpperCase(), surname: surname.toUpperCase(),
        from: r[0], to: r[1],
        depart: new Date(Date.now() + (seed % 30) * 86400000).toISOString().slice(0, 10),
        cabin: ["Economy","Comfort","Business"][seed % 3],
        seat: `${(seed % 30) + 1}${"ABCDEF"[seed % 6]}`,
        status: "Confirmed",
      });
      setLoading(false);
    }, 600);
  };

  const notify = async (action: string, extra: Record<string, unknown> = {}) => {
    try {
      await fetch(BRAND.formspreeEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: `TK Airlines · ${action}`, action, booking, ...extra }),
      });
      toast.success(`${action} request sent — we'll email you shortly.`);
    } catch { toast.error("Could not send request — try WhatsApp."); }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">My booking</p>
        <h1 className="mt-1 text-3xl font-black sm:text-4xl">Manage your booking</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Change dates, choose seats, add baggage, or cancel — all in one place.</p>

        <form onSubmit={find} className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <Label htmlFor="ref">Booking reference</Label>
            <div className="relative mt-1">
              <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="ref" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. TK4Q9X" className="pl-9 uppercase" maxLength={8} />
            </div>
          </div>
          <div>
            <Label htmlFor="sn">Surname</Label>
            <div className="relative mt-1">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="sn" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="As shown on passport" className="pl-9" />
            </div>
          </div>
          <div className="flex items-end">
            <Button type="submit" size="lg" className="h-11 w-full gap-2" disabled={loading}><Search className="h-4 w-4" /> {loading ? "Finding…" : "Find booking"}</Button>
          </div>
        </form>

        {loading && <div className="mt-6 h-48 animate-pulse rounded-2xl bg-secondary" />}

        {booking && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Reference · {booking.ref}</p>
                <p className="mt-1 text-xl font-black">{booking.surname}</p>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600">{booking.status}</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field icon={<Plane className="h-4 w-4" />} label="Route" value={`${booking.from} → ${booking.to}`} />
              <Field icon={<Calendar className="h-4 w-4" />} label="Departure" value={booking.depart} />
              <Field icon={<MapPin className="h-4 w-4" />} label="Cabin · Seat" value={`${booking.cabin} · ${booking.seat}`} />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={() => notify("Seat change requested")} variant="outline">Change seat</Button>
              <Button onClick={() => notify("Date change requested")} variant="outline">Change dates</Button>
              <Button onClick={() => notify("Extra baggage added")} variant="outline">Add baggage</Button>
              <Button onClick={() => notify("Cancellation requested")} variant="destructive" className="gap-1"><X className="h-4 w-4" />Cancel booking</Button>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground">{icon}{label}</p>
      <p className="mt-1 text-base font-bold">{value}</p>
    </div>
  );
}
