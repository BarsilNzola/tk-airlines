import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plane, Search, CheckCircle2 } from "lucide-react";
import { SiteShell } from "@/components/tk/SiteShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BRAND } from "@/lib/constants";

export const Route = createFileRoute("/check-in")({
  head: () => ({ meta: [{ title: "Online Check-in · TK Airlines" }, { name: "description", content: "Check in online from 24 hours before departure and get your boarding pass." }]}),
  component: CheckInPage,
});

function CheckInPage() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState(""); const [sn, setSn] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ref.trim().length < 5 || !sn.trim()) { toast.error("Enter reference and surname"); return; }
    setLoading(true);
    try {
      await fetch(BRAND.formspreeEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: "TK Airlines · Check-in", ref: ref.toUpperCase(), surname: sn.toUpperCase() }),
      });
    } catch {}
    setLoading(false); setDone(true);
    toast.success("Boarding pass sent to your email!");
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Boarding pass</p>
        <h1 className="mt-1 text-3xl font-black sm:text-4xl">Online check-in</h1>
        <p className="mt-2 text-muted-foreground">Open from 24 hours until 90 minutes before departure.</p>

        {!done ? (
          <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div><Label htmlFor="cr">Booking reference</Label><Input id="cr" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. TK4Q9X" className="mt-1 uppercase" /></div>
            <div><Label htmlFor="cs">Surname</Label><Input id="cs" value={sn} onChange={(e) => setSn(e.target.value)} placeholder="As shown on passport" className="mt-1" /></div>
            <Button type="submit" size="lg" disabled={loading} className="gap-2"><Search className="h-4 w-4" />{loading ? "Checking in…" : "Check in now"}</Button>
          </form>
        ) : (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="mt-3 text-xl font-black">You're checked in!</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your mobile boarding pass has been emailed. Please arrive at the gate 30 minutes before departure.</p>
            <div className="mt-5 inline-block rounded-xl bg-charcoal p-5 text-left text-white">
              <p className="text-xs uppercase tracking-widest text-white/60">Boarding pass · {ref.toUpperCase()}</p>
              <p className="mt-2 text-2xl font-black">{sn.toUpperCase()}</p>
              <div className="mt-3 flex items-center justify-between gap-6">
                <div><p className="text-xs text-white/60">From</p><p className="text-xl font-black">LHR</p></div>
                <Plane className="h-5 w-5 text-primary" />
                <div className="text-right"><p className="text-xs text-white/60">To</p><p className="text-xl font-black">IST</p></div>
              </div>
              <p className="mt-3 font-mono text-xs">Gate B12 · Seat 14C · Boards 10:35</p>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
