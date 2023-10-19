// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createStripeClient} from "../stripe.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {corsHeaders} from "../cors.ts";

export async function createBillingPortalLink(body: Record<string, any>) {
    const {customer, redirectUrl} = body
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
}