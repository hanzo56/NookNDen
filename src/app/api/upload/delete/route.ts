import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const ALLOWED_BUCKETS = new Set(["photos", "documents"]);

/** Parse Supabase public object URL → bucket + storage path */
function parsePublicStorageUrl(
  url: string,
  supabaseHost: string,
): { bucket: string; path: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname !== supabaseHost) return null;
    const match = u.pathname.match(
      /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/,
    );
    if (!match) return null;
    return {
      bucket: match[1],
      path: decodeURIComponent(match[2]),
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.json(
      { error: "Storage not configured" },
      { status: 500 },
    );
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const url = body.url?.trim();
  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const supabaseHost = new URL(supabaseUrl).hostname;
  const parsed = parsePublicStorageUrl(url, supabaseHost);
  if (!parsed || !ALLOWED_BUCKETS.has(parsed.bucket)) {
    return NextResponse.json({ skipped: true });
  }

  const userPrefix = `${session.user.id}/`;
  if (!parsed.path.startsWith(userPrefix)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.storage
    .from(parsed.bucket)
    .remove([parsed.path]);

  if (error) {
    console.error("Storage delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
