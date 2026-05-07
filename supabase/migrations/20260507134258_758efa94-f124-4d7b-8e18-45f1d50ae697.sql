
-- 1. Prevent users from escalating their role via profiles update
DROP POLICY IF EXISTS "Users can update their own profile data" ON public.profiles;

CREATE POLICY "Users can update their own profile data"
ON public.profiles
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND role = (SELECT p.role FROM public.profiles p WHERE p.user_id = auth.uid())
);

-- 2. Lock down internal_secrets: explicit admin-only policies (deny by default for everyone else)
CREATE POLICY "Only admins can view internal secrets"
ON public.internal_secrets
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.user_role));

CREATE POLICY "Only admins can insert internal secrets"
ON public.internal_secrets
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.user_role));

CREATE POLICY "Only admins can update internal secrets"
ON public.internal_secrets
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.user_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.user_role));

CREATE POLICY "Only admins can delete internal secrets"
ON public.internal_secrets
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.user_role));

-- 3. Restrict EXECUTE on SECURITY DEFINER functions to only the roles that need them
-- Trigger-only functions: revoke from anon and authenticated entirely
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- has_role / get_user_role are used inside RLS policies for signed-in users; revoke from anon only
REVOKE ALL ON FUNCTION public.has_role(uuid, public.user_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.user_role) TO authenticated;

REVOKE ALL ON FUNCTION public.get_user_role(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;
