// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";

export async function refreshToken(refreshToken: string) {
    return fetch(`https://login.microsoftonline.com/common/oauth2/v2.0/token`, {
        method: "POST",
        headers: new Headers({
            ["Content-Type"]: 'application/x-www-form-urlencoded',
            Host: "https://login.microsoftonline.com"
        }),
        body: new URLSearchParams({
            scope: 'Files.Read Files.Read.All',
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            client_id: Deno.env.get('VITE_SUPABASE_AUTH_AZURE_CLIENT_ID'),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            client_secret: Deno.env.get('VITE_SUPABASE_AUTH_AZURE_SECRET')
        })
    })
}

serve(async (req: any) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    const {refreshToken: token} = await req.json()

    try {
        const response = await refreshToken(token)
        const data = await response.json()

        return new Response(
            JSON.stringify({
                ...data,
                refresh_token: token
            }),
            {headers: corsHeaders},
        )
    } catch (e: any) {
        return new Response(JSON.stringify({error: e.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
