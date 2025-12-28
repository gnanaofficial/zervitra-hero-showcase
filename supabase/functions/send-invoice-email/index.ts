import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface InvoiceEmailRequest {
  to: string;
  clientName: string;
  invoiceId: string;
  amount: string;
  currency: string;
  dueDate: string;
  services?: Array<{ description: string; amount: number }>;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
  };
  pdfBase64?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      clientName,
      invoiceId,
      amount,
      currency,
      dueDate,
      services = [],
      bankDetails,
      pdfBase64
    }: InvoiceEmailRequest = await req.json();

    console.log("Sending invoice email to:", to, "Invoice ID:", invoiceId);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 800px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          
          .header { background-color: #000; color: white; padding: 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #10b981; }
          .logo { font-size: 28px; font-weight: 800; letter-spacing: 1px; }
          .logo span { color: #10b981; }
          .invoice-id { text-align: right; }
          .invoice-id div { margin-bottom: 5px; font-size: 14px; color: #ccc; }
          .invoice-id span { color: white; font-weight: bold; }
          
          .client-strip { background-color: #1a1a1a; color: white; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
          .client-name { font-size: 24px; font-weight: bold; background: #333; padding: 10px 20px; border-radius: 50px; display: inline-block; }
          
          .content { padding: 40px; }
          .big-title { text-align: center; font-size: 48px; font-weight: 900; color: #10b981; margin: 20px 0 40px; text-transform: uppercase; letter-spacing: 2px; }
          
          .services-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .services-table th { background: #f0f0f0; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
          .services-table td { padding: 12px; border-bottom: 1px solid #eee; }
          
          .total-section { background-color: #1a1a1a; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-top: 20px; }
          .total-label { font-size: 20px; font-weight: bold; text-transform: uppercase; }
          .total-amount { font-size: 24px; font-weight: bold; color: #10b981; }
          
          .bank-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px; border: 1px solid #e5e7eb; }
          .bank-details h3 { margin: 0 0 15px 0; color: #374151; }
          .bank-details p { margin: 5px 0; font-size: 14px; }
          .bank-details strong { color: #111827; }
          
          .pay-button { display: inline-block; background-color: #10b981; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 20px; }
          
          .footer { padding: 40px; background-color: #f4f4f4; text-align: center; }
          .footer p { margin: 5px 0; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ZERV<span>I</span>TRA</div>
            <div class="invoice-id">
              <div>INVOICE ID : <span>${invoiceId}</span></div>
              <div>DATE : <span>${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase().replace(/ /g, '/')}</span></div>
            </div>
          </div>
          
          <div class="client-strip">
            <div class="client-name">${clientName}</div>
          </div>
          
          <div class="content">
            <div class="big-title">Invoice</div>
            
            <p>Dear ${clientName},</p>
            <p>Please find your invoice details below. Payment is due by <strong>${dueDate}</strong>.</p>
            
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
            
            ${bankDetails ? `
            <div class="bank-details">
              <h3>Bank Transfer Details</h3>
              <p><strong>Bank:</strong> ${bankDetails.bankName}</p>
              <p><strong>Account Name:</strong> ${bankDetails.accountName}</p>
              <p><strong>Account Number:</strong> ${bankDetails.accountNumber}</p>
              <p><strong>IFSC Code:</strong> ${bankDetails.ifscCode}</p>
              <p><strong>UPI ID:</strong> ${bankDetails.upiId}</p>
            </div>
            ` : ''}
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="https://zervitra.lovable.app/dashboard" class="pay-button">Pay Now via Dashboard</a>
            </p>
            
            <p style="margin-top: 30px; color: #666;">
              If you have any questions regarding this invoice, please don't hesitate to contact us.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Zervitra Technologies</strong></p>
            <p>Email: support@zervitra.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailOptions: any = {
      from: "Zervitra <onboarding@resend.dev>",
      to: [to],
      subject: `Invoice ${invoiceId} from Zervitra - Payment Due ${dueDate}`,
      html: htmlContent,
    };

    // Attach PDF if provided
    if (pdfBase64) {
      emailOptions.attachments = [
        {
          filename: `Invoice-${invoiceId}.pdf`,
          content: pdfBase64,
        }
      ];
    }

    const emailResponse = await resend.emails.send(emailOptions);

    console.log("Invoice email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invoice email sent successfully",
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error sending invoice email:", error);
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
