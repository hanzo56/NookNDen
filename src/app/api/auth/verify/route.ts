import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!token_hash || type !== "signup") {
    return NextResponse.redirect(
      `${siteUrl}/login?error=invalid-verification-link`
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash,
    type: "signup",
  });

  if (error || !data.user?.email) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      `${siteUrl}/login?error=verification-failed`
    );
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ email_verified: true })
    .eq("email", data.user.email);

  if (updateError) {
    console.error("Failed to update email_verified:", updateError);
  }

  return NextResponse.redirect(
    `${siteUrl}/login?verified=true`
  );
}
