import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[BOG-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the service role key for secure database operations
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("BOG payment function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { orderId, paymentMethod = 'bog_gateway' } = await req.json();
    
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    logStep("Processing payment request", { orderId, paymentMethod });

    // Fetch the order details
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found or access denied");
    }

    logStep("Order found", { orderTotal: order.total_amount, currency: order.currency });

    // TODO: Integrate with actual BOG Payment Gateway API
    // For now, we'll create a mock payment reference
    const paymentReference = `BOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update order with payment reference
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ 
        payment_reference: paymentReference,
        status: 'pending' // Keep as pending until actual payment confirmation
      })
      .eq('id', orderId);

    if (updateError) {
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    logStep("Order updated with payment reference", { paymentReference });

    // TODO: Replace this with actual BOG API integration
    // Example of what BOG integration might look like:
    /*
    const bogResponse = await fetch('https://api.bog.ge/payments/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('BOG_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: order.total_amount,
        currency: order.currency || 'GEL',
        order_id: orderId,
        return_url: `${req.headers.get("origin")}/order-success?order=${orderId}`,
        callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/bog-webhook`,
        description: `Order #${orderId.slice(-8)}`,
      }),
    });

    const bogData = await bogResponse.json();
    
    if (!bogResponse.ok) {
      throw new Error(`BOG API error: ${bogData.message || 'Payment gateway error'}`);
    }

    // Update order with BOG transaction ID
    await supabaseClient
      .from('orders')
      .update({ 
        bog_transaction_id: bogData.transaction_id,
        payment_reference: bogData.payment_reference
      })
      .eq('id', orderId);

    return new Response(JSON.stringify({
      success: true,
      payment_url: bogData.payment_url,
      transaction_id: bogData.transaction_id,
      order_id: orderId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    */

    // For now, return mock response for testing
    const mockPaymentUrl = `${req.headers.get("origin")}/order-success?order=${orderId}&payment_ref=${paymentReference}`;
    
    return new Response(JSON.stringify({
      success: true,
      message: "Payment initialized successfully",
      payment_url: mockPaymentUrl,
      payment_reference: paymentReference,
      order_id: orderId,
      amount: order.total_amount,
      currency: order.currency || 'GEL',
      // TODO: Replace with actual BOG payment URL
      instructions: [
        "1. Complete payment through BOG's secure gateway",
        "2. Use the payment reference provided",
        "3. Your order will be processed once payment is confirmed"
      ]
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in BOG payment function", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});