import { useState } from "react";
import { Globe, Menu, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Notifications } from "./Notifications";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const NAV: { label: string; to: string }[] = [
  { label: "Book", to: "/" },
  { label: "Flight status", to: "/flight-status" },
  { label: "Check-in", to: "/check-in" },
  { label: "Manage booking", to: "/manage-booking" },
  { label: "My Trips", to: "/my-trips" },
  { label: "TK Miles", to: "/tk-miles" },
  { label: "Destinations", to: "/destinations" },
];

export function Header({ onOpenContact }: { onOpenContact: () => void }) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="mt-6 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link key={n.label} to={n.to} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium hover:bg-accent" activeProps={{ className: "text-primary" }}>
                  {n.label}
                </Link>
              ))}
              <button onClick={() => { setMenuOpen(false); onOpenContact(); }} className="mt-2 rounded-lg px-3 py-3 text-left text-base font-medium text-primary hover:bg-accent">
                Contact Us
              </button>
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/" className="shrink-0"><Logo /></Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" className="hidden text-xs sm:flex">
            <Globe className="mr-1 h-4 w-4" /> EN · GBP
          </Button>
          <Notifications />
          <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <User className="h-4 w-4" /> Sign in
              </Button>
            </DialogTrigger>
            <SignInDialog onClose={() => setSignInOpen(false)} />
          </Dialog>
        </div>
      </div>
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
    </header>
  );
}

function SignInDialog({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>, mode: "signin" | "signup") => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "");
    const password = String(data.get("password") || "");
    setLoading(true);
    try {
      const { error } = mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/` } });
      if (error) throw error;
      toast.success(mode === "signin" ? "Welcome back!" : "Account created — check your email.");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader><DialogTitle>TK Miles · Members</DialogTitle></DialogHeader>
      <Tabs defaultValue="signin">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Create account</TabsTrigger>
        </TabsList>
        <TabsContent value="signin" className="pt-4">
          <form onSubmit={(e) => handleSignIn(e, "signin")} className="space-y-3">
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required minLength={6} /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
          </form>
        </TabsContent>
        <TabsContent value="signup" className="pt-4">
          <form onSubmit={(e) => handleSignIn(e, "signup")} className="space-y-3">
            <div><Label htmlFor="se">Email</Label><Input id="se" name="email" type="email" required /></div>
            <div><Label htmlFor="sp">Password</Label><Input id="sp" name="password" type="password" required minLength={6} /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
          </form>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
