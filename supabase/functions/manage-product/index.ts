import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Server-side validation for product data
function validateProductData(data: any): { valid: boolean; errors: string[]; sanitized?: any } {
  const errors: string[] = [];

  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push("Product name is required");
  } else if (data.name.trim().length === 0) {
    errors.push("Product name cannot be empty");
  } else if (data.name.length > 200) {
    errors.push("Product name must be less than 200 characters");
  }

  // Description validation
  if (data.description && typeof data.description !== 'string') {
    errors.push("Description must be a string");
  } else if (data.description && data.description.length > 5000) {
    errors.push("Description must be less than 5000 characters");
  }

  // Stock quantity validation
  const stockQuantity = parseInt(data.stock_quantity);
  if (isNaN(stockQuantity) || stockQuantity < 0) {
    errors.push("Stock quantity must be a non-negative number");
  } else if (stockQuantity > 999999) {
    errors.push("Stock quantity cannot exceed 999999");
  }

  // Condition validation
  const validConditions = ['new', 'used', 'refurbished'];
  if (data.condition && !validConditions.includes(data.condition)) {
    errors.push("Condition must be 'new', 'used', or 'refurbished'");
  }

  // Manufacturer validation
  if (data.manufacturer && typeof data.manufacturer !== 'string') {
    errors.push("Manufacturer must be a string");
  } else if (data.manufacturer && data.manufacturer.length > 100) {
    errors.push("Manufacturer must be less than 100 characters");
  }

  // Origin country validation
  if (data.origin_country && typeof data.origin_country !== 'string') {
    errors.push("Origin country must be a string");
  } else if (data.origin_country && data.origin_country.length > 100) {
    errors.push("Origin country must be less than 100 characters");
  }

  // Image URL validation
  if (data.image_url && typeof data.image_url === 'string' && data.image_url.trim().length > 0) {
    try {
      new URL(data.image_url);
      if (data.image_url.length > 2000) {
        errors.push("Image URL is too long");
      }
    } catch {
      errors.push("Invalid image URL format");
    }
  }

  // Category ID validation (UUID format)
  if (data.category_id && typeof data.category_id === 'string' && data.category_id.trim().length > 0) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.category_id)) {
      errors.push("Invalid category ID format");
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Return sanitized data
  const sanitized = {
    name: String(data.name).trim().substring(0, 200),
    description: data.description ? String(data.description).trim().substring(0, 5000) : null,
    stock_quantity: Math.max(0, Math.min(parseInt(data.stock_quantity) || 0, 999999)),
    condition: data.condition || 'new',
    manufacturer: data.manufacturer ? String(data.manufacturer).trim().substring(0, 100) : null,
    origin_country: data.origin_country ? String(data.origin_country).trim().substring(0, 100) : null,
    image_url: data.image_url ? String(data.image_url).trim().substring(0, 2000) : null,
    category_id: data.category_id || null,
    is_active: Boolean(data.is_active),
    seller_id: data.seller_id,
  };

  return { valid: true, errors: [], sanitized };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: 'Unauthorized - no token provided' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: 'Invalid auth token' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Authenticated user: ${user.id}`);

    const body = await req.json();
    const { action, productId, productData } = body;

    // Get user's profile (seller_id)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === 'create') {
      // Validate product data
      const validation = validateProductData({ ...productData, seller_id: profile.id });
      if (!validation.valid) {
        console.error("Validation errors:", validation.errors);
        return new Response(
          JSON.stringify({ error: 'Validation failed', details: validation.errors }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log("Creating product with validated data");

      const { data, error } = await supabase
        .from('products')
        .insert([validation.sanitized])
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        return new Response(
          JSON.stringify({ error: 'Failed to create product', details: error.message }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log("Product created successfully:", data.id);

      return new Response(
        JSON.stringify({ success: true, product: data }),
        { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else if (action === 'update') {
      if (!productId) {
        return new Response(
          JSON.stringify({ error: 'Product ID is required for update' }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Validate product data (without seller_id for updates)
      const validation = validateProductData({ ...productData, seller_id: profile.id });
      if (!validation.valid) {
        console.error("Validation errors:", validation.errors);
        return new Response(
          JSON.stringify({ error: 'Validation failed', details: validation.errors }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Remove seller_id from update data (shouldn't change owner)
      const { seller_id, ...updateData } = validation.sanitized!;

      console.log(`Updating product ${productId} with validated data`);

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        return new Response(
          JSON.stringify({ error: 'Failed to update product', details: error.message }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log("Product updated successfully");

      return new Response(
        JSON.stringify({ success: true, product: data }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "create" or "update"' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

  } catch (error: any) {
    console.error("Error in manage-product function:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
