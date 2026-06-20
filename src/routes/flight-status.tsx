import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plane, Search, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { SiteShell } from "@/components/tk/SiteShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/flight-status")({
  head: () => ({ meta: [
    { title: "Flight Status · TK Airlines" },
    { name: "description", content: "Check real-time TK flight status by flight number or route." },
  ]}),
  component: FlightStatusPage,
});

type Status = "On time" | "Delayed" | "Boarding" | "Departed" | "Landed" | "Cancelled";
interface Result {
  flight: string; from: string; to: string; std: string; etd: string; gate: string; terminal: string;
  aircraft: string; status: Status; progress: number;
}

const AIRPORTS = ["IST", "LHR", "JFK", "DXB", "CDG", "LAX", "SIN", "FRA", "HND", "AMS"];
const STATUSES: Status[] = ["On time", "Boarding", "Delayed", "Departed", "Landed"];

function mockStatus(flightNo: string): Result {
  const seed = [...flightNo.toUpperCase()].reduce((a, c) => a + c.charCodeAt(0), 0);
  const pick = <T,>(arr: T[], off = 0) => arr[(seed + off) % arr.length];
  const status = pick(STATUSES, 3);
  const hh = String((seed % 12) + 6).padStart(2, "0");
  const mm = String((seed * 7) % 60).padStart(2, "0");
  const dh = status === "Delayed" ? 1 : 0;
  return {
    flight: flightNo.toUpperCase(),
    from: pick(AIRPORTS), to: pick(AIRPORTS, 5),
    std: `${hh}:${mm}`,
    etd: `${String((Number(hh) + dh) % 24).padStart(2, "0")}:${mm}`,
    gate: `${String.fromCharCode(65 + (seed % 6))}${(seed % 30) + 1}`,
    terminal: String((seed % 3) + 1),
    aircraft: pick(["Boeing 787-9", "Airbus A350-900", "Boeing 777-300ER", "Airbus A321neo"], 2),
    status,
    progress: status === "Landed" ? 100 : status === "Departed" ? 65 : status === "Boarding" ? 15 : status === "Delayed" ? 0 : 30,
  };
}

function FlightStatusPage() {
  const [flightNo, setFlightNo] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const v = flightNo.trim();
    if (!/^[A-Za-z]{0,3}\d{1,4}$|^TK\s?\d{1,4}$/i.test(v) && v.length < 3) {
      toast.error("Enter a valid flight number (e.g. TK1980)"); return;
    }
    setLoading(true); setResult(null);
    setTimeout(() => { setResult(mockStatus(v)); setLoading(false); }, 700);
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Live flight tracking</p>
        <h1 className="mt-1 text-3xl font-black sm:text-4xl">Flight Status</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Track any TK flight in real time. Enter a flight number to see gate, terminal and on-time performance.</p>

        <form onSubmit={search} className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:grid-cols-[1fr_auto] sm:p-5">
          <div>
            <Label htmlFor="fno">Flight number</Label>
            <div className="relative mt-1">
              <Plane className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="fno" value={flightNo} onChange={(e) => setFlightNo(e.target.value)} placeholder="e.g. TK1980" className="pl-9 uppercase" maxLength={8} />
            </div>
          </div>
          <div className="flex items-end">
            <Button type="submit" size="lg" className="h-11 w-full gap-2" disabled={loading}>
              <Search className="h-4 w-4" /> {loading ? "Searching…" : "Track flight"}
            </Button>
          </div>
        </form>

        {loading && <div className="mt-6 h-48 animate-pulse rounded-2xl bg-secondary" />}

        {result && (
          <article className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/50 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Flight</p>
                <p className="text-xl font-black">{result.flight}</p>
              </div>
              <StatusBadge status={result.status} />
            </div>
            <div className="grid gap-6 px-5 py-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div>
                <p className="text-3xl font-black">{result.from}</p>
                <p className="text-xs text-muted-foreground">Departure · Terminal {result.terminal} · Gate {result.gate}</p>
                <p className="mt-2 text-sm"><Clock className="mr-1 inline h-4 w-4 text-muted-foreground" /> Sched {result.std} · Est {result.etd}</p>
              </div>
              <div className="relative hidden h-12 items-center sm:flex">
                <div className="h-px w-32 bg-border" />
                <Plane className="absolute h-5 w-5 text-primary" style={{ left: `${result.progress}%`, transform: "translate(-50%, -50%) rotate(90deg)", top: "50%" }} />
              </div>
              <div className="text-right">
                <p className="text-3xl font-black">{result.to}</p>
                <p className="text-xs text-muted-foreground">Arrival</p>
                <p className="mt-2 text-sm text-muted-foreground">{result.aircraft}</p>
              </div>
            </div>
            <div className="h-2 w-full bg-secondary">
              <div className="h-full bg-primary transition-all" style={{ width: `${result.progress}%` }} />
            </div>
          </article>
        )}
      </section>
    </SiteShell>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; icon: typeof CheckCircle2 }> = {
    "On time":   { bg: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", icon: CheckCircle2 },
    "Boarding":  { bg: "bg-blue-500/15 text-blue-600 border-blue-500/30",         icon: CheckCircle2 },
    "Departed":  { bg: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30",   icon: Plane },
    "Landed":    { bg: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", icon: CheckCircle2 },
    "Delayed":   { bg: "bg-amber-500/15 text-amber-600 border-amber-500/30",       icon: Clock },
    "Cancelled": { bg: "bg-red-500/15 text-red-600 border-red-500/30",             icon: AlertTriangle },
  };
  const { bg, icon: Icon } = map[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${bg}`}><Icon className="h-3.5 w-3.5" />{status}</span>;
}
