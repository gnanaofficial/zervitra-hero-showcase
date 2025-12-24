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
    signatoryName?: string;
    signatoryRole?: string;
}

// Function to send email using Mailgun API
async function sendEmailWithMailgun(
    to: string,
    subject: string,
    htmlContent: string
) {
    const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
    const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@zervitra.com";

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
        throw new Error("MAILGUN_API_KEY and MAILGUN_DOMAIN are required");
    }

    const formData = new FormData();
    formData.append("from", `Zervitra <${FROM_EMAIL}>`);
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("html", htmlContent);

    const response = await fetch(
        `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
        {
            method: "POST",
            headers: {
                "Authorization": `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mailgun API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return {
        success: true,
        messageId: result.id,
    };
}

Deno.serve(async (req) => {
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
            signatoryRole = "MANAGER"
        }: QuotationEmailRequest = await req.json();

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 800px; margin: 20px auto; background: white; border-radius: 0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          
          /* Header mimicking the dark theme design */
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
          
          .table-container { margin-bottom: 40px; }
          table { width: 100%; border-collapse: collapse; }
          th { background-color: #333; color: white; padding: 15px; text-align: left; text-transform: uppercase; font-size: 14px; }
          td { padding: 15px; border-bottom: 1px solid #eee; font-weight: 600; color: #444; }
          td.price { text-align: right; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          
          .total-section { background-color: #1a1a1a; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-top: 20px; }
          .total-label { font-size: 20px; font-weight: bold; text-transform: uppercase; }
          .total-amount { font-size: 24px; font-weight: bold; color: #4f46e5; }
          
          .footer { padding: 40px; background-color: #f4f4f4; display: flex; justify-content: space-between; }
          .terms { width: 60%; font-size: 12px; color: #666; }
          .signature { text-align: center; width: 30%; }
          .sig-name { font-size: 18px; font-weight: bold; margin-top: 10px; color: #000; }
          .sig-role { background-color: #444; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; margin-top: 5px; }
          
          .btn { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ZERVITRA</div>
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
            <p>Please find the quotation summary below. To view the full detailed quotation, please click the button.</p>
            
            <div class="total-section">
              <div class="total-label">Total Payable</div>
              <div class="total-amount">${currency} ${amount}</div>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
              <a href="#" class="btn">View Full Quotation</a>
            </div>
          </div>
          
          <div class="footer">
            <div class="terms">
              <strong>TERMS & CONDITIONS</strong><br>
              Valid for ${validUntil}.<br>
              Subject to revision thereafter.
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

        const emailResponse = await sendEmailWithMailgun(
            to,
            `Quotation ${quotationId} from Zervitra`,
            htmlContent
        );

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
});
