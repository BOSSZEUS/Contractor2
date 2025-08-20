import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  const formData = await req.formData()
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  })

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.session) {
    const message = error?.message ?? "Unable to sign in"
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, req.url))
  }
  const res = NextResponse.redirect(new URL("/", req.url))
  res.cookies.set("sb-access-token", data.session.access_token, { httpOnly: true, path: "/" })
  res.cookies.set("sb-refresh-token", data.session.refresh_token, { httpOnly: true, path: "/" })
  return res
}
