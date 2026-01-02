import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.577.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Uploads a tiny sample PDF to your Cloudflare R2 bucket so you can confirm
 * the bucket + credentials + public URL are working.
 *
 * Key: Quotations/sample-quotation.pdf
 */
const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accountId = Deno.env.get("R2_ACCOUNT_ID");
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const bucketName = Deno.env.get("R2_BUCKET_NAME");
    const publicUrl = Deno.env.get("R2_PUBLIC_URL");

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error(
        "R2 configuration is incomplete. Please ensure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME are set."
      );
    }

    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    const s3Client = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });

    // A minimal valid PDF (1 page) as bytes.
    const pdfText = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 78 >>\nstream\nBT\n/F1 24 Tf\n72 720 Td\n(Sample Quotation PDF - Zervitra) Tj\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000241 00000 n \n0000000370 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n440\n%%EOF\n`;

    const pdfBytes = new TextEncoder().encode(pdfText);

    const key = "Quotations/sample-quotation.pdf";

    console.log("Seeding sample PDF to R2", { bucket: bucketName, key });

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: pdfBytes,
        ContentType: "application/pdf",
      })
    );

    const baseUrl = (publicUrl || "").replace(/\/$/, "");
    const url = baseUrl
      ? `${baseUrl}/${key}`
      : `https://${bucketName}.${accountId}.r2.dev/${key}`;

    return new Response(
      JSON.stringify({ success: true, key, url }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("seed-sample-pdf-r2 error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
