import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/tk/SiteShell";
import { Destinations } from "@/components/tk/Destinations";

export const Route = createFileRoute("/destinations")({
  head: () => ({ meta: [{ title: "Destinations · TK Airlines" }, { name: "description", content: "Fly to 120+ destinations across 6 continents with TK Airlines." }]}),
  component: () => <SiteShell><Destinations /></SiteShell>,
});
