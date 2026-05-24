import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase environment variables. Database features will not work.")
}

// Global Supabase client (used for simple anon requests if needed)
export const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || ''
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
    supabaseKey || '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
    }
  )
}
