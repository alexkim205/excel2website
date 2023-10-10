// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createSupabaseClient} from "../_shared/supabase.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {parseWorkbookUrlAndGetId} from "../_shared/utils.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GOOGLE_API_KEY = Deno.env.get('VITE_SUPABASE_AUTH_GOOGLE_REST_API_KEY') ?? ''

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    const {chart} = await req.json()
    const supabase = createSupabaseClient()

    console.log("FETCH", chart)

    // Fetch user's refresh
    const {data: userData, error} = await supabase.auth.admin.getUserById(chart.user)
    if (error) {
        return new Response(JSON.stringify({error: error.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }

    // Fetch graph data
    const range = chart?.data?.dataRange
    const sheetAndRange = range?.split("!")
    const sheet = sheetAndRange?.[0]?.replace(/^'+|'+$/g, '')
    const parsedRange = sheetAndRange?.[1]
    const provider = chart?.data?.srcProvider

    // Check if user has linked specified provider
    console.log("CHECK ME", userData.user.user_metadata, provider)
    if (!userData.user.user_metadata?.[provider]?.provider_token || !userData.user.user_metadata?.[provider]?.provider_refresh_token) {
        return new Response(JSON.stringify({error: `Data provider is not linked: ${provider}`}), {
            headers: corsHeaders,
            status: 401,
        })
    }

    // Other checks
    if (!sheet || !parsedRange) {
        return new Response(JSON.stringify({error: "Sheet range is invalid."}), {
            headers: corsHeaders,
            status: 400,
        })
    }

    if (!provider) {
        return new Response(JSON.stringify({error: "Provider is invalid."}), {
            headers: corsHeaders,
            status: 400,
        })
    }

    const workbookId = parseWorkbookUrlAndGetId(provider, chart.data.srcUrl)

    if (!workbookId) {
        return new Response(JSON.stringify({error: "Workbook id is invalid."}), {
            headers: corsHeaders,
            status: 400,
        })
    }

    // Refresh token
    const {data: refreshTokenData, error: refreshTokenError} = await supabase.functions.invoke('refresh-token', {
        body: {
            provider,
            refreshToken: userData.user.user_metadata?.[provider]?.provider_refresh_token
        }
    })

    console.log("refreshTokenData", refreshTokenData)

    if (refreshTokenError) {
        return new Response(JSON.stringify({error: refreshTokenError.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }
    // Update metadata with new access and refresh tokens
    const {error: updateTokensInUserError} = await supabase.auth.admin.updateUserById(chart.user,
        {
            user_metadata: {
                [provider]: {
                    provider_token: refreshTokenData.access_token,
                    provider_refresh_token: refreshTokenData.refresh_token
                }
            }
        }
    )
    if (updateTokensInUserError) {
        return new Response(JSON.stringify({error: updateTokensInUserError.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }

    let graphData

    try {
        if (provider === "azure") {
            const graphDataResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${workbookId}/workbook/worksheets/${sheet}/range(address='${parsedRange}')`, {
                method: "GET",
                headers: new Headers({
                    Authorization: `Bearer ${refreshTokenData.access_token}`,
                    Host: "graph.microsoft.com"
                }),
            })
            if (!graphDataResponse.ok) {
                throw new Error(graphDataResponse.statusText)
            }
            graphData = (await graphDataResponse.json()).values
        } else if (provider === "google") {
            const graphDataResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${workbookId}?includeGridData=true&ranges=${sheet}!${parsedRange}&key=${GOOGLE_API_KEY}`, {
                method: "GET",
                headers: new Headers({
                    Authorization: `Bearer ${refreshTokenData.access_token}`,
                    Accept: 'application/json'
                })
            })
            const data = await graphDataResponse.json()
            if (!graphDataResponse.ok) {
                throw new Error(graphDataResponse.statusText)
            }
            graphData = data
                .sheets
                ?.[0]
                ?.data
                ?.[0]
                ?.rowData
                ?.map((row: { values: { formattedValue: string }[] }) =>
                    row?.values?.map(cell => cell?.formattedValue) ?? []
                ) ?? []
        }

    } catch (e) {
        const error = e as unknown as Error
        return new Response(JSON.stringify({error: error.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }

    return new Response(
        JSON.stringify({
            values: graphData
        }),
        {headers: corsHeaders},
    )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
