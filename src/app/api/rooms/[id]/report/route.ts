import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { buildRoomInventoryPdf } from "@/lib/room-report-pdf";

function downloadFilename(roomName: string): string {
  const base =
    roomName
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 48) || "room";
  return `${base}-inventory-report.pdf`;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("name, room_type")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (roomError || !room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const { data: items, error: itemsError } = await supabase
    .from("inventory_items")
    .select(
      "id, name, category, manufacturer, model, serial_number, location, purchase_date, sale_price, photos",
    )
    .eq("user_id", session.user.id)
    .eq("room_id", id)
    .order("name", { ascending: true });

  if (itemsError) {
    console.error("Room report items error:", itemsError);
    return NextResponse.json(
      { error: "Failed to load items", details: itemsError.message },
      { status: 500 },
    );
  }

  const generatedAt = new Date();
  const pdfBytes = await buildRoomInventoryPdf({
    room: { name: room.name, room_type: room.room_type },
    items: items ?? [],
    generatedAt,
  });

  const fname = downloadFilename(room.name);

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fname}"`,
      "Cache-Control": "no-store",
    },
  });
}
