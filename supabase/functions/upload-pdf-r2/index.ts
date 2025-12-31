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
  clientId?: string; // Optional client ID for organization
}

const handler = async (req: Request): Promise<Response> => {
  console.log("upload-pdf-r2 function invoked");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accountId = Deno.env.get("R2_ACCOUNT_ID");
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const bucketName = Deno.env.get("R2_BUCKET_NAME");
    const publicUrl = Deno.env.get("R2_PUBLIC_URL");

    console.log("R2 Config check - accountId:", !!accountId, "accessKeyId:", !!accessKeyId, "secretAccessKey:", !!secretAccessKey, "bucketName:", bucketName, "publicUrl:", publicUrl);

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      console.error("Missing R2 credentials - accountId:", !!accountId, "accessKeyId:", !!accessKeyId, "secretAccessKey:", !!secretAccessKey, "bucketName:", !!bucketName);
      throw new Error("R2 configuration is incomplete. Please ensure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME are set.");
    }

    const body = await req.json();
    const { fileName, fileType, fileData, folder = "", clientId = "" }: UploadRequest = body;

    console.log("Upload request - fileName:", fileName, "fileType:", fileType, "folder:", folder, "clientId:", clientId, "fileData length:", fileData?.length || 0);

    if (!fileName || !fileData) {
      throw new Error("fileName and fileData are required");
    }

    // Initialize S3 client for R2
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    console.log("R2 endpoint:", endpoint);

    const s3Client = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Decode base64 file data
    let binaryData: Uint8Array;
    try {
      binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
      console.log("Decoded binary data size:", binaryData.length, "bytes");
    } catch (decodeError) {
      console.error("Base64 decode error:", decodeError);
      throw new Error("Invalid base64 file data");
    }

    // Construct the full key (path) for the file
    // Structure: folder/clientId/fileName or folder/fileName or just fileName
    let key = fileName;
    if (clientId && folder) {
      key = `${folder}/${clientId}/${fileName}`;
    } else if (folder) {
      key = `${folder}/${fileName}`;
    }

    console.log("Uploading to R2 - bucket:", bucketName, "key:", key);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: binaryData,
      ContentType: fileType || "application/pdf",
    });

    await s3Client.send(command);
    console.log("Upload successful!");

    // Construct the public URL
    // Use the custom public URL if provided, otherwise construct a default
    let fileUrl: string;
    if (publicUrl) {
      // Remove trailing slash if present
      const baseUrl = publicUrl.replace(/\/$/, '');
      fileUrl = `${baseUrl}/${key}`;
    } else {
      // Fallback to R2.dev subdomain (may not work without public access enabled)
      fileUrl = `https://${bucketName}.${accountId}.r2.dev/${key}`;
    }

    console.log("File uploaded successfully. URL:", fileUrl);

    return new Response(
      JSON.stringify({
        success: true,
        url: fileUrl,
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
