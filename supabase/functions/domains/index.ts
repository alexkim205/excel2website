// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {addDomain} from "./add.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {deleteDomain} from "./delete.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {verifyDomain} from "./verify.ts";

const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

function checkDomainRegex(domain: string) {
    return DOMAIN_REGEX.test(domain)
}

export const ENVS = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    token: Deno.env.get("VERCEL_AUTH_BEARER_TOKEN"),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    project: Deno.env.get("VERCEL_PROJECT_ID"),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    team: Deno.env.get("VERCEL_TEAM_ID"),
}

serve(async (req: any) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    const {operation, domain: _domain, dashboard_id} = await req.json()

    if (!checkDomainRegex(_domain)) {
        return new Response(JSON.stringify({error: "Domain is invalid."}), {
            headers: corsHeaders,
            status: 403,
        })
    }

    if (!dashboard_id) {
        return new Response(JSON.stringify({error: "Dashboard id is invalid."}), {
            headers: corsHeaders,
            status: 403,
        })
    }

    const domain = _domain.startsWith("www.") ? _domain.substring(4) : _domain

    if (operation === "add") {
        return await addDomain({domain, dashboard_id})
    } else if (operation === "delete") {
        return await deleteDomain({domain, dashboard_id})
    } else if (operation === "verify") {
        return await verifyDomain({domain})
    }

    return new Response(JSON.stringify({error: `Operation ${operation} is not handled.`}), {
        headers: corsHeaders,
        status: 400,
    })
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
