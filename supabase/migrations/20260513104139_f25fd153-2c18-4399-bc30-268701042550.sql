-- Fix SECURITY DEFINER view: recreate profiles_public with security_invoker so RLS of querying user applies
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
  SELECT id, display_name, bio, skills_tags, availability_hours, created_at
  FROM public.profiles;

REVOKE ALL ON public.profiles_public FROM anon;
GRANT SELECT ON public.profiles_public TO authenticated;

-- Prevent users from inserting notifications directly (only server-side / SECURITY DEFINER functions should create them)
DROP POLICY IF EXISTS "No direct notification inserts" ON public.notifications;
CREATE POLICY "No direct notification inserts"
ON public.notifications
FOR INSERT
TO authenticated, anon
WITH CHECK (false);