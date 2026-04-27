-- Private internal configuration for backend-only secrets used by scheduled jobs.
CREATE TABLE IF NOT EXISTS public.internal_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.internal_secrets ENABLE ROW LEVEL SECURITY;

-- No RLS policies are created: frontend clients cannot read or modify these rows.
-- Service-role edge functions and database-owned cron jobs can access them server-side.

INSERT INTO public.internal_secrets (key, value)
VALUES ('notify_expiring_products_cron_secret', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (key) DO NOTHING;

-- Replace the old cron job that sent the public anon key with a cron-secret header.
SELECT cron.unschedule('check-expiring-products-daily')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'check-expiring-products-daily'
);

SELECT cron.schedule(
  'check-expiring-products-daily',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://qpltmfegqjryemandbum.supabase.co/functions/v1/notify-expiring-products',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (
        SELECT value
        FROM public.internal_secrets
        WHERE key = 'notify_expiring_products_cron_secret'
      )
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);