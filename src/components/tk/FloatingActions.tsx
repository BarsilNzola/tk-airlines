import { MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "./ContactPanel";
import { waLink, BRAND } from "@/lib/constants";

export function FloatingActions({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <>
      {/* Side "Contact Us" tab — vertical, fixed right */}
      <button
        onClick={onOpenContact}
        aria-label="Contact us"
        className="fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 rounded-l-xl bg-primary px-2 py-6 text-primary-foreground shadow-elegant transition hover:px-3 md:block"
      >
        <span className="block text-xs font-bold uppercase tracking-widest [writing-mode:vertical-rl]">Contact Us</span>
      </button>

      {/* Floating WhatsApp + Chat buttons (mobile + desktop) */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3">
        <a
          href={waLink("Hi TK Airlines, I have a question…")}
          target="_blank" rel="noopener noreferrer"
          aria-label={`WhatsApp ${BRAND.whatsappDisplay}`}
          className="group grid h-14 w-14 place-items-center rounded-full bg-[color:var(--whatsapp)] text-white shadow-elegant transition hover:scale-110"
        >
          <WhatsAppIcon className="h-7 w-7" />
          <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-full bg-charcoal px-3 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">Chat on WhatsApp</span>
        </a>
        <button
          onClick={onOpenContact}
          aria-label="Open contact panel"
          className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant transition hover:scale-110 md:hidden"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
