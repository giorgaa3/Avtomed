-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule the job to run daily at 9 AM
SELECT cron.schedule(
  'check-expiring-products-daily',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url:='https://qpltmfegqjryemandbum.supabase.co/functions/v1/notify-expiring-products',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwbHRtZmVncWpyeWVtYW5kYnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2Njk0NjgsImV4cCI6MjA2ODI0NTQ2OH0.-NdgjoICyTzo00M4ElORiLuzTYGMBmvjEq73SfpjlUg"}'::jsonb
  ) as request_id;
  $$
);