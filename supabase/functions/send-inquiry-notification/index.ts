import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface InquiryData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  serviceInterest: string;
  projectDescription: string;
  budget: string;
  timeline: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inquiry }: { inquiry: InquiryData } = await req.json();

    if (!inquiry) {
      return new Response(
        JSON.stringify({ error: "Inquiry data is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailSubject = `New Client Inquiry - ${inquiry.companyName}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Client Inquiry</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📋 New Client Inquiry</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Company Information</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 40%;">Company Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.companyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Contact Person:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.contactName || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Location:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.city ? inquiry.city + ', ' : ''}${inquiry.country || 'Not provided'}</td>
              </tr>
            </table>

            <h2 style="color: #333;">Project Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 40%;">Service Interest:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.serviceInterest}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Budget Range:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.budget || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Timeline:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiry.timeline || 'Not specified'}</td>
              </tr>
            </table>

            ${inquiry.projectDescription ? `
              <h2 style="color: #333;">Project Description</h2>
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 0; white-space: pre-wrap;">${inquiry.projectDescription}</p>
              </div>
            ` : ''}

            <div style="margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-weight: bold; color: #2e7d32;">Action Required</p>
              <p style="margin: 10px 0 0 0; color: #388e3c;">Please contact this prospect within 24-48 hours.</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
              This is an automated notification from Zervitra Client Inquiry System.<br>
              © ${new Date().getFullYear()} Zervitra. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    if (RESEND_API_KEY) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Zervitra <notifications@zervitra.com>",
          to: ["sales@zervitra.com", "admin@zervitra.com"],
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.text();
        console.error("Failed to send notification email:", error);
      } else {
        console.log("Notification email sent successfully");
      }
    } else {
      console.log("Email would be sent (RESEND_API_KEY not configured)");
      console.log("Subject:", emailSubject);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification sent"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error sending notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to send notification";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
