// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {ENVS} from "./index.ts";

interface VerifyDomainPayload {
    domain: string
}

export async function verifyDomain({domain}: VerifyDomainPayload) {
    try {
        const response = await fetch(`https://api.vercel.com/v6/domains/${domain}/config`, {
            headers: {
                Authorization: `Bearer ${ENVS.token}`
            },
            method: "GET"
        })
        const data = await response.json()
        if (response.ok) {
            if (data.misconfigured) {
                return new Response(
                    JSON.stringify({
                        success: true,
                        message: "Domain misconfigured.",
                        code: "domain_misconfigured",
                        domain
                    }),
                    {headers: corsHeaders},
                )
            } else {
                return new Response(
                    JSON.stringify({
                        success: true,
                        message: "Domain online.",
                        code: "domain_online",
                        domain
                    }),
                    {headers: corsHeaders},
                )
            }
        }
        throw new Error(data.message || data.error.message)
    } catch (e: any) {
        return new Response(JSON.stringify({error: e.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }
}