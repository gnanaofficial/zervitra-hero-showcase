import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface QuotationEmailRequest {
  to: string;
  clientName: string;
  quotationId: string;
  amount: string;
  currency: string;
  validUntil: string;
  signatoryName?: string;
  signatoryRole?: string;
  services?: Array<{ description: string; amount: number }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      clientName,
      quotationId,
      amount,
      currency,
      validUntil,
      signatoryName = "K.Gnana Sekhar",
      signatoryRole = "MANAGER",
      services = []
    }: QuotationEmailRequest = await req.json();

    console.log("Sending quotation email to:", to);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 800px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          
          .header { background-color: #000; color: white; padding: 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #4f46e5; }
          .logo { font-size: 28px; font-weight: 800; letter-spacing: 1px; }
          .logo span { color: #4f46e5; }
          .quote-id { text-align: right; }
          .quote-id div { margin-bottom: 5px; font-size: 14px; color: #ccc; }
          .quote-id span { color: white; font-weight: bold; }
          
          .client-strip { background-color: #1a1a1a; color: white; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
          .client-name { font-size: 24px; font-weight: bold; background: #333; padding: 10px 20px; border-radius: 50px; display: inline-block; }
          
          .content { padding: 40px; }
          .big-title { text-align: center; font-size: 48px; font-weight: 900; color: #4f46e5; margin: 20px 0 40px; text-transform: uppercase; letter-spacing: 2px; }
          
          .services-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .services-table th { background: #f0f0f0; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
          .services-table td { padding: 12px; border-bottom: 1px solid #eee; }
          .services-table tr:last-child td { border-bottom: none; }
          
          .total-section { background-color: #1a1a1a; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-top: 20px; }
          .total-label { font-size: 20px; font-weight: bold; text-transform: uppercase; }
          .total-amount { font-size: 24px; font-weight: bold; color: #4f46e5; }
          
          .footer { padding: 40px; background-color: #f4f4f4; display: flex; justify-content: space-between; }
          .terms { width: 60%; font-size: 12px; color: #666; }
          .signature { text-align: center; width: 30%; }
          .sig-name { font-size: 18px; font-weight: bold; margin-top: 10px; color: #000; }
          .sig-role { background-color: #444; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; margin-top: 5px; }
          
          @media only screen and (max-width: 600px) {
            .header { flex-direction: column; text-align: center; }
            .quote-id { text-align: center; margin-top: 20px; }
            .footer { flex-direction: column; }
            .terms, .signature { width: 100%; margin-bottom: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ZERV<span>I</span>TRA</div>
            <div class="quote-id">
              <div>QUOTATION ID : <span>${quotationId}</span></div>
              <div>DATE : <span>${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase().replace(/ /g, '/')}</span></div>
            </div>
          </div>
          
          <div class="client-strip">
            <div class="client-name">${clientName}</div>
          </div>
          
          <div class="content">
            <div class="big-title">Quotation</div>
            
            <p>Dear ${clientName},</p>
            <p>Thank you for your interest in our services. Please find your quotation details below:</p>
            
            ${services.length > 0 ? `
            <table class="services-table">
              <thead>
                <tr>
                  <th>Service Description</th>
                  <th style="text-align: right;">Amount (${currency})</th>
                </tr>
              </thead>
              <tbody>
                ${services.map(s => `
                  <tr>
                    <td>${s.description}</td>
                    <td style="text-align: right;">${s.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            ` : ''}
            
            <div class="total-section">
              <div class="total-label">Total Payable</div>
              <div class="total-amount">${currency} ${amount}</div>
            </div>
            
            <p style="margin-top: 30px; color: #666;">
              If you have any questions regarding this quotation, please don't hesitate to contact us.
            </p>
          </div>
          
          <div class="footer">
            <div class="terms">
              <strong>TERMS & CONDITIONS</strong><br>
              This quotation is valid for ${validUntil}.<br>
              Subject to revision thereafter.<br><br>
              <strong>Payment Terms:</strong> 50% advance, 50% on delivery.
            </div>
            <div class="signature">
              <div class="sig-name">${signatoryName}</div>
              <div class="sig-role">${signatoryRole}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Zervitra <onboarding@resend.dev>",
      to: [to],
      subject: `Quotation ${quotationId} from Zervitra`,
      html: htmlContent,
    });

    console.log("Quotation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Quotation email sent successfully",
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error sending quotation email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
