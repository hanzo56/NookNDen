import { PDFDocument, rgb, type PDFImage } from "pdf-lib";

export function formatDateUs(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T12:00:00");
  if (Number.isNaN(d.getTime())) return dateStr;
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export async function embedRemoteImage(
  pdfDoc: PDFDocument,
  url: string,
): Promise<PDFImage | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    try {
      return await pdfDoc.embedJpg(bytes);
    } catch {
      try {
        return await pdfDoc.embedPng(bytes);
      } catch {
        return null;
      }
    }
  } catch {
    return null;
  }
}

export const LETTER_W = 612;
export const LETTER_H = 792;
export const PDF_MARGIN = 48;
export const PDF_LINE = 13;
export const PDF_BOTTOM = 56;

export function wrap(text: string, maxChars: number): string[] {
  const t = text.replace(/\r\n/g, "\n");
  const out: string[] = [];
  for (const para of t.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    let line = "";
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (next.length <= maxChars) {
        line = next;
      } else {
        if (line) out.push(line);
        line = w.length > maxChars ? w.slice(0, maxChars) : w;
      }
    }
    if (line) out.push(line);
    if (words.length === 0) out.push("");
  }
  return out.length ? out : [""];
}
