import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ExpiringProduct {
  id: string;
  name: string;
  discount_end_date: string;
  discount_percentage: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate date range (next 7 days)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    console.log("Checking for expiring products...");

    // Fetch products with discounts expiring in the next 7 days
    const { data: expiringProducts, error: productsError } = await supabase
      .from("products")
      .select("id, name, discount_end_date, discount_percentage")
      .not("discount_end_date", "is", null)
      .gte("discount_end_date", now.toISOString())
      .lte("discount_end_date", nextWeek.toISOString())
      .eq("is_active", true)
      .order("discount_end_date", { ascending: true });

    if (productsError) {
      console.error("Error fetching products:", productsError);
      throw productsError;
    }

    if (!expiringProducts || expiringProducts.length === 0) {
      console.log("No expiring products found");
      return new Response(
        JSON.stringify({ message: "No expiring products found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Found ${expiringProducts.length} expiring products`);

    // Get admin users to notify
    const { data: adminProfiles, error: adminError } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .eq("role", "admin");

    if (adminError) {
      console.error("Error fetching admin profiles:", adminError);
      throw adminError;
    }

    if (!adminProfiles || adminProfiles.length === 0) {
      console.log("No admin users found to notify");
      return new Response(
        JSON.stringify({ message: "No admin users found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get admin email addresses
    const adminEmails: string[] = [];
    for (const profile of adminProfiles) {
      const { data: userData } = await supabase.auth.admin.getUserById(
        profile.user_id
      );
      if (userData?.user?.email) {
        adminEmails.push(userData.user.email);
      }
    }

    if (adminEmails.length === 0) {
      console.log("No admin emails found");
      return new Response(
        JSON.stringify({ message: "No admin emails found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Format product list for email
    const productList = expiringProducts
      .map((product: ExpiringProduct) => {
        const daysUntilExpiry = Math.ceil(
          (new Date(product.discount_end_date).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return `• ${product.name} - ${product.discount_percentage}% discount expires in ${daysUntilExpiry} days (${new Date(product.discount_end_date).toLocaleDateString()})`;
      })
      .join("\n");

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "AvtoMed <onboarding@resend.dev>",
      to: adminEmails,
      subject: `⚠️ ${expiringProducts.length} Product Discount${expiringProducts.length > 1 ? "s" : ""} Expiring Soon`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e11d48;">Product Discounts Expiring Soon</h2>
          <p>The following products have discounts expiring within the next 7 days:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <pre style="white-space: pre-wrap; font-family: monospace; margin: 0;">${productList}</pre>
          </div>
          <p>Please review these products and consider:</p>
          <ul>
            <li>Extending the discount period</li>
            <li>Adjusting the discount percentage</li>
            <li>Removing the discount</li>
          </ul>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            This is an automated notification from AvtoMed Admin Panel.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        message: "Notification sent successfully",
        productsCount: expiringProducts.length,
        emailsSent: adminEmails.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-expiring-products function:", error);
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
