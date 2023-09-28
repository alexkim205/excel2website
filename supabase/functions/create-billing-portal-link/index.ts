// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createStripeClient} from "../_shared/stripe.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders})
  }

  const {customer, redirectUrl} = await req.json()
  const stripe = createStripeClient()

  if (!customer || !redirectUrl) {
    return new Response(JSON.stringify({error: "Invalid customer or redirectUrl."}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  let billingLink
  try {
    billingLink = await stripe.billingPortal.sessions.create({
      customer: customer,
      return_url: redirectUrl
    });
  } catch (e) {
    const error = e as unknown as Error
    return new Response(JSON.stringify({error: error.message}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  return new Response(
      JSON.stringify({
        billingLink
      }),
      { headers: corsHeaders },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
