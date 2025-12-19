-- Fix admin RLS policies that use obsolete profiles.role column
-- These policies should use the has_role() function with user_roles table

-- Drop obsolete order policies that reference profiles.role
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;

-- Create corrected admin policies for orders table
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all orders"
ON public.orders
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all orders"
ON public.orders
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin policies for order_items table
CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage order items"
ON public.order_items
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin policies for products table
-- Allow admins to view all products (including inactive)
CREATE POLICY "Admins can view all products"
ON public.products
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update any product
CREATE POLICY "Admins can update all products"
ON public.products
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete any product
CREATE POLICY "Admins can delete all products"
ON public.products
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to create products
CREATE POLICY "Admins can create products"
ON public.products
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));