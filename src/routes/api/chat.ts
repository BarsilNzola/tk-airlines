import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM_PROMPT = `You are "TK Assistant", the friendly AI concierge for TK Airlines — a premium global airline.

You help passengers with:
- Flight booking guidance, baggage rules, check-in (online opens 24h before, closes 1h before for domestic / 1.5h international), seat selection
- Destinations, visa pointers (advise checking the embassy), cabin classes (Economy, Comfort, Business)
- Loyalty: "TK Miles" tiers — Classic, Silver, Gold, Platinum
- Refunds, schedule changes, lounge access, special assistance, pet travel, unaccompanied minors

Style: warm, concise, premium. Use short paragraphs and bullet points. If a question needs a human, suggest the Contact Us panel — they can WhatsApp +44 7853 169761 or submit the contact form.

Never invent specific flight numbers, prices, or guaranteed availability. Encourage the user to run a flight search for live results.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(body.messages as UIMessage[]),
        });
        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
        });
      },
    },
  },
});
