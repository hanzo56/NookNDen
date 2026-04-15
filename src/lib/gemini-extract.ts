import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ExtractedProductLabel } from "./types";

const EXTRACTION_PROMPT = `You read product labels, nameplates, and stickers from photos (and sometimes the product body if text is visible).

Respond with ONLY a single JSON object (no markdown fences, no commentary) using this exact shape:
{"manufacturer":string|null,"model":string|null,"serialNumber":string|null,"confidence":"high"|"medium"|"low","notes":string|null}

Field rules:
- manufacturer: Brand or company (e.g. Samsung, GE, Apple). null if not legible or not present.
- model: Model name or model number exactly as printed. null if not legible or not present.
- serialNumber: Serial number, S/N, SN, or similar — copy exactly as printed. null if not legible or not present. Never guess or invent digits.
- confidence: Your overall confidence in the extracted values (not just one field).
- notes: Short caveats (e.g. glare, blur, multiple labels) or null.

If the image is not a product/label or has no relevant text, return all string fields as null, confidence "low", and notes briefly explaining why.`;

function parseModelJson(text: string): unknown {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fence ? fence[1].trim() : trimmed;
  return JSON.parse(jsonStr) as unknown;
}

function normalizeExtracted(raw: unknown): ExtractedProductLabel {
  if (!raw || typeof raw !== "object") {
    return {
      manufacturer: null,
      model: null,
      serialNumber: null,
      confidence: "low",
      notes: "Could not parse model output",
    };
  }

  const o = raw as Record<string, unknown>;
  const optString = (v: unknown): string | null => {
    if (v === null || v === undefined) return null;
    if (typeof v !== "string") return null;
    const s = v.trim();
    return s.length ? s : null;
  };

  let confidence: ExtractedProductLabel["confidence"] = "low";
  if (o.confidence === "high" || o.confidence === "medium" || o.confidence === "low") {
    confidence = o.confidence;
  }

  return {
    manufacturer: optString(o.manufacturer),
    model: optString(o.model),
    serialNumber: optString(o.serialNumber),
    confidence,
    notes: optString(o.notes),
  };
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

export function isAllowedImageMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime.toLowerCase());
}

/**
 * Sends an image to Gemini and returns structured manufacturer / model / serial fields.
 * Requires `GEMINI_API_KEY`. Optional `GEMINI_MODEL` (default: gemini-2.5-flash).
 */
export async function extractProductLabelFromImage(
  base64: string,
  mimeType: string,
): Promise<ExtractedProductLabel> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const normalizedMime = mimeType.toLowerCase();
  if (!isAllowedImageMime(normalizedMime)) {
    throw new Error(`Unsupported image type: ${mimeType}`);
  }

  const modelId = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: modelId });

  const result = await model.generateContent([
    { text: EXTRACTION_PROMPT },
    {
      inlineData: {
        mimeType: normalizedMime,
        data: base64,
      },
    },
  ]);

  const response = result.response;
  const text = response.text();
  if (!text?.trim()) {
    return {
      manufacturer: null,
      model: null,
      serialNumber: null,
      confidence: "low",
      notes: "Empty response from vision model",
    };
  }

  try {
    const parsed = parseModelJson(text);
    return normalizeExtracted(parsed);
  } catch {
    return {
      manufacturer: null,
      model: null,
      serialNumber: null,
      confidence: "low",
      notes: "Model did not return valid JSON",
    };
  }
}
