import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
}

// Global Supabase client (used for simple anon requests if needed)
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

/**
 * Creates an authenticated Supabase client using a Clerk JWT.
 * This ensures Row Level Security (RLS) can identify the user.
 * 
 * @param {string} clerkToken - The token from await getToken({ template: 'supabase' })
 * @returns SupabaseClient
 */
export const createAuthenticatedSupabaseClient = (clerkToken) => {
  return createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
    }
  )
}
