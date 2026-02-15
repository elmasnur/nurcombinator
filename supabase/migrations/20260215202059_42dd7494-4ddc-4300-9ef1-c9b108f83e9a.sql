
-- Recreate profiles_public view WITHOUT trust_level to reduce data exposure
-- trust_level can be used to target vulnerable/low-trust users
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public AS
  SELECT id, display_name, bio, skills_tags, availability_hours, created_at
  FROM public.profiles;

-- Ensure only authenticated users can access this view
REVOKE ALL ON public.profiles_public FROM anon;
GRANT SELECT ON public.profiles_public TO authenticated;
