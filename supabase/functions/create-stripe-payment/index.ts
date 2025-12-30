import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  invoiceId: string;
  amount: number;
  currency?: string;
  customerEmail?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // ======== AUTHENTICATION & AUTHORIZATION ========
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing authorization header' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Verify user with anon key client
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    console.log('Authenticated user:', user.id);

    // Create service role client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const { invoiceId, amount, currency = "USD", customerEmail }: PaymentRequest = await req.json();

    if (!invoiceId || !amount) {
      throw new Error("Invoice ID and amount are required");
    }

    // Fetch invoice details with client info for ownership verification
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(`
        *,
        clients (
          id,
          user_id,
          company_name,
          contact_email
        )
      `)
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      console.error('Invoice not found:', invoiceError);
      throw new Error("Invoice not found");
    }

    // ======== OWNERSHIP VERIFICATION ========
    // Verify the authenticated user owns this invoice
    if (invoice.clients?.user_id !== user.id) {
      console.error('Forbidden: User', user.id, 'does not own invoice', invoiceId);
      return new Response(
        JSON.stringify({ error: 'Forbidden: You do not own this invoice' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    console.log('Ownership verified for invoice:', invoiceId);

    const email = customerEmail || invoice.clients?.contact_email;

    // Create Stripe Checkout Session
    const origin = req.headers.get("origin") || "https://localhost:5173";
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Invoice ${invoice.invoice_id || invoiceId}`,
              description: `Payment for ${invoice.clients?.company_name || "Invoice"}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/client/dashboard?payment=success&invoice=${invoiceId}`,
      cancel_url: `${origin}/client/dashboard?payment=cancelled&invoice=${invoiceId}`,
      customer_email: email,
      metadata: {
        invoiceId: invoiceId,
        invoiceNumber: invoice.invoice_id || "",
        userId: user.id,
      },
    });

    // Update invoice with payment session info
    await supabase
      .from("invoices")
      .update({ 
        payment_id: session.id,
        payment_method: "stripe"
      })
      .eq("id", invoiceId);

    console.log("Stripe session created:", session.id);

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error creating Stripe payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
