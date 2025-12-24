import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface WelcomeEmailRequest {
    email: string;
    password: string;
    companyName: string;
    loginUrl: string;
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { email, password, companyName, loginUrl }: WelcomeEmailRequest = await req.json();

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Email and password are required" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // For now, we'll use Supabase's built-in email system
        // In production, you can integrate with Resend or another email service

        // Email content
        const emailSubject = `Welcome to Zervitra - Your Account Credentials`;
        const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Zervitra</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Zervitra</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello ${companyName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Your account has been created successfully! Below are your login credentials:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${password}</code></p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⚠️ Security Notice:</strong> Please change your password after your first login for security purposes.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                Login to Your Account
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} Zervitra. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

        // If Resend is configured, use it
        if (RESEND_API_KEY) {
            const resendResponse = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: "Zervitra <onboarding@zervitra.com>",
                    to: [email],
                    subject: emailSubject,
                    html: emailHtml,
                }),
            });

            if (!resendResponse.ok) {
                const error = await resendResponse.text();
                throw new Error(`Failed to send email via Resend: ${error}`);
            }

            const data = await resendResponse.json();

            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Welcome email sent successfully",
                    emailId: data.id
                }),
                {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        } else {
            // Log email content for testing (when no email service is configured)
            console.log("Email would be sent to:", email);
            console.log("Subject:", emailSubject);
            console.log("HTML:", emailHtml);

            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Email logged (no email service configured)",
                    note: "Configure RESEND_API_KEY to send actual emails"
                }),
                {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return new Response(
            JSON.stringify({
                error: error.message || "Failed to send welcome email"
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
