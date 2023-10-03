// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createSupabaseClient} from "../_shared/supabase.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import md5 from "md5";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders})
  }

  const supabase = createSupabaseClient()

  // Fetch user's refresh
  const {data, error} = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 50
  })
  if (error) {
    return new Response(JSON.stringify({error: error.message}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  // Calculate gravatar id's
  return new Response(
      JSON.stringify({
        values: data.users?.map(({email}:{email: string}) => md5(email?.toLowerCase() || ""))
      }),
      { headers: corsHeaders },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
