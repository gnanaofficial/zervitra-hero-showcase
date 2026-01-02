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

    // Fetch the PDF file
    console.log("Fetching PDF for attachment...");
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF from URL: ${pdfUrl}`);
    }
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    const today = new Date();
    const formattedDate = today
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase()
      .replace(/ /g, " ");

    // Simplified HTML Template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f5f5f5; }
          .wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .header { background: #0f0f0f; color: white; padding: 30px; text-align: center; }
          .logo { font-size: 24px; font-weight: 800; letter-spacing: 2px; }
          .logo span { color: #6366f1; }
          .content { padding: 40px; text-align: center; }
          .text { font-size: 16px; color: #555; margin-bottom: 30px; }
          .footer { background: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
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
              <h2 style="margin-bottom: 20px;">Quotation Included</h2>
              <p class="text">
                Dear ${clientName},<br><br>
                Please find the attached quotation (ID: <strong>${quotationId}</strong>) dated ${formattedDate}.<br><br>
                If you have any questions, feel free to reply to this email.
              </p>
            </div>
            
            <div class="footer">
              <p>
                <strong>Zervitra</strong> • Digital Solutions & Development<br>
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
      attachments: [
        {
          filename: `Quotation_${quotationId}.pdf`,
          content: pdfBuffer,
        },
      ],
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
