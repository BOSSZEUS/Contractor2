import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/reset-password", "/verify-email"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // For protected routes, verify the Firebase session cookie
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/clients") || pathname.startsWith("/projects")) {
    const cookie = request.cookies.get("__session")?.value

    if (!cookie) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      await adminAuth.verifySessionCookie(cookie)
    } catch (error) {
      console.error("Session verification failed:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
