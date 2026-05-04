import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { parseSalePriceBody } from "@/lib/sale-price-input";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";
  const category = searchParams.get("category") || "";

  let dbQuery = supabase
    .from("inventory_items")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(
      `name.ilike.%${query}%,manufacturer.ilike.%${query}%,model.ilike.%${query}%,serial_number.ilike.%${query}%`
    );
  }

  if (category) {
    dbQuery = dbQuery.eq("category", category);
  }

  const { data, error } = await dbQuery;

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { error, data } = await supabase
      .from("inventory_items")
      .insert({
        user_id: session.user.id,
        name: body.name,
        category: body.category || "Uncategorized",
        manufacturer: body.manufacturer || null,
        model: body.model || null,
        serial_number: body.serial_number || null,
        location: body.location || null,
        room_id: body.room_id || null,
        purchase_date: body.purchase_date || null,
        sale_price: parseSalePriceBody(body.sale_price),
        warranty_expiry: body.warranty_expiry || null,
        support_contact: body.support_contact || null,
        photos: body.photos || [],
        documents: body.documents || [],
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ item: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
