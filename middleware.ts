import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const supabase = createSupabaseServerClient()

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/reset-password", "/verify-email"]

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get("__session")
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(sessionCookie.value)

  if (error || !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
