// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../cors.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createSupabaseClient, createUserSupabaseClient} from "../supabase.ts";


export async function fetchUserMetadata(_: Record<string, any>, headers: Headers) {
    // Must be authorized user
    const supabaseClient = createUserSupabaseClient(headers.get('Authorization')!)
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
}