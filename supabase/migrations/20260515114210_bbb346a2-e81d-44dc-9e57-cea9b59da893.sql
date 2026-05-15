GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.user_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO anon, authenticated, service_role;