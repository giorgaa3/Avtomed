-- Re-grant EXECUTE so RLS policy evaluation does not fail with "permission denied for function has_role".
-- has_role is SECURITY DEFINER and only checks user_roles by user_id+role, returning a boolean.
-- A user can already SELECT their own roles via the existing policy, so direct calls do not leak information.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.user_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated, anon;