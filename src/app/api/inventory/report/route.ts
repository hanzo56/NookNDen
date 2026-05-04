import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  buildFullInventoryPdf,
  type FullReportItemRow,
} from "@/lib/full-inventory-report-pdf";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: items, error: itemsError } = await supabase
    .from("inventory_items")
    .select(
      "id, name, category, manufacturer, model, serial_number, location, purchase_date, sale_price, photos, room_id",
    )
    .eq("user_id", session.user.id)
    .order("name", { ascending: true });

  if (itemsError) {
    console.error("Full inventory report error:", itemsError);
    return NextResponse.json(
      { error: "Failed to load items", details: itemsError.message },
      { status: 500 },
    );
  }

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name")
    .eq("user_id", session.user.id);

  const roomMap = new Map((rooms ?? []).map((r) => [r.id, r.name]));

  const enriched: FullReportItemRow[] = (items ?? []).map((row) => {
    const r = row as FullReportItemRow & { room_id?: string | null };
    const { room_id, ...rest } = r;
    const room_name = room_id ? (roomMap.get(room_id) ?? null) : null;
    return { ...rest, room_name };
  });

  const generatedAt = new Date();
  const pdfBytes = await buildFullInventoryPdf({
    items: enriched,
    generatedAt,
    accountLabel: session.user.email ?? session.user.name ?? null,
  });

  const dateSlug = generatedAt.toISOString().slice(0, 10);
  const fname = `nooknden-inventory-report-${dateSlug}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fname}"`,
      "Cache-Control": "no-store",
    },
  });
}
