import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For v0 preview, allow all requests
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/reset-password", "/verify-email"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // For dashboard routes, check for session cookie
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/clients") || pathname.startsWith("/projects")) {
    const sessionCookie = request.cookies.get("__session")

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
