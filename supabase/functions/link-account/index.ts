// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createUserSupabaseClient} from "../_shared/supabase.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders})
  }

  const { from_email, to_email } = await req.json()

  if (from_email === to_email) {
    // If email addresses are the same, merging accounts is handled internally by Supabase
    return new Response(
        JSON.stringify({from_email, to_email}),
        {headers: corsHeaders},
    )
  }

  const supabaseClient = createUserSupabaseClient(req.headers.get('Authorization')!)
  // Now we can get the session or user object
  const {
    data: { user }, error: getUserError
  } = await supabaseClient.auth.getUser()

  if (getUserError) {
    return new Response(JSON.stringify({error: getUserError.message}), {
      headers: corsHeaders,
      status: 400,
    })
  }
  if (!user) {
    return new Response(JSON.stringify({error: `User with email ${from_email} does not exist.`}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  if (user.email !== from_email) {
    return new Response(JSON.stringify({error: "User cannot add link for different account"}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  // Add two link rows in both directions
  const { error } = await supabaseClient
      .from('linked_accounts')
      .insert([
        { from_email, to_email },
        { from_email: to_email, to_email: from_email }
      ])
  if (error && error.code !== "23505") {
    return new Response(JSON.stringify({error: error.message}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  return new Response(
    JSON.stringify({from_email, to_email}),
      {headers: corsHeaders},
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
