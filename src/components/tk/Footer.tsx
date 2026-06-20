import { useState } from "react";
import { Logo } from "./Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/lib/constants";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Enter a valid email"); return; }
    setLoading(true);
    const { error } = await supabase.from("subscribers").insert({ email });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) { toast.error(error.message); return; }
    void fetch(BRAND.formspreeEndpoint, {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: "TK Airlines · Newsletter signup", email }),
    }).catch(() => {});
    toast.success("Subscribed! Deals coming your way.");
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{BRAND.tagline}</p>
          <form onSubmit={subscribe} className="mt-4 flex max-w-sm gap-2">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email for deals" type="email" />
            <Button type="submit" disabled={loading}>{loading ? "…" : "Join"}</Button>
          </form>
        </div>
        {[
          { title: "Book & Manage", links: [
            { label: "Flights", href: "/#book" },
            { label: "Hotels", href: "/#book" },
            { label: "Cars", href: "/#book" },
            { label: "Check-in", href: "/check-in" },
            { label: "Flight status", href: "/flight-status" },
            { label: "Manage booking", href: "/manage-booking" },
          ] },
          { title: "Experience", links: [
            { label: "Destinations", href: "/destinations" },
            { label: "My Trips", href: "/my-trips" },
            { label: "TK Miles", href: "/tk-miles" },
            { label: "Special assistance", href: "/manage-booking" },
            { label: "Baggage", href: "/manage-booking" },
            { label: "Gift cards", href: "/tk-miles" },
          ] },
          { title: "Company", links: [
            { label: "About TK Airlines", href: "/destinations" },
            { label: "Careers", href: "/destinations" },
            { label: "Press", href: "/destinations" },
            { label: "Sustainability", href: "/destinations" },
            { label: "Admin · Messages", href: "/admin/messages" },
            { label: `WhatsApp ${BRAND.whatsappDisplay}`, href: `https://wa.me/${BRAND.whatsappNumber}` },
          ] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">{col.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => <li key={l.label}><a href={l.href} className="hover:text-primary">{l.label}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} TK Airlines. All rights reserved.</p>
          <p>WhatsApp support · <a href={`tel:+${BRAND.whatsappNumber}`} className="hover:text-primary">{BRAND.whatsappDisplay}</a></p>
        </div>
      </div>
    </footer>
  );
}
