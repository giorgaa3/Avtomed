-- Remove price column from products table
ALTER TABLE products DROP COLUMN IF EXISTS price;

-- Also remove discount-related columns since they're pricing-related
ALTER TABLE products DROP COLUMN IF EXISTS discount_percentage;
ALTER TABLE products DROP COLUMN IF EXISTS discount_start_date;
ALTER TABLE products DROP COLUMN IF EXISTS discount_end_date;