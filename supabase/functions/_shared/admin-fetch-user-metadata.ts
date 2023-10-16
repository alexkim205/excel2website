// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createSupabaseClient} from "./supabase.ts";

export async function adminFetchUserMetadata(userId: string): Promise<[boolean, Record<string, any>]> {
    // Must be authorized user
    const supabase = createSupabaseClient()
    // Now we can get the session or user object
    const {
        data: { user }, error: getUserError
    } = await supabase.auth.admin.getUserById(userId)

    if (getUserError) {
        return [false, {
            error: getUserError
        }]
    }
    if (!user) {
        return [false, {
            error: new Error(`User does not exist.`)
        }]
    }

    // Get all linked email addresses
    const {data: getLinkedEmailsData, error: getLinkedEmailsError} = await supabase
        .from("linked_accounts")
        .select("to_email")
        .eq("from_email", user.email)
    if (getLinkedEmailsError) {
        return [false, {
            error: new Error(`Getting linked accounts: ${getLinkedEmailsError.message}`)
        }]
    }
    const idsToFetch = Array.from(new Set([...getLinkedEmailsData.map(({to_email}:{to_email: string}) => to_email), user.email]))

    // Get user metadata of all linked accounts
    let linkedMetadata: Record<string, any>[] = []
    const getIdsPromises = idsToFetch.map(async (email: string) => {
        const {data: getUserIdByEmailData, error: getUserIdByEmailError} = await supabase.rpc("get_user_id_by_email", {email})
        if (getUserIdByEmailError) {
            throw new Error(`Getting user id by email: ${getUserIdByEmailError.message}`)
        }
        const id = getUserIdByEmailData?.[0]?.id ?? null
        if (!id) {
            return null
        }
        // Get user
        const {data, error} = await supabase.auth.admin.getUserById(id)
        if (error) {
            throw new Error(`Getting user metadata: ${error.message}`)
        }
        return data.user.user_metadata
    })
    try {
        linkedMetadata = (await Promise.all(getIdsPromises))?.filter((id: string) => !!id)
    } catch (e: any) {
        return [false, {
            error: e
        }]
    }

    return [true, Object.assign({}, ...linkedMetadata)]
}