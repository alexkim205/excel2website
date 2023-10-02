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
        const response = await fetch(`https://api.vercel.com/v9/projects/${ENVS.project}/domains/${domain}/verify`, {
            headers: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                Authorization: `Bearer ${ENVS.token}`
            },
            method: "POST"
        })
        const data = await response.json()
        if (response.ok) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Domain verified.",
                    code: "domain_verified",
                    domain
                }),
                {headers: corsHeaders},
            )
        }
        throw new Error(data.message || data.error.message)
    } catch (e: any) {
        return new Response(JSON.stringify({error: e.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }
}