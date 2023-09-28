// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function createSupabaseClient(): SupabaseClient {
    const supabaseClient = createClient(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Deno.env.get('SUPABASE_URL') ?? '',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    return supabaseClient
}