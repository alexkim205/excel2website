// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createSupabaseClient, createUserSupabaseClient} from "../_shared/supabase.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders})
  }

  // Must be authorized user
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
    return new Response(JSON.stringify({error: `User not authenticated.`}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  // Get all linked email addresses
  const {data: getLinkedEmailsData, error: getLinkedEmailsError} = await supabaseClient
      .from("linked_accounts")
      .select("to_email")
      .eq("from_email", user.email)
  if (getLinkedEmailsError) {
    return new Response(JSON.stringify({error: `Getting linked accounts: ${getLinkedEmailsError.message}`}), {
      headers: corsHeaders,
      status: 400,
    })
  }
  const idsToFetch = Array.from(new Set([...getLinkedEmailsData.map(({to_email}:{to_email: string}) => to_email), user.email]))

  // Get user metadata of all linked accounts
  let linkedMetadata: Record<string, any>[] = []
  const supabaseAdmin = createSupabaseClient()
  const getIdsPromises = idsToFetch.map(async (email: string) => {
    const {data: getUserIdByEmailData, error: getUserIdByEmailError} = await supabaseAdmin.rpc("get_user_id_by_email", {email})
    if (getUserIdByEmailError) {
      throw new Error(`Getting user id by email: ${getUserIdByEmailError.message}`)
    }
    const id = getUserIdByEmailData?.[0]?.id ?? null
    if (!id) {
      return null
    }
    // Get user
    const {data, error} = await supabaseAdmin.auth.admin.getUserById(id)
    if (error) {
      throw new Error(`Getting user metadata: ${error.message}`)
    }
    return data.user.user_metadata
  })
  try {
    linkedMetadata = (await Promise.all(getIdsPromises))?.filter((id: string) => !!id)
  } catch (e: any) {
    return new Response(JSON.stringify({error: e.message}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  return new Response(
      JSON.stringify(Object.assign({}, ...linkedMetadata)),
      {headers: corsHeaders},
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
