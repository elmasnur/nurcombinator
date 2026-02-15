-- Revoke anonymous access to profiles_public view
-- Only authenticated users should be able to query user profiles
REVOKE SELECT ON public.profiles_public FROM anon;

-- Fix the overly permissive WITH CHECK (true) on applications_update_project_team
-- Replace with a proper check that only allows updating status field
DROP POLICY IF EXISTS "applications_update_project_team" ON public.applications;
CREATE POLICY "applications_update_project_team"
  ON public.applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM open_calls oc
      WHERE oc.id = applications.open_call_id
        AND (is_project_owner(oc.project_id, auth.uid())
          OR is_project_team(oc.project_id, auth.uid())
          OR is_admin_or_mod(auth.uid()))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM open_calls oc
      WHERE oc.id = applications.open_call_id
        AND (is_project_owner(oc.project_id, auth.uid())
          OR is_project_team(oc.project_id, auth.uid())
          OR is_admin_or_mod(auth.uid()))
    )
  );