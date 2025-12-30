import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  invoiceId: string;
  paymentId: string;
  orderId: string;
  signature: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    if (!razorpayKeySecret) {
      throw new Error("Razorpay secret key not configured");
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

    const { invoiceId, paymentId, orderId, signature }: VerifyRequest = await req.json();

    if (!invoiceId || !paymentId || !orderId || !signature) {
      throw new Error("Missing required payment verification parameters");
    }

    // Fetch invoice details with client info for ownership verification
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(`
        *,
        clients (
          id,
          user_id,
          company_name
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

    // Verify signature
    const body = orderId + "|" + paymentId;
    const encoder = new TextEncoder();
    const key = encoder.encode(razorpayKeySecret);
    const message = encoder.encode(body);
    
    const hmac = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign("HMAC", hmac, message);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== signature) {
      throw new Error("Invalid payment signature");
    }

    // Update invoice status to paid
    const { error: updateError } = await supabase
      .from("invoices")
      .update({ 
        status: "paid",
        payment_id: paymentId,
        payment_method: "razorpay",
        updated_at: new Date().toISOString()
      })
      .eq("id", invoiceId);

    if (updateError) {
      console.error("Failed to update invoice:", updateError);
      throw new Error("Failed to update invoice status");
    }

    console.log("Payment verified and invoice updated:", invoiceId);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Payment verified successfully" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
