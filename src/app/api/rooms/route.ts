import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("user_id", session.user.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Rooms GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms", details: error.message },
      { status: 500 }
    );
  }

  const rooms = data ?? [];
  const roomIds = rooms.map((r) => r.id);
  const countByRoom: Record<string, number> = {};

  if (roomIds.length > 0) {
    const { data: rows, error: countError } = await supabase
      .from("inventory_items")
      .select("room_id")
      .eq("user_id", session.user.id)
      .in("room_id", roomIds);

    if (!countError && rows) {
      for (const row of rows) {
        if (row.room_id) {
          countByRoom[row.room_id] = (countByRoom[row.room_id] ?? 0) + 1;
        }
      }
    }
  }

  const roomsWithCounts = rooms.map((r) => ({
    ...r,
    item_count: countByRoom[r.id] ?? 0,
  }));

  return NextResponse.json({ rooms: roomsWithCounts });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    const { error, data } = await supabase
      .from("rooms")
      .insert({
        user_id: session.user.id,
        name: body.name.trim(),
        description: body.description?.trim() || null,
        room_type: body.room_type || "Other",
        photos: body.photos || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Rooms POST error:", error);
      return NextResponse.json(
        { error: "Failed to create room", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ room: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
