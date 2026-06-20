import { Plane, Star } from "lucide-react";

export function MilesCard() {
  return (
    <section id="miles" className="bg-charcoal/95 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">TK Miles Loyalty</p>
          <h2 className="mt-1 text-3xl font-black sm:text-4xl">Earn more. Fly further.</h2>
          <p className="mt-3 max-w-md text-white/70">Join free, earn miles on every flight, and unlock lounges, upgrades and partner perks worldwide.</p>
          <ul className="mt-6 space-y-2 text-sm">
            {["Free cabin upgrades", "Extra baggage allowance", "Lounge access in 60+ airports", "Spend miles on partners & shopping"].map((t) => (
              <li key={t} className="flex items-start gap-2"><Star className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t}</li>
            ))}
          </ul>
          <a href="/tk-miles" className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:scale-105">Join TK Miles · Free</a>
        </div>

        <div className="relative">
          <div className="gradient-red relative overflow-hidden rounded-2xl p-6 shadow-elegant sm:p-8">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">TK Miles · Gold</span>
              <Plane className="h-6 w-6 rotate-45 text-white/80" />
            </div>
            <div className="mt-10">
              <p className="text-xs uppercase tracking-widest text-white/70">Available miles</p>
              <p className="text-4xl font-black sm:text-5xl">45,200</p>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-xs text-white/80"><span>Gold</span><span>Platinum · 60,000</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-3/4 rounded-full bg-white" />
              </div>
            </div>
            <div className="mt-6 flex justify-between text-xs">
              <div><p className="text-white/60">Member</p><p className="font-semibold">A. PASSENGER</p></div>
              <div className="text-right"><p className="text-white/60">No.</p><p className="font-mono font-semibold">TK 4892 1107</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
