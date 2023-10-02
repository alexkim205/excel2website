import { createClient, SupabaseClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL;
const PUBLIC_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY

let client: SupabaseClient;
let clientService: SupabaseClient

function createSupabaseClient(): SupabaseClient {
    if (!URL || !PUBLIC_ANON_KEY) {
        const message = "Error: Supabase environment variables aren't set!";
        console.error(message);
        throw new Error(message);
    }

    if (!client) {
        client = createClient(URL, PUBLIC_ANON_KEY);
    }

    return client;
}

function createSupabaseServiceClient(): SupabaseClient {
    if (!URL || !SERVICE_KEY) {
        const message = "Error: Supabase service environment variables aren't set!";
        console.error(message);
        throw new Error(message);
    }

    if (!clientService) {
        clientService = createClient(URL, SERVICE_KEY);
    }

    return clientService;
}

const supabase = createSupabaseClient();

export const supabaseService = createSupabaseServiceClient()

export default supabase;
