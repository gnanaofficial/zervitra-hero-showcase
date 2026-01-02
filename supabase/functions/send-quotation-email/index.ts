import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
    const { to, clientName, quotationId, pdfUrl }: QuotationEmailRequest =
      await req.json();

    console.log("Sending quotation email to:", to);
    console.log("PDF URL:", pdfUrl);

    if (!pdfUrl) {
      throw new Error("PDF URL is required to send quotation email");
    }

    const today = new Date();
    const formattedDate = today
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase()
      .replace(/ /g, " ");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f5f5f5; }
          .wrapper { max-width: 640px; margin: 0 auto; padding: 20px; }
          .container { background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
          .header { background: #0f0f0f; color: white; padding: 28px 30px; text-align: left; }
          .logo { font-size: 22px; font-weight: 800; letter-spacing: 2px; }
          .logo span { color: #6366f1; }
          .content { padding: 32px 30px; }
          .title { font-size: 18px; margin: 0 0 12px; }
          .text { font-size: 14px; color: #4b5563; margin: 0 0 18px; }
          .card { background: #fafafa; border: 1px solid #eee; border-radius: 10px; padding: 16px; margin: 18px 0; }
          .row { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; font-size: 13px; color: #111827; }
          .row strong { color: #111827; }
          .cta { display: inline-block; background: #111827; color: #ffffff !important; text-decoration: none; padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: 14px; }
          .muted { font-size: 12px; color: #6b7280; margin-top: 14px; }
          .footer { background: #fafafa; padding: 18px 30px; font-size: 12px; color: #6b7280; border-top: 1px solid #eee; }
          .footer a { color: #6366f1; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="logo">ZERV<span>I</span>TRA</div>
            </div>

            <div class="content">
              <h2 class="title">Your quotation is ready</h2>
              <p class="text">
                Dear ${clientName},<br />
                Please review the quotation below and download the PDF using the button.
              </p>

              <div class="card">
                <div class="row"><span>Quotation ID</span><strong>${quotationId}</strong></div>
                <div class="row"><span>Date</span><strong>${formattedDate}</strong></div>
              </div>

              <p style="margin: 22px 0 10px;">
                <a class="cta" href="${pdfUrl}" target="_blank" rel="noreferrer">Download Quotation PDF</a>
              </p>
              <p class="muted">
                If the button doesn't work, copy and paste this link into your browser:<br />
                <span>${pdfUrl}</span>
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0;">
                <strong>Zervitra</strong> • Digital Solutions & Development<br />
                <a href="https://zervitra.com">www.zervitra.com</a>
              </p>
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
        emailId: emailResponse.data?.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error sending quotation email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
