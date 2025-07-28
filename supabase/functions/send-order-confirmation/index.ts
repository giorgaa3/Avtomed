import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderId: string;
  userEmail: string;
  orderDetails: {
    id: string;
    total_amount: number;
    currency: string;
    shipping_address: string;
    phone_number: string;
    items: Array<{
      product_name: string;
      quantity: number;
      price: number;
    }>;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Order confirmation email request received");

    const { orderId, userEmail, orderDetails }: OrderConfirmationRequest = await req.json();

    console.log(`Sending confirmation email for order ${orderId} to ${userEmail}`);

    // Generate order items HTML
    const orderItemsHtml = orderDetails.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0; font-weight: 500;">${item.product_name}</td>
        <td style="padding: 12px 0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right;">₾${item.price.toFixed(2)}</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600;">₾${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Order Confirmation</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #667eea; margin-top: 0;">Order Details</h2>
              <p><strong>Order ID:</strong> #${orderDetails.id.slice(-8)}</p>
              <p><strong>Total Amount:</strong> ₾${orderDetails.total_amount.toFixed(2)} ${orderDetails.currency}</p>
              <p><strong>Phone:</strong> ${orderDetails.phone_number}</p>
            </div>

            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                    <th style="padding: 12px 0; text-align: left; font-weight: 600; color: #495057;">Product</th>
                    <th style="padding: 12px 0; text-align: center; font-weight: 600; color: #495057;">Qty</th>
                    <th style="padding: 12px 0; text-align: right; font-weight: 600; color: #495057;">Price</th>
                    <th style="padding: 12px 0; text-align: right; font-weight: 600; color: #495057;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHtml}
                </tbody>
              </table>
            </div>

            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Shipping Address</h3>
              <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 0; white-space: pre-line;">${orderDetails.shipping_address}</p>
            </div>

            <div style="background: white; padding: 25px; border-radius: 8px;">
              <h3 style="color: #667eea; margin-top: 0;">Next Steps</h3>
              <p style="margin-bottom: 15px;">Your order has been successfully placed and is currently being processed.</p>
              <ul style="margin: 0; padding-left: 20px;">
                <li>You will receive payment instructions via email or SMS</li>
                <li>Once payment is confirmed, your order will be prepared for shipment</li>
                <li>You will receive a tracking number when your order ships</li>
                <li>Expected delivery: 3-5 business days</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px;">
              <p>If you have any questions about your order, please contact our customer service.</p>
              <p style="margin: 0;">Thank you for shopping with us!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Medical Store <orders@resend.dev>",
      to: [userEmail],
      subject: `Order Confirmation - #${orderDetails.id.slice(-8)}`,
      html: emailHtml,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);