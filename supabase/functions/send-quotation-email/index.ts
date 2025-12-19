import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuotationEmailRequest {
  to: string;
  clientName: string;
  quotationId: string;
  amount: string;
  currency: string;
  validUntil: string;
  pdfBase64?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, clientName, quotationId, amount, currency, validUntil }: QuotationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Zervitra <onboarding@resend.dev>",
      to: [to],
      subject: `Your Quotation from Zervitra - ${quotationId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e1e3f 0%, #5956e9 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
            .amount { font-size: 32px; font-weight: bold; color: #5956e9; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">ZERVITRA</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">ZERO BEGINS. VISION LEADS. RESULTS LAST.</p>
            </div>
            <div class="content">
              <h2>Hello ${clientName},</h2>
              <p>Thank you for your interest in our services. Please find your quotation details below:</p>
              
              <div class="details">
                <p><strong>Quotation ID:</strong> ${quotationId}</p>
                <p><strong>Valid Until:</strong> ${validUntil}</p>
                <div class="amount">${currency} ${amount}</div>
              </div>
              
              <p>If you have any questions or would like to proceed, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br><strong>The Zervitra Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Zervitra. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Quotation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending quotation email:", error);
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
