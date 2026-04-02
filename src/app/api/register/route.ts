import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

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
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 500 }
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
