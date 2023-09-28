// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../_shared/cors.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createStripeClient} from "../_shared/stripe.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Stripe from "stripe"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createSupabaseClient} from "../_shared/supabase.ts";


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    const signature = req.headers.get('Stripe-Signature')
    const stripe = createStripeClient()
    const cryptoProvider = Stripe.createSubtleCryptoProvider()

    const body = await req.text()
    let receivedEvent
    try {
        receivedEvent = await stripe.webhooks.constructEventAsync(
            body,
            signature!,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Deno.env.get('VITE_STRIPE_WEBHOOK_KEY')!,
            undefined,
            cryptoProvider
        )
    } catch (err: any) {
        return new Response(JSON.stringify({error: err.message}), {
            headers: corsHeaders,
            status: 400,
        })
    }

    const supabase = createSupabaseClient();
    const dataObject = receivedEvent?.data?.object
    const userId = dataObject?.description;
    const productId = dataObject?.items?.data?.[0]?.plan?.product

    if (["customer.subscription.created", "customer.subscription.deleted", "customer.subscription.updated"].includes(receivedEvent.type)) {
        console.log(`🔔 Event received: ${receivedEvent.type} ${receivedEvent.id}`)
        if (!userId || !productId) {
            return new Response(JSON.stringify({error: 'Webhook event is missing user/product id metadata'}), {
                headers: corsHeaders,
                status: 400,
            })
        }
        // fetch product name
        const product = await stripe.products.retrieve(productId);
        const {error: updateUserPlanError} = await supabase.auth.admin.updateUserById(userId, {
            user_metadata: receivedEvent.type === "customer.subscription.deleted"
                ? {stripe_customer: null, plan: "free"}
                : {
                    stripe_customer: dataObject.customer,
                    plan: product.name.toLowerCase()
                }
        })
        if (updateUserPlanError) {
            return new Response(JSON.stringify({error: 'Error updating user plan'}), {
                headers: corsHeaders,
                status: 400,
            })
        }
    } else {
        console.log(`Unhandled event type ${receivedEvent.type}`);
        return new Response(
            JSON.stringify({
                recieved: true
            }),
            {headers: corsHeaders},
        )
    }

    return new Response(
        JSON.stringify({
            receivedEvent
        }),
        {headers: corsHeaders},
    )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
