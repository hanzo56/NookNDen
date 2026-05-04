import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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
    .from("rooms")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const { data: items, error: itemsError } = await supabase
    .from("inventory_items")
    .select(
      "id, name, category, manufacturer, model, serial_number, photos, warranty_expiry, created_at"
    )
    .eq("user_id", session.user.id)
    .eq("room_id", id)
    .order("name", { ascending: true });

  if (itemsError) {
    console.error("Room items GET error:", itemsError);
    return NextResponse.json(
      { error: "Failed to load room items", details: itemsError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ room: data, items: items ?? [] });
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
      .from("rooms")
      .update({
        name: body.name?.trim(),
        description: body.description?.trim() || null,
        room_type: body.room_type || undefined,
        photos: body.photos || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update room" },
        { status: 500 }
      );
    }

    return NextResponse.json({ room: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
