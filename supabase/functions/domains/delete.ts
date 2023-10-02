// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {ENVS} from "./index.ts";

interface DeleteDomainPayload {
    domain: string
    dashboard_id: string
}

export async function deleteDomain({domain}: DeleteDomainPayload) {
    try {
        // Delete domain from vercel
        const response = await fetch(`https://api.vercel.com/v9/projects/${ENVS.project}/domains/${domain}`, {
            headers: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                Authorization: `Bearer ${ENVS.token}`
            },
            method: "DELETE"
        })
        const data = await response.json()
        if (response.ok) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Domain deleted.",
                    code: "domain_added",
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