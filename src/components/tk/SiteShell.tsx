import { useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingActions } from "./FloatingActions";
import { ContactPanel } from "./ContactPanel";

export function SiteShell({ children }: { children: ReactNode }) {
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <Header onOpenContact={() => setContactOpen(true)} />
      <main>{children}</main>
      <Footer />
      <FloatingActions onOpenContact={() => setContactOpen(true)} />
      <ContactPanel open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
}
