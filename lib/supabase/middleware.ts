import { createServerClient } from "@supabase/supabase-js"

export function createSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  if (!supabaseUrl || !supabaseUrl.startsWith("https://")) {
    throw new Error("SUPABASE_URL must start with https://")
  }

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseServiceRoleKey || !supabaseServiceRoleKey.startsWith("https://")) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY must start with https://")
  }

  return createServerClient(supabaseUrl, supabaseServiceRoleKey)
}
