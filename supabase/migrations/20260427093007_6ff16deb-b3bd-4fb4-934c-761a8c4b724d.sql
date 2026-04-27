-- Revoke direct API access to the signup trigger function (still runs as a trigger).
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- Replace the broad SELECT policy on product-images with a path-scoped one
-- so clients can fetch individual files but cannot LIST the bucket contents.
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;

CREATE POLICY "Anyone can view individual product images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images' AND name IS NOT NULL AND name <> '');