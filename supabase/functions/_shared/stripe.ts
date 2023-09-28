// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Stripe from 'stripe'

export function createStripeClient(): Stripe {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    const stripe = new Stripe(Deno.env.get('VITE_STRIPE_SECRET_KEY') as string, {
        httpClient: Stripe.createFetchHttpClient(),
    })
    return stripe
}