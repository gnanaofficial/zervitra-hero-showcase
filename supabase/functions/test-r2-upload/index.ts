import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.577.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accountId = Deno.env.get("R2_ACCOUNT_ID");
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const bucketName = Deno.env.get("R2_BUCKET_NAME");

    console.log("R2 Config Check:", {
      hasAccountId: !!accountId,
      hasAccessKeyId: !!accessKeyId,
      hasSecretAccessKey: !!secretAccessKey,
      hasBucketName: !!bucketName,
      bucketName: bucketName
    });

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "R2 configuration is incomplete",
          config: {
            hasAccountId: !!accountId,
            hasAccessKeyId: !!accessKeyId,
            hasSecretAccessKey: !!secretAccessKey,
            hasBucketName: !!bucketName
          }
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create a simple test PDF content (minimal valid PDF)
    const testContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT /F1 24 Tf 100 700 Td (Test PDF from R2) Tj ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
306
%%EOF`;

    const fileName = `test/sample-quotation-${Date.now()}.pdf`;
    
    console.log(`Testing R2 upload with file: ${fileName}`);

    // Initialize S3 client for R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Convert string to Uint8Array
    const encoder = new TextEncoder();
    const binaryData = encoder.encode(testContent);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: binaryData,
      ContentType: "application/pdf",
    });

    await s3Client.send(command);

    // Construct the public URL
    const publicUrl = `https://pub-${accountId}.r2.dev/${fileName}`;

    console.log(`Test file uploaded successfully: ${publicUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "R2 test upload successful!",
        url: publicUrl,
        fileName: fileName,
        uploadedAt: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error testing R2 upload:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage, 
        stack: errorStack,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
