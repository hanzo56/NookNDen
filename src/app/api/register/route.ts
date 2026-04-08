import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

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
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (anonKey) {
      const supabaseAuth = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        anonKey
      );

      // Delete any stale Supabase Auth user from prior attempts so signUp sends a fresh email
      const { data: existingAuthUsers } =
        await supabase.auth.admin.listUsers({ perPage: 1000 });
      const staleAuthUser = existingAuthUsers?.users?.find(
        (u) => u.email === email
      );
      if (staleAuthUser) {
        await supabase.auth.admin.deleteUser(staleAuthUser.id);
      }

      const { data: signUpData, error: authError } =
        await supabaseAuth.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${siteUrl}/api/auth/verify`,
          },
        });

      if (authError) {
        console.error("Supabase auth signUp error:", authError);
      } else {
        console.log(
          "Supabase auth signUp success — confirmation email should be sent to:",
          email,
          "user id:",
          signUpData?.user?.id
        );
      }
    } else {
      console.warn(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set — verification email was not sent."
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
