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
  pdfUrl?: string;
  amountINR?: string;
  advancePercentage?: number;
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
      services = [],
      pdfUrl,
      amountINR,
      advancePercentage = 50
    }: QuotationEmailRequest = await req.json();

    console.log("Sending quotation email to:", to);
    console.log("PDF URL:", pdfUrl);
    console.log("Services:", services.length);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).toUpperCase().replace(/ /g, ' ');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
          }
          .wrapper {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
          }
          .container { 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          
          .header { 
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: white; 
            padding: 32px 40px;
          }
          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .logo { 
            font-size: 32px; 
            font-weight: 800; 
            letter-spacing: 2px;
          }
          .logo span { color: #6366f1; }
          
          .quote-badge {
            background: rgba(99, 102, 241, 0.15);
            border: 1px solid rgba(99, 102, 241, 0.3);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            letter-spacing: 1px;
          }
          
          .client-section {
            background: #fafafa;
            padding: 24px 40px;
            border-bottom: 1px solid #eee;
          }
          .client-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #888;
            margin-bottom: 4px;
          }
          .client-name {
            font-size: 22px;
            font-weight: 700;
            color: #1a1a1a;
          }
          
          .content { 
            padding: 40px; 
          }
          
          .intro-text {
            font-size: 15px;
            color: #555;
            margin-bottom: 32px;
            line-height: 1.7;
          }
          
          .services-section {
            background: #fafafa;
            border-radius: 10px;
            padding: 24px;
            margin-bottom: 24px;
          }
          .services-title {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #888;
            margin-bottom: 16px;
            font-weight: 600;
          }
          .service-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }
          .service-row:last-child {
            border-bottom: none;
          }
          .service-name {
            font-weight: 500;
            color: #333;
          }
          .service-amount {
            font-weight: 600;
            color: #1a1a1a;
          }
          
          .total-box {
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: white;
            padding: 24px 32px;
            border-radius: 10px;
            margin: 24px 0;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .total-label {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #aaa;
          }
          .total-amount {
            font-size: 28px;
            font-weight: 800;
            color: #6366f1;
          }
          ${amountINR ? `
          .total-inr {
            font-size: 14px;
            color: #888;
            margin-top: 4px;
          }
          ` : ''}
          
          .cta-section {
            text-align: center;
            padding: 32px 0;
          }
          .download-btn {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white !important;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15px;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
            transition: all 0.3s ease;
          }
          .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin: 32px 0;
            padding: 24px;
            background: #f9fafb;
            border-radius: 10px;
          }
          .info-item {
            padding: 12px;
          }
          .info-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            margin-bottom: 4px;
          }
          .info-value {
            font-size: 15px;
            font-weight: 600;
            color: #1a1a1a;
          }
          
          .footer {
            background: #fafafa;
            padding: 32px 40px;
            border-top: 1px solid #eee;
          }
          .footer-grid {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .terms {
            width: 60%;
            font-size: 12px;
            color: #666;
            line-height: 1.7;
          }
          .terms strong {
            color: #333;
            display: block;
            margin-bottom: 8px;
          }
          .signature {
            text-align: right;
          }
          .sig-name {
            font-size: 16px;
            font-weight: 700;
            color: #1a1a1a;
          }
          .sig-role {
            background: #333;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            display: inline-block;
            margin-top: 6px;
            letter-spacing: 0.5px;
          }
          
          .company-footer {
            text-align: center;
            padding: 24px;
            font-size: 12px;
            color: #999;
          }
          .company-footer a {
            color: #6366f1;
            text-decoration: none;
          }
          
          @media only screen and (max-width: 600px) {
            .wrapper { padding: 10px; }
            .header, .content, .footer { padding: 24px; }
            .info-grid { grid-template-columns: 1fr; }
            .footer-grid { flex-direction: column; }
            .terms, .signature { width: 100%; text-align: left; margin-bottom: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="header-top">
                <div class="logo">ZERV<span>I</span>TRA</div>
                <div class="quote-badge">QUOTATION</div>
              </div>
              <table style="width: 100%; color: #aaa; font-size: 13px;">
                <tr>
                  <td>Quotation ID: <strong style="color: white;">${quotationId}</strong></td>
                  <td style="text-align: right;">Date: <strong style="color: white;">${formattedDate}</strong></td>
                </tr>
              </table>
            </div>
            
            <div class="client-section">
              <div class="client-label">Prepared For</div>
              <div class="client-name">${clientName}</div>
            </div>
            
            <div class="content">
              <p class="intro-text">
                Thank you for your interest in Zervitra's services. We're excited to present this quotation tailored specifically for your requirements. Please review the details below.
              </p>
              
              ${services.length > 0 ? `
              <div class="services-section">
                <div class="services-title">Services Breakdown</div>
                ${services.map(s => `
                  <div class="service-row">
                    <span class="service-name">${s.description}</span>
                    <span class="service-amount">${currency} ${s.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                `).join('')}
              </div>
              ` : ''}
              
              <div class="total-box">
                <div class="total-row">
                  <div>
                    <div class="total-label">Total Investment</div>
                  </div>
                  <div style="text-align: right;">
                    <div class="total-amount">${currency} ${amount}</div>
                    ${amountINR ? `<div class="total-inr">≈ ₹${amountINR}</div>` : ''}
                  </div>
                </div>
              </div>
              
              ${pdfUrl ? `
              <div class="cta-section">
                <a href="${pdfUrl}" class="download-btn" target="_blank">
                  📄 Download Full Quotation PDF
                </a>
                <p style="margin-top: 12px; font-size: 12px; color: #888;">
                  Click above to download the complete quotation document
                </p>
              </div>
              ` : ''}
              
              <table class="info-grid" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td class="info-item" style="padding: 12px; background: #f9fafb;">
                    <div class="info-label" style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px;">Valid Until</div>
                    <div class="info-value" style="font-size: 15px; font-weight: 600; color: #1a1a1a;">${validUntil}</div>
                  </td>
                  <td class="info-item" style="padding: 12px; background: #f9fafb;">
                    <div class="info-label" style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px;">Advance Payment</div>
                    <div class="info-value" style="font-size: 15px; font-weight: 600; color: #1a1a1a;">${advancePercentage}% on confirmation</div>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666; font-size: 14px; line-height: 1.7; margin-top: 24px;">
                If you have any questions regarding this quotation or would like to discuss your project in more detail, please don't hesitate to reach out. We're here to help bring your vision to life.
              </p>
            </div>
            
            <div class="footer">
              <table style="width: 100%;">
                <tr>
                  <td style="width: 60%; vertical-align: top; padding-right: 20px;">
                    <div class="terms">
                      <strong>Terms & Conditions</strong>
                      • This quotation is valid until ${validUntil}<br>
                      • ${advancePercentage}% advance payment required to begin work<br>
                      • Remaining balance due upon project completion<br>
                      • Prices subject to revision after validity period
                    </div>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <div class="signature">
                      <div class="sig-name">${signatoryName}</div>
                      <div class="sig-role">${signatoryRole}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          
          <div class="company-footer">
            <p>
              <strong>Zervitra</strong> • Digital Solutions & Development<br>
              <a href="https://zervitra.com">www.zervitra.com</a>
            </p>
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
