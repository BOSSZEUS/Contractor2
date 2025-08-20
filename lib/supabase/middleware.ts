import { createServerClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
if (!supabaseUrl) {
  throw new Error("Missing environment variable: SUPABASE_URL")
}

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseServiceRoleKey) {
  throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY")
}

export const supabase = createServerClient(supabaseUrl, supabaseServiceRoleKey)
