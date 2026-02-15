
-- Create security definer function to check project ownership without RLS recursion
CREATE OR REPLACE FUNCTION public.is_project_owner(p_project_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = p_project_id AND owner_id = p_user_id
  );
$$;

-- Create security definer function to check project membership without RLS recursion
CREATE OR REPLACE FUNCTION public.is_project_member(p_project_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_project_id AND user_id = p_user_id
  );
$$;

-- Create security definer function to check project team role
CREATE OR REPLACE FUNCTION public.is_project_team(p_project_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_project_id AND user_id = p_user_id
      AND role IN ('owner','core','moderator','editor')
  );
$$;

-- Fix project_members policies
DROP POLICY IF EXISTS "pm_read_members" ON public.project_members;
CREATE POLICY "pm_read_members" ON public.project_members FOR SELECT
USING (
  public.is_project_member(project_id, auth.uid())
  OR public.is_project_owner(project_id, auth.uid())
  OR public.is_admin_or_mod(auth.uid())
);

DROP POLICY IF EXISTS "pm_insert_owner" ON public.project_members;
CREATE POLICY "pm_insert_owner" ON public.project_members FOR INSERT
WITH CHECK (
  public.is_project_owner(project_id, auth.uid())
  OR public.is_admin_or_mod(auth.uid())
);

DROP POLICY IF EXISTS "pm_update_owner" ON public.project_members;
CREATE POLICY "pm_update_owner" ON public.project_members FOR UPDATE
USING (
  public.is_project_owner(project_id, auth.uid())
  OR public.is_admin_or_mod(auth.uid())
);

DROP POLICY IF EXISTS "pm_delete_owner" ON public.project_members;
CREATE POLICY "pm_delete_owner" ON public.project_members FOR DELETE
USING (
  public.is_project_owner(project_id, auth.uid())
  OR public.is_admin_or_mod(auth.uid())
);

-- Fix projects private read policy to use security definer
DROP POLICY IF EXISTS "projects_read_private_members" ON public.projects;
CREATE POLICY "projects_read_private_members" ON public.projects FOR SELECT
USING (
  visibility = 'private'
  AND (
    owner_id = auth.uid()
    OR public.is_project_member(id, auth.uid())
    OR public.is_admin_or_mod(auth.uid())
  )
);

-- Fix open_calls policies that reference project_members
DROP POLICY IF EXISTS "open_calls_read_team" ON public.open_calls;
CREATE POLICY "open_calls_read_team" ON public.open_calls FOR SELECT
USING (
  public.is_project_owner(project_id, auth.uid())
  OR public.is_project_member(project_id, auth.uid())
  OR public.is_admin_or_mod(auth.uid())
);

DROP POLICY IF EXISTS "open_calls_insert_team" ON public.open_calls;
CREATE POLICY "open_calls_insert_team" ON public.open_calls FOR INSERT
WITH CHECK (
  public.is_project_owner(project_id, auth.uid())
  OR public.is_project_team(project_id, auth.uid())
  OR public.is_admin_or_mod(auth.uid())
);

DROP POLICY IF EXISTS "open_calls_update_team" ON public.open_calls;
CREATE POLICY "open_calls_update_team" ON public.open_calls FOR UPDATE
USING (
  public.is_project_owner(project_id, auth.uid())
  OR public.is_project_team(project_id, auth.uid())
  OR public.is_admin_or_mod(auth.uid())
);

DROP POLICY IF EXISTS "open_calls_delete_team" ON public.open_calls;
CREATE POLICY "open_calls_delete_team" ON public.open_calls FOR DELETE
USING (
  public.is_project_owner(project_id, auth.uid())
  OR public.is_project_team(project_id, auth.uid())
  OR public.is_admin_or_mod(auth.uid())
);

-- Fix checkins policies
DROP POLICY IF EXISTS "checkins_read_members" ON public.checkins;
CREATE POLICY "checkins_read_members" ON public.checkins FOR SELECT
USING (
  public.is_project_owner(project_id, auth.uid())
  OR public.is_project_member(project_id, auth.uid())
  OR public.is_admin_or_mod(auth.uid())
);

DROP POLICY IF EXISTS "checkins_insert_members" ON public.checkins;
CREATE POLICY "checkins_insert_members" ON public.checkins FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND (
    public.is_project_owner(project_id, auth.uid())
    OR public.is_project_member(project_id, auth.uid())
  )
);

-- Fix project_needs policies
DROP POLICY IF EXISTS "project_needs_write_member" ON public.project_needs;
CREATE POLICY "project_needs_write_member" ON public.project_needs FOR INSERT
WITH CHECK (
  public.is_project_owner(project_id, auth.uid())
  OR public.is_project_member(project_id, auth.uid())
);

DROP POLICY IF EXISTS "project_needs_delete_member" ON public.project_needs;
CREATE POLICY "project_needs_delete_member" ON public.project_needs FOR DELETE
USING (
  public.is_project_owner(project_id, auth.uid())
  OR public.is_project_member(project_id, auth.uid())
);

-- Fix applications policies
DROP POLICY IF EXISTS "applications_read_project_team" ON public.applications;
CREATE POLICY "applications_read_project_team" ON public.applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.open_calls oc
    WHERE oc.id = applications.open_call_id
      AND (
        public.is_project_owner(oc.project_id, auth.uid())
        OR public.is_project_team(oc.project_id, auth.uid())
        OR public.is_admin_or_mod(auth.uid())
      )
  )
);

DROP POLICY IF EXISTS "applications_update_project_team" ON public.applications;
CREATE POLICY "applications_update_project_team" ON public.applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.open_calls oc
    WHERE oc.id = applications.open_call_id
      AND (
        public.is_project_owner(oc.project_id, auth.uid())
        OR public.is_project_team(oc.project_id, auth.uid())
        OR public.is_admin_or_mod(auth.uid())
      )
  )
)
WITH CHECK (true);
