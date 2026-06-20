
-- Add phone to contact_messages
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS phone text;

-- Notifications table (public read announcements)
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notifications TO anon, authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read notifications" ON public.notifications FOR SELECT USING (true);

INSERT INTO public.notifications (title, body, category, link) VALUES
  ('Winter Sale · up to 40% off', 'Book by Sunday for fares to Istanbul, Paris, Tokyo and more.', 'promo', '/destinations'),
  ('New route: London → Hanoi', 'Daily non-stop service starts March 12. Earn 2× TK Miles in the first month.', 'route', '/destinations'),
  ('Check-in opens 24h before departure', 'Save time at the airport — check in online and get your mobile boarding pass.', 'info', '/check-in');
