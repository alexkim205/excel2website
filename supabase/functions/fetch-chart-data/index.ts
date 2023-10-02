// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createSupabaseClient} from "../_shared/supabase.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {combineUrl} from "kea-router";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders})
  }

  const {chart} = await req.json()
  const supabase = createSupabaseClient()

  // Fetch user's refresh
  const {data, error} = await supabase.auth.admin.getUserById(chart.user)
  if (error) {
    return new Response(JSON.stringify({error: error.message}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  // Refresh token
  const {data: refreshTokenData, error: refreshTokenError} = await supabase.functions.invoke('refresh-token', {
    body: {
      refreshToken: data.user.user_metadata.provider_refresh_token
    }
  })

  // Fetch graph data
  const range = chart?.data?.dataRange
  const sheetAndRange = range?.split("!")
  const sheet = sheetAndRange?.[0]?.replace(/^'+|'+$/g, '')
  const parsedRange = sheetAndRange?.[1]

  if (!sheet || !parsedRange) {
    return new Response(JSON.stringify({error: "Chart range is invalid."}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  if (refreshTokenError) {
    return new Response(JSON.stringify({error: refreshTokenError.message}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  const workbookId = combineUrl(chart.data.srcUrl).searchParams?.resid ?? ""

  if (!workbookId) {
    return new Response(JSON.stringify({error: "Data source is invalid."}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  let graphData

  try {
    const graphDataResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${workbookId}/workbook/worksheets/${sheet}/range(address='${parsedRange}')`, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${refreshTokenData.access_token}`,
        Host: "graph.microsoft.com"
      }),
    })
    graphData = (await graphDataResponse.json()).values
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
    { headers: corsHeaders },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
