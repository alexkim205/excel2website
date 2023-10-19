// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createSupabaseClient} from "../supabase.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import md5 from "md5";

export async function fetchGravatarIds() {
    const supabase = createSupabaseClient()

    // Fetch user's refresh
    const {data, error} = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 23
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
            values: data.users?.map(({email}:{email: string}) => ({hash: md5(email?.toLowerCase() || ""), initials: email.substring(0, 2)}))
        }),
        { headers: corsHeaders },
    )
}