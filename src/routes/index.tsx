import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/tk/Hero";
import { BookingTabs } from "@/components/tk/BookingTabs";
import { Destinations } from "@/components/tk/Destinations";
import { MilesCard } from "@/components/tk/MilesCard";
import { Announcement } from "@/components/tk/Announcement";
import { SiteShell } from "@/components/tk/SiteShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TK Airlines · Fly the world, in premium comfort" },
      { name: "description", content: "Book flights to 120+ destinations, manage your trip, earn TK Miles, and chat with our AI assistant or WhatsApp support anytime." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <Hero />
      <BookingTabs />
      <div className="py-12 sm:py-16"><Announcement /></div>
      <Destinations />
      <MilesCard />
    </SiteShell>
  );
}
