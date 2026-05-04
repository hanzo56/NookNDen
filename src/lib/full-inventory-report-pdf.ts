import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  computeInsuranceStyleAcv,
  formatUsd,
  ACV_DISCLAIMER,
} from "@/lib/depreciation";
import type { ReportInventoryRow } from "@/lib/room-report-pdf";
import {
  embedRemoteImage,
  formatDateUs,
  LETTER_H,
  LETTER_W,
  PDF_BOTTOM,
  PDF_LINE,
  PDF_MARGIN,
  wrap,
} from "@/lib/inventory-pdf-shared";

export type FullReportItemRow = ReportInventoryRow & {
  room_name: string | null;
};

export async function buildFullInventoryPdf(params: {
  items: FullReportItemRow[];
  generatedAt: Date;
  accountLabel?: string | null;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const generatedLabel = params.generatedAt.toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const M = PDF_MARGIN;
  const LINE = PDF_LINE;
  const BOTTOM = PDF_BOTTOM;

  let page = pdfDoc.addPage([LETTER_W, LETTER_H]);
  let y = LETTER_H - M;

  const draw = (text: string, opts?: { bold?: boolean; size?: number }) => {
    const size = opts?.size ?? 11;
    const f = opts?.bold ? fontBold : font;
    const lines = wrap(text, 72);
    for (const ln of lines) {
      if (y < BOTTOM + size) {
        page = pdfDoc.addPage([LETTER_W, LETTER_H]);
        y = LETTER_H - M;
      }
      page.drawText(ln, {
        x: M,
        y: y - size,
        size,
        font: f,
        color: rgb(0.12, 0.15, 0.22),
        maxWidth: LETTER_W - 2 * M,
      });
      y -= LINE + (size > 11 ? 2 : 0);
    }
  };

  draw("Complete inventory report", { bold: true, size: 18 });
  y -= 6;
  draw(`Generated: ${generatedLabel}`);
  if (params.accountLabel) {
    draw(`Account: ${params.accountLabel}`);
  }
  draw(`Total items: ${params.items.length}`);
  y -= 8;
  draw(
    "Each item includes sale price and estimated ACV (straight-line, 10% salvage) as of the generation date above.",
    { size: 9 },
  );
  y -= 4;
  draw(ACV_DISCLAIMER, { size: 9 });

  for (const item of params.items) {
    page = pdfDoc.addPage([LETTER_W, LETTER_H]);
    y = LETTER_H - M;

    draw(item.name || "Untitled item", { bold: true, size: 15 });
    y -= 4;

    const acv = computeInsuranceStyleAcv({
      salePrice: item.sale_price ?? 0,
      purchaseDate: item.purchase_date,
      category: item.category || "Other",
    });

    const roomLocation =
      item.location?.trim() ||
      item.room_name?.trim() ||
      "—";

    const rows: [string, string][] = [
      ["Category", item.category || "—"],
      ["Manufacturer", item.manufacturer || "—"],
      ["Model", item.model || "—"],
      ["Serial number", item.serial_number || "—"],
      ["Assigned room", item.room_name?.trim() || "—"],
      ["Room / location", roomLocation],
      ["Purchase date", formatDateUs(item.purchase_date)],
      [
        "Sale price",
        item.sale_price != null && item.sale_price > 0
          ? formatUsd(item.sale_price)
          : "—",
      ],
      [
        "Est. insurance ACV (at report)",
        acv ? formatUsd(acv.estimatedActualCashValue) : "— (need price & purchase date)",
      ],
    ];

    if (acv) {
      rows.push(["ACV method (snapshot)", acv.methodSummary]);
    }

    for (const [label, value] of rows) {
      draw(`${label}:`, { bold: true, size: 10 });
      draw(value, { size: 10 });
      y -= 2;
    }

    y -= 8;
    draw("Photos", { bold: true, size: 12 });
    y -= 4;

    const photoUrls = (item.photos ?? []).filter(Boolean).slice(0, 8);
    if (photoUrls.length === 0) {
      draw("No photos on file.", { size: 10 });
      continue;
    }

    const imgMaxW = LETTER_W - 2 * M;
    const imgMaxH = 200;
    let imgCursorY = y;

    for (const url of photoUrls) {
      const img = await embedRemoteImage(pdfDoc, url);
      if (!img) {
        if (imgCursorY < BOTTOM + 24) {
          page = pdfDoc.addPage([LETTER_W, LETTER_H]);
          imgCursorY = LETTER_H - M;
        }
        page.drawText(`[Image unavailable] ${url.slice(0, 70)}`, {
          x: M,
          y: imgCursorY - 10,
          size: 8,
          font,
          color: rgb(0.4, 0.4, 0.45),
        });
        imgCursorY -= 18;
        continue;
      }

      const iw = img.width;
      const ih = img.height;
      const scale = Math.min(imgMaxW / iw, imgMaxH / ih, 1);
      const w = iw * scale;
      const h = ih * scale;

      if (imgCursorY - h < BOTTOM) {
        page = pdfDoc.addPage([LETTER_W, LETTER_H]);
        imgCursorY = LETTER_H - M;
      }

      page.drawImage(img, {
        x: M,
        y: imgCursorY - h,
        width: w,
        height: h,
      });
      imgCursorY -= h + 14;
    }
    y = imgCursorY;
  }

  if (params.items.length === 0) {
    page = pdfDoc.addPage([LETTER_W, LETTER_H]);
    y = LETTER_H - M;
    draw("No inventory items on file.", { size: 12 });
  }

  return pdfDoc.save();
}
