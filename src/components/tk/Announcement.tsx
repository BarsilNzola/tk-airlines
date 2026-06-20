import { AlertTriangle } from "lucide-react";

export function Announcement() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold">Travel advisory · Schedule updates</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Some routes may be affected by ongoing operational changes. Check the latest status on your booking via{" "}
              <a href="/flight-status" className="font-semibold text-primary hover:underline">Flight status</a>. We also offer flexible rebooking and additional benefits for affected passengers — see our{" "}
              <a href="/manage-booking" className="font-semibold text-primary hover:underline">manage booking</a> page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
