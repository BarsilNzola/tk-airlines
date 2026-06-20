import istanbul from "@/assets/dest-istanbul.jpg";
import tokyo from "@/assets/dest-tokyo.jpg";
import paris from "@/assets/dest-paris.jpg";
import { ArrowUpRight } from "lucide-react";

const DESTS = [
  { img: istanbul, city: "Istanbul", country: "Turkey", from: "£189" },
  { img: tokyo, city: "Tokyo", country: "Japan", from: "£549" },
  { img: paris, city: "Paris", country: "France", from: "£99" },
];

export function Destinations() {
  return (
    <section id="destinations" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Featured destinations</p>
          <h2 className="mt-1 text-3xl font-black sm:text-4xl">Where to next?</h2>
        </div>
        <a href="/destinations" className="hidden text-sm font-semibold text-primary hover:underline sm:inline">See all 120+ cities →</a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DESTS.map((d) => (
          <a key={d.city} href="#book" className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-card">
            <img src={d.img} alt={d.city} width={800} height={600} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-80">{d.country}</p>
                <h3 className="text-2xl font-black">{d.city}</h3>
                <p className="mt-1 text-sm opacity-90">from <span className="font-bold">{d.from}</span></p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:rotate-45"><ArrowUpRight className="h-5 w-5" /></span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
