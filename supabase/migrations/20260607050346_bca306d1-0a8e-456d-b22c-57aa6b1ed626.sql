
-- 1) Restrict project_needs read to authenticated users
DROP POLICY IF EXISTS project_needs_read ON public.project_needs;
CREATE POLICY project_needs_read ON public.project_needs
  FOR SELECT TO authenticated
  USING (true);

-- 2) Revoke EXECUTE on trigger-only SECURITY DEFINER functions from app roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_project_owner_on_application() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- 3) Revoke EXECUTE from anon on RLS-helper SECURITY DEFINER functions
-- (authenticated retains EXECUTE because RLS policies on user-facing tables call them)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.user_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_mod(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_verified_user(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_project_owner(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_project_member(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_project_team(uuid, uuid) FROM PUBLIC, anon;
