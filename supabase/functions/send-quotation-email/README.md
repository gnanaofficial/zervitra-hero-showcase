# Send Quotation Email Function

This Supabase Edge Function sends quotation emails using **SendGrid API**.

## Setup Instructions

### 1. Get SendGrid API Key

1. Sign up for a free SendGrid account at [https://sendgrid.com](https://sendgrid.com)
2. Navigate to Settings → API Keys
3. Create a new API key with "Mail Send" permissions
4. Copy the API key

### 2. Configure Environment Variables

Set the following environment variables in your Supabase project:

```bash
# Required
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Optional (defaults to noreply@zervitra.com)
FROM_EMAIL=your_verified_sender_email@yourdomain.com
```

**Important:** You must verify your sender email in SendGrid:
- Go to Settings → Sender Authentication
- Verify a single sender email OR authenticate your domain

### 3. Deploy the Function

```bash
supabase functions deploy send-quotation-email
```

## Usage

Call the function from your application:

```typescript
const { data, error } = await supabase.functions.invoke('send-quotation-email', {
  body: {
    to: 'client@example.com',
    clientName: 'John Doe',
    quotationId: 'QT-2024-001',
    amount: '50,000',
    currency: 'USD',
    validUntil: '30 days',
    signatoryName: 'K.Gnana Sekhar',  // Optional
    signatoryRole: 'MANAGER'           // Optional
  }
});
```

## Alternative: Using Mailgun

If you prefer Mailgun over SendGrid, replace the `sendEmailWithSendGrid` function with:

```typescript
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
```

## Troubleshooting

### "SENDGRID_API_KEY is not configured"
- Ensure you've set the environment variable in Supabase
- Redeploy the function after setting environment variables

### "Sender email not verified"
- Verify your sender email in SendGrid settings
- Or authenticate your entire domain

### Email not received
- Check spam/junk folder
- Verify the recipient email is valid
- Check SendGrid activity logs for delivery status

## Features

- ✅ Beautiful HTML email template matching Zervitra branding
- ✅ Responsive design
- ✅ Professional quotation layout
- ✅ CORS support for frontend calls
- ✅ Error handling and logging
- ✅ No npm dependencies (uses native fetch)
