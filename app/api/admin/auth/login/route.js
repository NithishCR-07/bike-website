import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPassword } from "@/lib/auth/password";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    const supabase = createAdminClient();

    // Use .select("*") to dynamically match whatever columns exist in admin_users table
    const { data: adminUser, error: queryError } = await supabase
      .from("admin_users")
      .select("*")
      .ilike("email", cleanEmail)
      .maybeSingle();

    if (queryError) {
      console.error("Supabase admin_users query error:", queryError.message);
      return NextResponse.json(
        { error: `Database error querying admin_users: ${queryError.message}` },
        { status: 500 }
      );
    }

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found in Supabase 'admin_users' table." },
        { status: 401 }
      );
    }

    // Retrieve the stored hash from 'password' or 'password_hash' column
    const storedHash = adminUser.password ?? adminUser.password_hash ?? "";
    if (!storedHash) {
      return NextResponse.json(
        { error: "No password configured for this admin user." },
        { status: 401 }
      );
    }

    // Cryptographic verification against stored hash
    const isValid = verifyPassword(cleanPassword, storedHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password for this admin user." },
        { status: 401 }
      );
    }

    // Success: Create session payload
    const sessionPayload = {
      id: adminUser.id,
      email: adminUser.email || cleanEmail,
      role: adminUser.role || "admin",
      full_name: adminUser.full_name || "System Admin",
      authenticatedAt: Date.now(),
    };

    const sessionString = Buffer.from(JSON.stringify(sessionPayload)).toString("base64");

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "demobikes_admin_session",
      value: sessionString,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: sessionPayload,
    });
  } catch (err) {
    console.error("Admin Login Error:", err);
    return NextResponse.json(
      { error: "Server authentication error: " + (err.message || "Unknown error") },
      { status: 500 }
    );
  }
}
