import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { parseSalePriceBody } from "@/lib/sale-price-input";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  let room = null;
  if (data.room_id) {
    const { data: roomData } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", data.room_id)
      .single();
    room = roomData;
  }

  return NextResponse.json({ item: { ...data, room } });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const { error, data } = await supabase
      .from("inventory_items")
      .update({
        name: body.name,
        category: body.category,
        manufacturer: body.manufacturer || null,
        model: body.model || null,
        serial_number: body.serial_number || null,
        location: body.location || null,
        room_id: body.room_id || null,
        purchase_date: body.purchase_date || null,
        sale_price: parseSalePriceBody(body.sale_price),
        warranty_expiry: body.warranty_expiry || null,
        support_contact: body.support_contact || null,
        photos: body.photos,
        documents: body.documents,
        notes: body.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ item: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
