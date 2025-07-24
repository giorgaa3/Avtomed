-- Add BOG payment gateway specific columns to existing orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'GEL',
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'bog_gateway',
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS bog_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS billing_address TEXT;

-- Update existing orders to have currency set
UPDATE public.orders SET currency = 'GEL' WHERE currency IS NULL;