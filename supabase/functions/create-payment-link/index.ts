// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createStripeClient} from "../_shared/stripe.ts";
import {combineUrl} from "kea-router";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const IS_PRODUCTION = Deno.env.get('VERCEL_ENV') === 'production'

// https://dashboard.stripe.com/products?active=true
const PRODUCT_TO_ID: Record<string, string> = IS_PRODUCTION ? {
  tiny: 'price_1Nue7kKQM0RYeWU9mBMteHnj',
  small: 'price_1NueKNKQM0RYeWU9V6DCe6EY',
  mega: 'price_1NueKgKQM0RYeWU9XSkEDtwi'
} : {
  tiny: 'price_1NueZXKQM0RYeWU9QxMJGWvW',
  small: 'price_1NueZfKQM0RYeWU9TDa7SB86',
  mega: 'price_1NueZuKQM0RYeWU9cSGZmNdj'
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders})
  }

  const {plan, user, redirectUrl} = await req.json()
  const stripe = createStripeClient()

  if (!Object.keys(PRODUCT_TO_ID).includes(plan) || !user) {
    return new Response(JSON.stringify({error: "Invalid plan or user."}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  let paymentLink
  try {
    paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: PRODUCT_TO_ID[plan] as string,
          quantity: 1,
        },
      ],
      subscription_data: {
        description: user // sneak in user id into subscription data
      },
      allow_promotion_codes: true,
      after_completion: {
        type: "redirect",
        redirect: {
          url: combineUrl(redirectUrl, {
            success: true
          }).url
        }
      }
    });
  } catch (e) {
    const error = e as unknown as Error
    console.log("ERROR", error)
    return new Response(JSON.stringify({error: error.message}), {
      headers: corsHeaders,
      status: 400,
    })
  }

  return new Response(
    JSON.stringify({
      paymentLink
    }),
    { headers: corsHeaders },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
