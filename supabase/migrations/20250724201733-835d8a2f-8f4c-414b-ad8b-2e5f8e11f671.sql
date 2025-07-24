-- Add discount fields to products table
ALTER TABLE public.products 
ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
ADD COLUMN discount_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN discount_end_date TIMESTAMP WITH TIME ZONE;