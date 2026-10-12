import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("demobikes_admin_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const sessionData = JSON.parse(decoded);

    if (!sessionData || sessionData.role !== "admin") {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: sessionData,
    });
  } catch (err) {
    console.error("Session verification error:", err);
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
