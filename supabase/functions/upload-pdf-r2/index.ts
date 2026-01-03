import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { decode as base64Decode } from "https://deno.land/std@0.190.0/encoding/base64.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.577.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface UploadRequest {
  fileName: string;
  fileType: string;
  fileData: string; // Base64 encoded file data (optionally a data URL)
  folder?: string; // Optional folder path (e.g., "quotations" or "invoices")
  clientId?: string; // Optional client ID for organization
  clientName?: string; // Optional client name for folder structure
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

    console.log(
      "R2 Config check - accountId:",
      !!accountId,
      "accessKeyId:",
      !!accessKeyId,
      "secretAccessKey:",
      !!secretAccessKey,
      "bucketName:",
      bucketName,
      "publicUrl:",
      publicUrl
    );

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      console.error(
        "Missing R2 credentials - accountId:",
        !!accountId,
        "accessKeyId:",
        !!accessKeyId,
        "secretAccessKey:",
        !!secretAccessKey,
        "bucketName:",
        !!bucketName
      );
      throw new Error(
        "R2 configuration is incomplete. Please ensure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME are set."
      );
    }

    // Accept both JSON (base64) and multipart/form-data uploads
    const contentType = req.headers.get("content-type") || "";

    let fileName = "";
    let fileType = "application/pdf";
    let folder = "";
    let clientId = "";
    let clientName = "";
    let binaryData: Uint8Array;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();

      fileName = String(form.get("fileName") || "");
      fileType = String(form.get("fileType") || "application/pdf");
      folder = String(form.get("folder") || "");
      clientId = String(form.get("clientId") || "");
      clientName = String(form.get("clientName") || "");

      const file = form.get("file");
      if (!(file instanceof File)) {
        throw new Error("Missing file in multipart form data");
      }
      if (!fileName) fileName = file.name;
      if (!fileType) fileType = file.type || "application/pdf";

      const arrayBuffer = await file.arrayBuffer();
      binaryData = new Uint8Array(arrayBuffer);
    } else {
      const body = await req.json();
      const json: UploadRequest = body;

      ({
        fileName,
        fileType,
        fileData: undefined as unknown as string, // placeholder for destructure (we use json.fileData)
        folder = "",
        clientId = "",
        clientName = "",
      } = json);

      const fileData = json.fileData;

      console.log(
        "Upload request - fileName:",
        fileName,
        "fileType:",
        fileType,
        "folder:",
        folder,
        "clientId:",
        clientId,
        "clientName:",
        clientName,
        "fileData length:",
        fileData?.length || 0
      );

      if (!fileName || !fileData) {
        throw new Error("fileName and fileData are required");
      }

      // Decode base64 file data WITHOUT atob() to avoid huge temporary strings (prevents memory limit issues)
      try {
        // Accept either raw base64 or a full data URL like "data:application/pdf;base64,..."
        const cleanedBase64 = fileData.includes(",")
          ? fileData.split(",")[1]
          : fileData;

        binaryData = base64Decode(cleanedBase64);
        console.log("Decoded binary data size:", binaryData.length, "bytes");
      } catch (decodeError) {
        console.error("Base64 decode error:", decodeError);
        throw new Error("Invalid base64 file data");
      }
    }

    console.log(
      "Upload request - fileName:",
      fileName,
      "fileType:",
      fileType,
      "folder:",
      folder,
      "clientId:",
      clientId,
      "clientName:",
      clientName,
      "binary size:",
      binaryData.length
    );

    if (!fileName) {
      throw new Error("fileName is required");
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

    // Construct the full key (path) for the file
    // Structure: ClientName(ClientId)/folder/fileName for organized storage
    let key = fileName;
    if (clientName && clientId && folder) {
      // Clean client name for folder use (remove special chars)
      const cleanClientName = clientName.replace(/[^a-zA-Z0-9]/g, "");
      key = `${cleanClientName}(${clientId})/${folder}/${fileName}`;
    } else if (clientId && folder) {
      key = `${clientId}/${folder}/${fileName}`;
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

    // Construct the public URL
    let fileUrl: string;
    if (publicUrl) {
      const baseUrl = publicUrl.replace(/\/$/, "");
      fileUrl = `${baseUrl}/${key}`;
    } else {
      fileUrl = `https://${bucketName}.${accountId}.r2.dev/${key}`;
    }

    console.log("File uploaded successfully. Final URL:", fileUrl);

    return new Response(
      JSON.stringify({
        success: true,
        url: fileUrl,
        key,
        message: "File uploaded successfully to R2",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error uploading to R2:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage, success: false }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
