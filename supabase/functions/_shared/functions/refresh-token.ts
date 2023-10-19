// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../cors.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {refreshToken} from "../utils.ts";

export async function refreshTokenFunc(body: Record<string, any>) {
    const {refreshToken: token, provider} = body

    try {
        const payload = await refreshToken[provider as 'google' | 'azure'](token)

        return new Response(
            JSON.stringify(payload),
            {headers: corsHeaders},
        )
    } catch (e: any) {
        return new Response(JSON.stringify({error: e.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }
}