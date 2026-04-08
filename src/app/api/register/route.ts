import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, birthday, gender } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const birthdayDate =
      birthday?.month && birthday?.day && birthday?.year
        ? `${birthday.year}-${String(birthday.month).padStart(2, "0")}-${String(birthday.day).padStart(2, "0")}`
        : null;

    const { error: insertError } = await supabase.from("users").insert({
      email,
      password_hash: passwordHash,
      first_name: firstName || null,
      last_name: lastName || null,
      birthday: birthdayDate,
      gender: gender || null,
      email_verified: false,
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Clean up any stale Supabase Auth user from prior attempts
    const { data: existingAuthUsers } =
      await supabase.auth.admin.listUsers({ perPage: 1000 });
    const staleAuthUser = existingAuthUsers?.users?.find(
      (u) => u.email === email
    );
    if (staleAuthUser) {
      await supabase.auth.admin.deleteUser(staleAuthUser.id);
    }

    // Generate verification link via Supabase (does NOT send an email)
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "signup",
        email,
        password,
        options: {
          redirectTo: `${siteUrl}/api/auth/verify`,
        },
      });

    if (linkError || !linkData.properties?.hashed_token) {
      console.error("Failed to generate verification link:", linkError);
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const verifyUrl = `${siteUrl}/api/auth/verify?token_hash=${linkData.properties.hashed_token}&type=signup`;

    // Send the email ourselves via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const fromAddress = process.env.RESEND_FROM_EMAIL || "NookNDen <noreply@nooknden.com>";

      const { error: emailError } = await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: "Verify your NookNDen account",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 0;">
            <h2 style="color: #1d293d; margin-bottom: 16px;">Welcome to NookNDen!</h2>
            <p style="color: #45556c; font-size: 15px; line-height: 1.6;">
              Thanks for signing up${firstName ? `, ${firstName}` : ""}. Please confirm your email address to activate your account.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" style="padding: 24px 0;">
                  <a href="${verifyUrl}"
                     style="display: inline-block; background-color: #009966; color: #ffffff; font-size: 16px; font-weight: bold; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                    Verify My Email
                  </a>
                </td>
              </tr>
            </table>
            <p style="color: #64748b; font-size: 13px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 13px; color: #009966;">${verifyUrl}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">If you didn't create a NookNDen account, you can safely ignore this email.</p>
          </div>
        `,
      });

      if (emailError) {
        console.error("Resend email error:", emailError);
      } else {
        console.log("Verification email sent to:", email);
      }
    } else {
      console.warn("RESEND_API_KEY is not set — verification email was not sent.");
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
