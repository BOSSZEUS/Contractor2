import { type NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("__session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({
      success: true,
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch (error) {
    console.error("Protected route auth error:", error);
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
