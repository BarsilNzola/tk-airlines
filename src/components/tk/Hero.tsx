import hero from "@/assets/hero-jet.jpg";
import vietnam from "@/assets/dest-vietnam.jpg";
import { useEffect, useState } from "react";

const SLIDES = [
  { img: hero, eyebrow: "Premium long-haul", title: "Fly the world, in comfort.", sub: "Up to 30% off Business Class to 120+ cities this season." },
  { img: vietnam, eyebrow: "Asia's heart · Vietnam", title: "Discover Vietnam's colour.", sub: "Direct routes to Hanoi and Ho Chi Minh City from £549." },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 6000); return () => clearInterval(t); }, []);
  const s = SLIDES[i];
  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      {SLIDES.map((slide, idx) => (
        <img
          key={idx}
          src={slide.img}
          alt=""
          width={1920}
          height={1080}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
          loading={idx === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-28 sm:px-6 sm:pb-32">
        <div className="max-w-2xl animate-fade-in">
          <span className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">{s.eyebrow}</span>
          <h1 className="mt-4 text-balance text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">{s.title}</h1>
          <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">{s.sub}</p>
          <div className="mt-5 flex gap-3">
            <a href="#book" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:scale-[1.02]">Book a flight</a>
            <a href="#destinations" className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">Explore destinations</a>
          </div>
        </div>
      </div>
    </section>
  );
}
