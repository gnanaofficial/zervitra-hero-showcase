import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface AcceptanceEmailRequest {
  clientName: string;
  clientEmail: string;
  quotationId: string;
  amount: string;
  currency: string;
  projectTitle: string;
  signatureName: string;
  signatureType: "drawn" | "typed";
  acceptedAt: string;
  action: "accepted" | "rejected";
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      clientName,
      clientEmail,
      quotationId,
      amount,
      currency,
      projectTitle,
      signatureName,
      signatureType,
      acceptedAt,
      action,
      rejectionReason
    }: AcceptanceEmailRequest = await req.json();

    console.log(`Sending ${action} notification for quotation ${quotationId}`);

    const adminEmail = "admin@zervitra.com"; // Configure this or fetch from DB

    const isAccepted = action === "accepted";
    const actionColor = isAccepted ? "#22c55e" : "#ef4444";
    const actionLabel = isAccepted ? "ACCEPTED" : "REJECTED";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background-color: #000; color: white; padding: 30px; text-align: center; border-bottom: 3px solid ${actionColor}; }
          .logo { font-size: 24px; font-weight: 800; letter-spacing: 1px; }
          .logo span { color: #4f46e5; }
          .status-badge { display: inline-block; background: ${actionColor}; color: white; padding: 8px 20px; border-radius: 50px; font-weight: bold; font-size: 14px; margin-top: 15px; }
          .content { padding: 30px; }
          .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
          .info-label { color: #666; font-size: 14px; }
          .info-value { font-weight: bold; color: #333; }
          .signature-section { background: #f8f8f8; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center; }
          .signature-label { font-size: 12px; color: #666; margin-bottom: 10px; }
          .signature-name { font-size: 24px; font-family: 'Brush Script MT', cursive; color: #333; }
          .footer { padding: 20px; background: #f4f4f4; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ZERV<span>I</span>TRA</div>
            <div class="status-badge">QUOTATION ${actionLabel}</div>
          </div>
          
          <div class="content">
            <h2 style="margin: 0 0 20px; color: #333;">Quotation ${actionLabel}</h2>
            <p>A quotation has been ${action} by the client.</p>
            
            <div style="margin-top: 20px;">
              <div class="info-row">
                <span class="info-label">Quotation ID</span>
                <span class="info-value">${quotationId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Client Name</span>
                <span class="info-value">${clientName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Client Email</span>
                <span class="info-value">${clientEmail}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Project</span>
                <span class="info-value">${projectTitle}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Amount</span>
                <span class="info-value">${currency} ${amount}</span>
              </div>
              <div class="info-row">
                <span class="info-label">${isAccepted ? 'Accepted' : 'Rejected'} At</span>
                <span class="info-value">${acceptedAt}</span>
              </div>
            </div>
            
            ${isAccepted ? `
            <div class="signature-section">
              <div class="signature-label">Digital Signature (${signatureType})</div>
              <div class="signature-name">${signatureName}</div>
            </div>
            ` : rejectionReason ? `
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <strong style="color: #dc2626;">Rejection Reason:</strong>
              <p style="margin: 10px 0 0; color: #666;">${rejectionReason}</p>
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>This is an automated notification from Zervitra Client Portal.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Zervitra <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `Quotation ${quotationId} ${actionLabel} by ${clientName}`,
      html: htmlContent,
    });

    console.log("Acceptance notification sent:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: `${action} notification sent successfully`,
        emailId: emailResponse.data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error sending acceptance email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
