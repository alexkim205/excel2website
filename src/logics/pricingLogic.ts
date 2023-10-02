import {actions, connect, defaults, kea, listeners, path, reducers} from "kea";
import type { pricingLogicType } from "./pricingLogicType";
import {PricingTier} from "../utils/types";
import {loaders} from "kea-loaders";
import {Session} from "@supabase/gotrue-js/dist/module/lib/types";
import supabase from "../utils/supabase";
import {combineUrl} from "kea-router";
import {userLogic} from "./userLogic";

export const pricingLogic = kea<pricingLogicType>([
    path(["src", "logics", "pricingLogic"]),
    connect(() => ({
        values: [userLogic, ["user"]]
    })),
    defaults({
        paymentLink: {} as Partial<Record<PricingTier, string>>,
        loadingPaymentLinkPricingTier: null as PricingTier | null,
    }),
    actions(() => ({
        generatePaymentLink: (plan: PricingTier) => ({plan}),
    })),
    reducers(() => ({
        loadingPaymentLinkPricingTier: {
            generatePaymentLink: (_, {plan}) => plan,
            generatePaymentLinkSuccess: () => null,
            generatePaymentLinkFailure: () => null
        }
    })),
    loaders(({values}) => ({
        paymentLink: {
            generatePaymentLink: async ({plan}, breakpoint) => {
                if (!values.user) {
                    return values.paymentLink
                }
                await breakpoint(1)
                const link = await _generatePaymentLink(plan, values.user)
                breakpoint()
                return {
                    ...values.paymentLink,
                    [plan]: link
                }
            }
        },
    })),
    listeners(() => ({
        generatePaymentLinkSuccess: ({paymentLink, payload}) => {
            if (!payload || !paymentLink?.[payload.plan]) {
                return
            }
            window.location.href = paymentLink[payload.plan] as string
        }
    }))
])

export async function _generatePaymentLink(plan: PricingTier, session: Session): Promise<string> {
    const {data, error} = await supabase.functions.invoke("create-payment-link", {
        body: {
            plan,
            user: session.user.id,
            redirectUrl: window.location.href
        }
    })
    if (error) {
        throw new Error(error.message)
    }
    return combineUrl(data.paymentLink.url, {
        prefilled_email: session.user.email
    }).url
}

export async function _generateBillingPortalLink(session: Session): Promise<string> {
    if (!session.user.user_metadata.stripe_customer) {
        return ""
    }
    const {data, error} = await supabase.functions.invoke("create-billing-portal-link", {
        body: {
            customer: session.user.user_metadata.stripe_customer,
            redirectUrl: window.location.href
        }
    })
    if (error) {
        throw new Error(error.message)
    }
    return data.billingLink.url
}