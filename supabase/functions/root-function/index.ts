// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createBillingPortalLink} from "../_shared/functions/create-billing-portal-link.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createPaymentLink} from "../_shared/functions/create-payment-link.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {fetchChartData} from "../_shared/functions/fetch-chart-data.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {fetchGravatarIds} from "../_shared/functions/fetch-gravatar-ids.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {fetchUserMetadata} from "../_shared/functions/fetch-user-metadata.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {linkAccount} from "../_shared/functions/link-account.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {refreshTokenFunc} from "../_shared/functions/refresh-token.ts";

const NAME_TO_FUNCTION: Record<string, (body: Record<string, any>, headers: Headers) => Promise<Response>> = {
    ['create-billing-portal-link']: createBillingPortalLink,
    ['create-payment-link']: createPaymentLink,
    ['fetch-chart-data']: fetchChartData,
    ['fetch-gravatar-ids']: fetchGravatarIds,
    ['fetch-user-metadata']: fetchUserMetadata,
    ['link-account']: linkAccount,
    ['refresh-token']: refreshTokenFunc
}

serve(async (req: any) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    const {functionName, ...body} = await req.json()
    const response = NAME_TO_FUNCTION?.[functionName] ? (await NAME_TO_FUNCTION[functionName](body, req.headers)) : null
    return response
        ?? new Response(JSON.stringify({error: `Function name not found: ${functionName}`}), {
            headers: corsHeaders,
            status: 400,
        })

})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
