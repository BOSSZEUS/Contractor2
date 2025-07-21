import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// Firebase Admin SDK is not available in the Edge runtime. Authentication is
// handled on the client side.

export async function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/reset-password", "/verify-email"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // For protected routes, client-side auth will handle redirects

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
