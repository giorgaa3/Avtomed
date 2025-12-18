import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactFormRequest = await req.json();

    // Validate input with strict rules
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must be less than 100 characters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Email must be less than 255 characters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message must be less than 2000 characters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize inputs - strip HTML tags and encode special characters
    const stripHtml = (str: string) => str.replace(/<[^>]*>/g, '');
    const encodeHtml = (str: string) => 
      str.replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;');

    const sanitizedName = encodeHtml(stripHtml(name.trim())).substring(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().substring(0, 255);
    const sanitizedMessage = encodeHtml(stripHtml(message.trim())).substring(0, 2000);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to database
    const { data: savedMessage, error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save message");
    }

    console.log("Message saved to database:", savedMessage.id);

    // Send email notification to admin
    try {
      const emailResponse = await resend.emails.send({
        from: "Avtomedi Contact Form <onboarding@resend.dev>",
        to: ["avtandilzviadadze@yahho.com"],
        subject: `New Contact Form Message from ${sanitizedName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${sanitizedName}</p>
              <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
              <p><strong>Message:</strong></p>
              <p style="background-color: white; padding: 15px; border-left: 3px solid #0066cc; white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
            <p style="color: #666; font-size: 12px;">This message was submitted via the Avtomedi contact form at ${new Date().toLocaleString()}.</p>
          </div>
        `,
      });

      console.log("Email sent successfully:", emailResponse);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the request if email fails, message is already saved
    }

    // Send auto-reply to user
    try {
      await resend.emails.send({
        from: "Avtomedi <onboarding@resend.dev>",
        to: [sanitizedEmail],
        subject: "We received your message - Avtomedi",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0066cc;">Thank you for contacting Avtomedi!</h2>
            <p>Dear ${sanitizedName},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Your message:</strong></p>
              <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
            <p>Best regards,<br>
            <strong>Avtomedi Team</strong><br>
            Phone: <a href="tel:+995555121706">+995555121706</a><br>
            Email: <a href="mailto:avtandilzviadadze@yahho.com">avtandilzviadadze@yahho.com</a></p>
          </div>
        `,
      });
      console.log("Auto-reply sent to user");
    } catch (replyError) {
      console.error("Auto-reply error:", replyError);
      // Don't fail if auto-reply fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Message sent successfully",
        id: savedMessage.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in contact-form-submission function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
