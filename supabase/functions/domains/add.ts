// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createSupabaseClient} from "../_shared/supabase.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {ENVS} from "./index.ts";

interface AddDomainPayload {
    dashboard_id: string
    domain: string
}

export async function addDomain({domain, dashboard_id}: AddDomainPayload) {
    try {
        // First check if domain is already being used somewhere in sheetstodashboard
        const supabase = createSupabaseClient()
        const {data: existingRowData, error} = await supabase
            .from("dashboards")
            .select()
            .eq("custom_domain", domain)
            .maybeSingle()
        if (error) {
            throw new Error(error.message)
        }
        if (existingRowData) {
            return new Response(
                JSON.stringify({success: true, message: "Domain is already published.", code: "domain_already_in_use", domain}),
                {headers: corsHeaders},
            )
        }

        // If data is null, domain is not being used, and needs to be added to the vercel project
        const response = await fetch(`https://api.vercel.com/v10/projects/${ENVS.project}/domains`, {
            body: JSON.stringify({
                name: domain
            }),
            headers: {
                Authorization: `Bearer ${ENVS.token}`
            },
            method: "POST"
        })
        const data = await response.json()
        if (data.error?.code === "domain_already_in_use") {
            return new Response(
                JSON.stringify({success: true, message: "Domain is already published.", code: "domain_already_in_use", domain}),
                {headers: corsHeaders},
            )
        }
        if (!response.ok) {
            throw new Error(data.message || data.error.message)
        }

        // If response is ok, update custom_domain in supabase table
        const {error: updateError} = await supabase
            .from("dashboards")
            .update({
                custom_domain: domain,
            })
            .eq("id", dashboard_id)
        if (updateError) {
            throw new Error(updateError.message)
        }
        return new Response(
            JSON.stringify({
                success: true,
                message: "Dashboard published on domain.",
                code: "dashboard_published",
                domain
            }),
            {headers: corsHeaders},
        )
    } catch (e: any) {
        return new Response(JSON.stringify({error: e.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }
}