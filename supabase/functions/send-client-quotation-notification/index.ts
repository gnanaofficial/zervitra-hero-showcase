import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ClientNotificationRequest {
  clientName: string;
  clientEmail: string;
  quotationId: string;
  amount: string;
  currency: string;
  projectTitle: string;
  action: "accepted" | "rejected";
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
      action
    }: ClientNotificationRequest = await req.json();

    console.log(`Sending ${action} confirmation to client ${clientEmail} for quotation ${quotationId}`);

    const isAccepted = action === "accepted";

    const htmlContent = isAccepted ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background-color: #000; color: white; padding: 30px; text-align: center; border-bottom: 3px solid #22c55e; }
          .logo { font-size: 24px; font-weight: 800; letter-spacing: 1px; }
          .logo span { color: #4f46e5; }
          .success-icon { font-size: 48px; margin: 20px 0; }
          .content { padding: 30px; }
          .info-box { background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .next-steps { background: #f8f8f8; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .next-steps h3 { color: #333; margin-top: 0; }
          .next-steps ul { padding-left: 20px; margin: 10px 0; }
          .next-steps li { margin: 8px 0; color: #666; }
          .cta-button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 15px; }
          .footer { padding: 20px; background: #f4f4f4; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ZERV<span>I</span>TRA</div>
            <div class="success-icon">✅</div>
            <h2 style="margin: 0;">Quotation Accepted!</h2>
          </div>
          
          <div class="content">
            <p>Dear ${clientName},</p>
            <p>Thank you for accepting our quotation! We're excited to work with you on this project.</p>
            
            <div class="info-box">
              <h3 style="margin: 0 0 15px; color: #22c55e;">Quotation Details</h3>
              <p><strong>Quotation ID:</strong> ${quotationId}</p>
              <p><strong>Project:</strong> ${projectTitle}</p>
              <p><strong>Total Amount:</strong> ${currency} ${amount}</p>
            </div>
            
            <div class="next-steps">
              <h3>📋 What Happens Next?</h3>
              <ul>
                <li><strong>Invoice Generation:</strong> An advance payment invoice will be generated and sent to you shortly.</li>
                <li><strong>Payment:</strong> Once you receive the invoice, you can make the payment through our secure payment portal.</li>
                <li><strong>Project Kickoff:</strong> After payment confirmation, our team will reach out to schedule the project kickoff meeting.</li>
                <li><strong>Regular Updates:</strong> You'll receive regular progress updates through your client dashboard.</li>
              </ul>
            </div>
            
            <p style="margin-top: 20px;">If you have any questions, feel free to reply to this email or contact our support team.</p>
            
            <a href="https://zervitra.com/client/dashboard" class="cta-button">View Dashboard</a>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from Zervitra.</p>
            <p>© ${new Date().getFullYear()} Zervitra. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background-color: #000; color: white; padding: 30px; text-align: center; border-bottom: 3px solid #666; }
          .logo { font-size: 24px; font-weight: 800; letter-spacing: 1px; }
          .logo span { color: #4f46e5; }
          .content { padding: 30px; }
          .footer { padding: 20px; background: #f4f4f4; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ZERV<span>I</span>TRA</div>
            <h2 style="margin: 20px 0 0;">Quotation Response Received</h2>
          </div>
          
          <div class="content">
            <p>Dear ${clientName},</p>
            <p>We've received your response regarding quotation <strong>${quotationId}</strong> for <strong>${projectTitle}</strong>.</p>
            <p>We understand that this quotation may not have met your current requirements. If you'd like to discuss alternative options or have any feedback, please don't hesitate to reach out.</p>
            <p>We value your interest and hope to work with you in the future.</p>
            <p>Best regards,<br>The Zervitra Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from Zervitra.</p>
            <p>© ${new Date().getFullYear()} Zervitra. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const subject = isAccepted 
      ? `✅ Quotation Accepted - Next Steps for ${projectTitle}`
      : `Quotation Response Received - ${quotationId}`;

    const emailResponse = await resend.emails.send({
      from: "Zervitra <onboarding@resend.dev>",
      to: [clientEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Client notification sent:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Client ${action} notification sent successfully`,
        emailId: emailResponse.data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error sending client notification:", error);
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
