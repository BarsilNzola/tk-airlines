import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/tk/SiteShell";
import { MilesCard } from "@/components/tk/MilesCard";

export const Route = createFileRoute("/tk-miles")({
  head: () => ({ meta: [{ title: "TK Miles · TK Airlines" }, { name: "description", content: "Earn miles on every flight and unlock lounges, upgrades and partner perks." }]}),
  component: () => <SiteShell><MilesCard /></SiteShell>,
});
