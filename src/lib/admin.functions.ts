import { createServerFn } from "@tanstack/react-start";

const PASS = () => process.env.ADMIN_PASSCODE || "TKADMIN2026";

export const adminFetch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = data as { passcode?: string };
    if (!d?.passcode || typeof d.passcode !== "string") throw new Error("Passcode required");
    return { passcode: d.passcode };
  })
  .handler(async ({ data }) => {
    if (data.passcode !== PASS()) throw new Error("Invalid passcode");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: messages }, { data: bookings }, { data: subscribers }] = await Promise.all([
      supabaseAdmin.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200),
      supabaseAdmin.from("bookings").select("*").order("created_at", { ascending: false }).limit(200),
      supabaseAdmin.from("subscribers").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    return {
      messages: messages ?? [],
      bookings: bookings ?? [],
      subscribers: subscribers ?? [],
    };
  });
