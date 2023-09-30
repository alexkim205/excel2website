import {kea, key, props, path, reducers, defaults, actions, connect, listeners} from "kea";
import {combineUrl} from "kea-router";
import {loaders} from "kea-loaders";
import {PricingTier} from "../utils/types";
import type {publishModalLogicType} from "./publishModalLogicType";
import supabase from "../utils/supabase";
import {Session} from "@supabase/gotrue-js/dist/module/lib/types";
import {userLogic} from "./userLogic";
import {DashboardLogicProps} from "./dashboardLogic";

export const publishModalLogic = kea<publishModalLogicType>([
    props({} as DashboardLogicProps),
    path((key) => ["src", "logics", "publishModalLogic", key]),
    key((props) => props.id),
    connect(() => ({
        values: [userLogic, ["user"]]
    })),
    defaults({
        open: false as boolean,
        paymentLink: {} as Partial<Record<PricingTier, string>>,
        loadingPaymentLinkPricingTier: null as PricingTier | null,
        publishDomain: null as Record<string, any> | null
    }),
    actions(() => ({
        setOpen: (open: boolean) => ({open}),
        generatePaymentLink: (plan: PricingTier) => ({plan}),
        addDomainToProject: (domain: string | null) => ({domain})
    })),
    reducers(() => ({
        open: {
            setOpen: (_, {open}) => open
        },
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
        publishDomain: {
            addDomainToProject: async ({domain}, breakpoint) => {
                if (!values.user || !domain) {
                    return values.publishDomain
                }
                await breakpoint(1)
                const {data, error} = await supabase.functions.invoke("domains", {
                    body: {
                        operation: "add",
                        domain
                    }
                })
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                return data
            },
        }
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