import { cookies } from "next/headers"
import { adminAuth } from "./firebase-admin"
import type { DecodedIdToken } from "firebase-admin/auth"

export async function getUserFromSession(): Promise<DecodedIdToken | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("__session")?.value
    if (!sessionCookie) {
      return null
    }
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return decoded
  } catch (error) {
    console.error("Failed to verify session cookie:", error)
    return null
  }
}
