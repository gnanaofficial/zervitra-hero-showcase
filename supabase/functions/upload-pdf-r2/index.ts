import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.577.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface UploadRequest {
  fileName: string;
  fileType: string;
  fileData: string; // Base64 encoded file data
  folder?: string; // Optional folder path (e.g., "quotations" or "invoices")
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accountId = Deno.env.get("R2_ACCOUNT_ID");
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const bucketName = Deno.env.get("R2_BUCKET_NAME");

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      console.error("Missing R2 credentials");
      throw new Error("R2 configuration is incomplete");
    }

    const { fileName, fileType, fileData, folder = "" }: UploadRequest = await req.json();

    if (!fileName || !fileData) {
      throw new Error("fileName and fileData are required");
    }

    console.log(`Uploading file: ${fileName} to R2 bucket: ${bucketName}`);

    // Initialize S3 client for R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Decode base64 file data
    const binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));

    // Construct the full key (path) for the file
    const key = folder ? `${folder}/${fileName}` : fileName;

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: binaryData,
      ContentType: fileType || "application/pdf",
    });

    await s3Client.send(command);

    // Construct the public URL
    // R2 public URLs follow the pattern: https://{custom-domain}/{key}
    // Or use the R2.dev subdomain: https://pub-{account-hash}.r2.dev/{key}
    // For now, we'll return a constructed URL that the user can configure
    const publicUrl = `https://pub-${accountId}.r2.dev/${key}`;

    console.log(`File uploaded successfully: ${publicUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        key: key,
        message: "File uploaded successfully to R2"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error uploading to R2:", error);
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
