import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  extractProductLabelFromImage,
  isAllowedImageMime,
} from "@/lib/gemini-extract";

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * POST multipart/form-data with field `file` (image),
 * or JSON body `{ "imageBase64": "<base64>", "mimeType": "image/jpeg" }`.
 *
 * Requires GEMINI_API_KEY. Optional GEMINI_MODEL (default: gemini-2.5-flash).
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Gemini is not configured. Set GEMINI_API_KEY in the server environment.",
      },
      { status: 503 },
    );
  }

  try {
    let base64: string;
    let mimeType: string;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: "Image too large. Maximum size is 8 MB." },
          { status: 400 },
        );
      }
      mimeType = file.type || "image/jpeg";
      if (!isAllowedImageMime(mimeType)) {
        return NextResponse.json(
          { error: "Unsupported image type" },
          { status: 400 },
        );
      }
      const buf = Buffer.from(await file.arrayBuffer());
      base64 = buf.toString("base64");
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      const b64 = body?.imageBase64;
      const mime = body?.mimeType;
      if (typeof b64 !== "string" || !b64.trim()) {
        return NextResponse.json(
          { error: "imageBase64 is required" },
          { status: 400 },
        );
      }
      if (typeof mime !== "string" || !mime.trim()) {
        return NextResponse.json(
          { error: "mimeType is required" },
          { status: 400 },
        );
      }
      mimeType = mime.trim();
      if (!isAllowedImageMime(mimeType)) {
        return NextResponse.json(
          { error: "Unsupported image type" },
          { status: 400 },
        );
      }
      let payload = b64.trim();
      if (payload.startsWith("data:")) {
        const comma = payload.indexOf(",");
        if (comma === -1) {
          return NextResponse.json(
            { error: "Invalid data URL" },
            { status: 400 },
          );
        }
        payload = payload.slice(comma + 1);
      }
      base64 = payload;
      const decoded = Buffer.from(base64, "base64");
      if (decoded.length > MAX_BYTES) {
        return NextResponse.json(
          { error: "Image too large. Maximum size is 8 MB." },
          { status: 400 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "Use multipart/form-data with file or application/json" },
        { status: 415 },
      );
    }

    const extracted = await extractProductLabelFromImage(base64, mimeType);
    return NextResponse.json({ extracted });
  } catch (err) {
    console.error("extract-product-label:", err);
    const message =
      err instanceof Error ? err.message : "Extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
