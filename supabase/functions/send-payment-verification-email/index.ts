import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  invoiceId: string;
  utrNumber: string;
  paymentMode: string;
  amount: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { invoiceId, utrNumber, paymentMode, amount }: VerificationRequest = await req.json();

    console.log("Processing payment verification notification for invoice:", invoiceId);

    // Fetch invoice and client details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(`
        *,
        clients (
          company_name,
          contact_email,
          client_id
        )
      `)
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      console.error("Invoice not found:", invoiceError);
      throw new Error("Invoice not found");
    }

    const clientName = invoice.clients?.company_name || "Client";
    const clientEmail = invoice.clients?.contact_email || "";
    const invoiceNumber = invoice.invoice_id || invoiceId;

    // Send notification email to admin
    const adminEmail = "gnanasekharofficial@gmail.com"; // Admin email

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .label { color: #6b7280; }
          .value { font-weight: 600; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .badge { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Payment Verification Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New payment verification submitted</p>
          </div>
          <div class="content">
            <p>A new payment verification has been submitted and requires your review.</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Invoice Number</span>
                <span class="value">${invoiceNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">Client</span>
                <span class="value">${clientName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Client Email</span>
                <span class="value">${clientEmail}</span>
              </div>
              <div class="detail-row">
                <span class="label">Amount</span>
                <span class="value">₹${amount.toLocaleString('en-IN')}</span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Mode</span>
                <span class="value">${paymentMode.toUpperCase().replace('_', ' ')}</span>
              </div>
              <div class="detail-row">
                <span class="label">UTR/Reference</span>
                <span class="value">${utrNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status</span>
                <span class="badge">PENDING VERIFICATION</span>
              </div>
            </div>
            
            <p>Please log in to the admin dashboard to review and verify this payment.</p>
          </div>
          <div class="footer">
            <p>This is an automated notification from Zervitra.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Zervitra <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `Payment Verification: ${invoiceNumber} - ${clientName}`,
      html: emailHtml,
    });

    console.log("Admin notification email sent:", emailResponse);

    // Also send confirmation to client
    if (clientEmail) {
      const clientEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Payment Verification Received</h1>
            </div>
            <div class="content">
              <p>Dear ${clientName},</p>
              <p>We have received your payment verification for Invoice <strong>${invoiceNumber}</strong>.</p>
              <p><strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
              <p><strong>Reference:</strong> ${utrNumber}</p>
              <p>Our team will verify your payment shortly and update the invoice status. You will receive a confirmation once the payment is verified.</p>
              <p>Thank you for your payment!</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>Team Zervitra</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await resend.emails.send({
        from: "Zervitra <onboarding@resend.dev>",
        to: [clientEmail],
        subject: `Payment Verification Received - ${invoiceNumber}`,
        html: clientEmailHtml,
      });

      console.log("Client confirmation email sent to:", clientEmail);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
