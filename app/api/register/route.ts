import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  const formData = await req.formData()
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirmPassword") ?? "")

  if (password !== confirm) {
    return NextResponse.redirect(new URL(`/register?error=${encodeURIComponent("Passwords do not match")}`, req.url))
  }

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  })

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        role: formData.get("role"),
        company: formData.get("company"),
      },
    },
  })

  if (error || !data.session) {
    const message = error?.message ?? "Unable to register"
    return NextResponse.redirect(new URL(`/register?error=${encodeURIComponent(message)}`, req.url))
  }

  const res = NextResponse.redirect(new URL("/", req.url))
  res.cookies.set("sb-access-token", data.session.access_token, { httpOnly: true, path: "/" })
  res.cookies.set("sb-refresh-token", data.session.refresh_token, { httpOnly: true, path: "/" })
  return res
}
