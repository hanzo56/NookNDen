import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

/** Server-side client (secret key); use in API routes, server actions, auth. */
export const supabase = createClient(supabaseUrl, supabaseSecretKey);

/** Client Components: publishable key, RLS applies. */
export function createBrowserSupabaseClient(): SupabaseClient {
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  return createClient(supabaseUrl, publishableKey);
}
