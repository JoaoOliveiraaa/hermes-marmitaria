import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Variáveis de ambiente do Supabase não configuradas!\n\n" +
      "Por favor, configure as seguintes variáveis no arquivo .env.local:\n" +
      "- NEXT_PUBLIC_SUPABASE_URL\n" +
      "- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n" +
      "Obtenha esses valores em: https://supabase.com/dashboard/project/_/settings/api"
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
