import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=invalid-verification-link`
    );
  }

  const { data: user, error: lookupError } = await supabase
    .from("users")
    .select("id, email, email_verified")
    .eq("verification_token", token)
    .single();

  if (lookupError || !user) {
    console.error("Verify token lookup failed:", lookupError);
    return NextResponse.redirect(
      `${siteUrl}/login?error=invalid-verification-link`
    );
  }

  if (user.email_verified) {
    return NextResponse.redirect(
      `${siteUrl}/login?verified=true`
    );
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ email_verified: true, verification_token: null })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to update email_verified:", updateError);
    return NextResponse.redirect(
      `${siteUrl}/login?error=verification-failed`
    );
  }

  console.log("Email verified successfully for:", user.email);
  return NextResponse.redirect(
    `${siteUrl}/login?verified=true`
  );
}
