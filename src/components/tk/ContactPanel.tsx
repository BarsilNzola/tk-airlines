import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Bot, Send, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BRAND, waLink } from "@/lib/constants";
import { TKAssistant } from "./TKAssistant";

export function ContactPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"><MessageCircle className="h-4 w-4" /></span>
            How can we help?
          </SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="assistant" className="flex h-[calc(100vh-65px)] flex-col">
          <TabsList className="m-3 grid grid-cols-2">
            <TabsTrigger value="assistant" className="gap-1.5"><Bot className="h-4 w-4" /> TK Assistant</TabsTrigger>
            <TabsTrigger value="contact" className="gap-1.5"><Mail className="h-4 w-4" /> Contact form</TabsTrigger>
          </TabsList>
          <TabsContent value="assistant" className="flex-1 overflow-hidden px-3 pb-3"><TKAssistant /></TabsContent>
          <TabsContent value="contact" className="flex-1 overflow-auto px-5 pb-6"><ContactForm /></TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function ContactForm() {
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      subject: String(fd.get("subject") || "").trim() || null,
      message: String(fd.get("message") || "").trim(),
    };
    if (!payload.name || !payload.email || !payload.phone || !payload.message) { toast.error("Please fill all required fields (phone included)"); return; }
    if (!/^[+\d\s().-]{7,20}$/.test(payload.phone)) { toast.error("Enter a valid phone number"); return; }
    if (payload.message.length > 2000) { toast.error("Message too long"); return; }

    const form = e.currentTarget;
    const caseRef = `TK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setLoading(true);
    let dbOk = false, fsOk = false;
    try {
      const { error } = await supabase.from("contact_messages").insert({ ...payload, subject: `[${caseRef}] ${payload.subject || "Contact"}` });
      dbOk = !error;
      if (error) console.error("contact_messages insert:", error);
    } catch (err) { console.error(err); }
    try {
      const res = await fetch(BRAND.formspreeEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `TK Airlines · Case ${caseRef} · ${payload.subject || "Contact form"}`,
          _replyto: payload.email,
          caseReference: caseRef,
          ...payload,
        }),
      });
      fsOk = res.ok;
    } catch (err) { console.error(err); }
    setLoading(false);
    if (dbOk || fsOk) {
      toast.success(`Case ${caseRef} created`, { duration: 12000, description: "Save this reference — we'll reply within 24h." });
      form.reset();
    } else {
      toast.error("Could not send right now. Please WhatsApp us.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="rounded-xl border border-border bg-secondary/60 p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fastest reply</p>
        <p className="mt-1 text-sm">Chat with our team on WhatsApp — usually replies in minutes.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={waLink("Hi TK Airlines, I need help with…")}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--whatsapp)] px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:scale-105"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp {BRAND.whatsappDisplay}
          </a>
          <a href={`tel:+${BRAND.whatsappNumber}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:bg-accent">
            <Phone className="h-4 w-4" /> Call
          </a>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label htmlFor="name">Full name *</Label><Input id="name" name="name" required maxLength={100} /></div>
        <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required maxLength={200} /></div>
      </div>
      <div><Label htmlFor="phone">Phone number *</Label><Input id="phone" name="phone" type="tel" required maxLength={20} /></div>
      <div><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" maxLength={200} placeholder="Booking reference, baggage, etc." /></div>
      <div><Label htmlFor="message">Message *</Label><Textarea id="message" name="message" required rows={5} maxLength={2000} /></div>
      <Button type="submit" className="w-full gap-2" disabled={loading}><Send className="h-4 w-4" />{loading ? "Sending…" : "Send message"}</Button>
    </form>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 21.5c-1.806 0-3.575-.487-5.121-1.41L3.5 21l1.05-3.346A9.957 9.957 0 012.5 12.04C2.5 6.756 6.756 2.5 12.04 2.5S21.58 6.756 21.58 12.04 17.324 21.5 12.04 21.5z"/>
    </svg>
  );
}
