// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";

const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/
function verifyDomain(domain: string) {
  return DOMAIN_REGEX.test(domain)
}

const ENVS = {
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

  const {operation, domain: _domain} = await req.json()

  if (!verifyDomain(_domain)) {
    return new Response(JSON.stringify({error: "Domain is invalid."}), {
      headers: corsHeaders,
      status: 403,
    })
  }
  const domain = _domain.startsWith("www.") ? _domain.substring(4) : _domain

  console.log("OPEARTION", operation, _domain, domain)

  try {

    if (operation === "add") {
      const response = await fetch(`https://api.vercel.com/v10/projects/${ENVS.project}/domains`, {
        body: JSON.stringify({
          name: domain
        }),
        headers: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          Authorization: `Bearer ${ENVS.token}`
        },
        method: "POST"
      })
      const data = await response.json()
      console.log("OPEARTION", response.ok, data, ENVS)
      if (response.ok) {
        return new Response(
            JSON.stringify({
              ...data,
            }),
            {headers: corsHeaders},
        )
      }
      if (data.error.code === "domain_already_in_use") {
        return new Response(
            JSON.stringify({success: true}),
            {headers: corsHeaders},
        )
      }
      throw new Error(data.message || data.error.message)
    } else if (operation === "delete") {
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
              ...data,
            }),
            {headers: corsHeaders},
        )
      }
      throw new Error(data.message || data.error.message)
    } else if (operation === "verify") {
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
              ...data,
            }),
            {headers: corsHeaders},
        )
      }
      throw new Error(data.message || data.error.message)
    } else {
      throw new Error(`Operation type is unhandled: ${operation}`)
    }
  } catch (e: any) {
    return new Response(JSON.stringify({error: e.message}), {
      headers: corsHeaders,
      status: 400,
    })
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
