// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createSupabaseClient} from "../supabase.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {parseWorkbookUrlAndGetId, refreshToken} from "../utils.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import merge from "lodash.merge";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {adminFetchUserMetadata} from "../admin-fetch-user-metadata.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {demoData} from "../demo.data.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GOOGLE_API_KEY = Deno.env.get('VITE_SUPABASE_AUTH_GOOGLE_REST_API_KEY') ?? ''


export async function fetchChartData(body: Record<string, any>) {
    const {chart} = body

    // If demo data return static data
    if (chart.data.srcUrl === "https://onedrive.live.com/edit.aspx?resid=demo") {
        return new Response(
            JSON.stringify({
                values: demoData.values
            }),
            {headers: corsHeaders},
        )
    }

    const supabase = createSupabaseClient()

    // Fetch user's refresh
    const {data: _userData, error} = await supabase.auth.admin.getUserById(chart.user)
    if (error) {
        return new Response(JSON.stringify({error: error.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }
    const [fetchMetadataOk, fetchMetadataData] = await adminFetchUserMetadata(_userData.user, supabase)

    if (!fetchMetadataOk) {
        return new Response(JSON.stringify({error: fetchMetadataData.error.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }
    const userData = merge({}, _userData, {user: {user_metadata: fetchMetadataData}})

    // Fetch graph data
    const range = chart?.data?.dataRange
    const sheetAndRange = range?.split("!")
    const sheet = sheetAndRange?.[0]?.replace(/^'+|'+$/g, '')
    const parsedRange = sheetAndRange?.[1]
    const provider = chart?.data?.srcProvider

    // Check if user has linked specified provider
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

    let refreshTokenData
    try {
        refreshTokenData = await refreshToken[provider as 'google' | 'azure'](userData.user.user_metadata?.[provider]?.provider_refresh_token)
    } catch (e: any) {
        return new Response(JSON.stringify({error: e.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }
    if (!refreshTokenData) {
        return new Response(JSON.stringify({error: "Refresh token data was empty."}), {
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
            const graphDataResponse = await fetch(
                `https://graph.microsoft.com/v1.0/me/drive/items/${workbookId}/workbook/worksheets/${sheet}/range(address='${parsedRange}')`, {
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
            const graphDataResponse = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${workbookId}?includeGridData=true&ranges=${sheet}!${parsedRange}&key=${GOOGLE_API_KEY}`, {
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
}