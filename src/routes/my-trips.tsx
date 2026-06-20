import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/tk/SiteShell";
import { Plane, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/my-trips")({
  head: () => ({ meta: [{ title: "My Trips · TK Airlines" }, { name: "description", content: "View your upcoming and past TK Airlines trips." }]}),
  component: MyTrips,
});

const TRIPS = [
  { ref: "TK4Q9X", from: "LHR", to: "IST", date: "2026-07-12", status: "Upcoming" },
  { ref: "TK7B2A", from: "IST", to: "JFK", date: "2026-09-03", status: "Upcoming" },
  { ref: "TK1D5P", from: "CDG", to: "DXB", date: "2026-02-18", status: "Completed" },
];

function MyTrips() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Your journey</p>
        <h1 className="mt-1 text-3xl font-black sm:text-4xl">My Trips</h1>
        <p className="mt-2 text-muted-foreground">Sign in to sync all your bookings, or look up a single trip by reference.</p>

        <div className="mt-6 flex gap-2">
          <Button asChild variant="default"><Link to="/manage-booking">Find a booking</Link></Button>
        </div>

        <div className="mt-8 grid gap-4">
          {TRIPS.map((t) => (
            <article key={t.ref} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary"><Plane className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{t.ref} · {t.date}</p>
                  <p className="mt-0.5 text-lg font-black">{t.from} <ArrowRight className="mx-1 inline h-4 w-4" /> {t.to}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${t.status === "Upcoming" ? "bg-emerald-500/15 text-emerald-600" : "bg-secondary text-muted-foreground"}`}>{t.status}</span>
                <Button size="sm" asChild variant="outline"><Link to="/manage-booking">Manage</Link></Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
