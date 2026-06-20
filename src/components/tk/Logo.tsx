export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M2 16l20-8-9 14-2-6-9-0z" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-black tracking-widest text-foreground">TK AIRLINES</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Fly Premium</div>
      </div>
    </div>
  );
}
