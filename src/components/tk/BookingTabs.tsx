import { useState } from "react";
import { Plane, Hotel, Car, ArrowRightLeft, Users, Calendar, MapPin, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/lib/constants";

export function BookingTabs() {
  return (
    <div id="book" className="relative -mt-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-card/95 p-3 shadow-elegant backdrop-blur-xl sm:p-5">
        <Tabs defaultValue="flight">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="flight" className="gap-1.5"><Plane className="h-4 w-4" />Flight</TabsTrigger>
            <TabsTrigger value="hotel" className="gap-1.5"><Hotel className="h-4 w-4" />Hotel</TabsTrigger>
            <TabsTrigger value="car" className="gap-1.5"><Car className="h-4 w-4" />Car</TabsTrigger>
          </TabsList>
          <TabsContent value="flight" className="pt-4"><FlightForm /></TabsContent>
          <TabsContent value="hotel" className="pt-4"><HotelForm /></TabsContent>
          <TabsContent value="car" className="pt-4"><CarForm /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function FlightForm() {
  const [loading, setLoading] = useState(false);
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [pax, setPax] = useState("1");
  const [cabin, setCabin] = useState("economy");

  const swap = () => { setFrom(to); setTo(from); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim() || !depart) {
      toast.error("Please fill From, To, and Departure date.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        trip_type: tripType,
        from_airport: from.trim(),
        to_airport: to.trim(),
        depart_date: depart,
        return_date: tripType === "round" ? ret || null : null,
        passengers: Number(pax),
        cabin_class: cabin,
      };
      const { error } = await supabase.from("bookings").insert(payload);
      if (error) throw error;

      // Notify via Formspree
      void fetch(BRAND.formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: "TK Airlines · New flight search", ...payload }),
      }).catch(() => {});

      toast.success(`Searching ${from.toUpperCase()} → ${to.toUpperCase()}…`, {
        description: `${pax} passenger(s) · ${cabin}. We'll email you the best fares.`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setTripType("round")} className={`rounded-full px-3 py-1 text-xs font-semibold transition ${tripType === "round" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>Round trip</button>
        <button type="button" onClick={() => setTripType("oneway")} className={`rounded-full px-3 py-1 text-xs font-semibold transition ${tripType === "oneway" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>One way</button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_1fr_1fr]">
        <div className="relative">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">From</Label>
          <div className="relative mt-1">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="LHR · London Heathrow" className="pl-9" />
          </div>
        </div>
        <div className="hidden items-end pb-1 md:flex">
          <Button type="button" variant="outline" size="icon" onClick={swap} aria-label="Swap"><ArrowRightLeft className="h-4 w-4" /></Button>
        </div>
        <div>
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">To</Label>
          <div className="relative mt-1">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="IST · Istanbul" className="pl-9" />
          </div>
        </div>
        <div>
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Departure</Label>
          <div className="relative mt-1">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="date" value={depart} onChange={(e) => setDepart(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div>
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Return</Label>
          <div className="relative mt-1">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="date" value={ret} onChange={(e) => setRet(e.target.value)} className="pl-9" disabled={tripType === "oneway"} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div>
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Passengers</Label>
          <div className="relative mt-1">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Select value={pax} onValueChange={setPax}>
              <SelectTrigger className="pl-9"><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n} {n===1?"passenger":"passengers"}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cabin class</Label>
          <Select value={cabin} onValueChange={setCabin}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="comfort">Comfort</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button type="submit" size="lg" className="h-11 w-full gap-2 sm:w-auto" disabled={loading}>
            <Search className="h-4 w-4" /> {loading ? "Searching…" : "Search flights"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function HotelForm() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div><Label>Destination</Label><Input placeholder="City or hotel" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Check-in</Label><Input type="date" /></div>
        <div><Label>Check-out</Label><Input type="date" /></div>
      </div>
      <Button className="sm:col-span-2"><Search className="mr-2 h-4 w-4" />Search hotels</Button>
    </div>
  );
}
function CarForm() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div><Label>Pick-up location</Label><Input placeholder="Airport or city" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Pick-up</Label><Input type="date" /></div>
        <div><Label>Return</Label><Input type="date" /></div>
      </div>
      <Button className="sm:col-span-2"><Search className="mr-2 h-4 w-4" />Search cars</Button>
    </div>
  );
}
