import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!token_hash || type !== "signup") {
    console.error("Invalid verify params:", { token_hash: !!token_hash, type });
    return NextResponse.redirect(
      `${siteUrl}/login?error=invalid-verification-link`
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // Use the anon key client for OTP verification (service role auto-confirms and skips validation)
  const supabaseAnon = createClient(supabaseUrl, anonKey);
  const supabaseAdmin = createClient(supabaseUrl, serviceKey);

  const { data, error } = await supabaseAnon.auth.verifyOtp({
    token_hash,
    type: "signup",
  });

  if (error || !data.user?.email) {
    console.error("Email verification error:", error);
    console.error("Verify data:", JSON.stringify(data));

    // Fallback: try to extract the email from the token by looking up the auth user
    // and mark as verified directly if the token was already consumed
    if (error?.message?.includes("expired") || error?.message?.includes("already")) {
      console.log("Token may have been already used or expired");
    }

    return NextResponse.redirect(
      `${siteUrl}/login?error=verification-failed`
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({ email_verified: true })
    .eq("email", data.user.email);

  if (updateError) {
    console.error("Failed to update email_verified:", updateError);
  } else {
    console.log("Email verified successfully for:", data.user.email);
  }

  return NextResponse.redirect(
    `${siteUrl}/login?verified=true`
  );
}
