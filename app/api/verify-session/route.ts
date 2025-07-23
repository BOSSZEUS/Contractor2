import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("__session")?.value
  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return NextResponse.json({ authenticated: true, uid: decoded.uid, email: decoded.email })
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
