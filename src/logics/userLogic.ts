import {actions, afterMount, beforeUnmount, defaults, kea, listeners, path, reducers, selectors} from "kea";
import type {userLogicType} from "./userLogicType";
import supabase from "../utils/supabase";
import type {Session} from "@supabase/gotrue-js/dist/module/lib/types";
import {router} from "kea-router";
import {urls} from "../utils/routes";
import md5 from "md5"
import merge from "lodash.merge";
import {loaders} from "kea-loaders";
import {PricingTier} from "../utils/types";
import {_generateBillingPortalLink} from "./pricingLogic";

export const userLogic = kea<userLogicType>([
    path(["src", "logics", "userLogic"]),
    defaults(() => ({
        user: null as Session | null,
        billingPortalLink: "" as string
    })),
    actions(() => ({
        signInWithMicrosoft: true,
        signOut: true,
        setUser: (user: Session | null) => ({user}),
        refreshToken: true,
    })),
    reducers(() => ({
        user: {
            setUser: (_, {user}) => user,
            signOut: () => null
        },
    })),
    loaders(({values}) => ({
        billingPortalLink: {
            generateBillingPortalLink: async (_, breakpoint) => {
                if (!values.user) {
                    return ''
                }
                await breakpoint(1)
                const link = await _generateBillingPortalLink(values.user)
                breakpoint()
                return link
            }
        }
    })),
    listeners(({values, actions}) => ({
        signInWithMicrosoft: async (_, breakpoint) => {
            breakpoint()
            const {error} = await supabase.auth.signInWithOAuth({
                provider: 'azure',
                options: {
                    scopes: 'offline_access email Files.Read Files.Read.All',
                },
            })

            if (error) {
                throw new Error(error.message)
            }
        },
        signOut: async () => {
            const {error} = await supabase.auth.signOut()
            if (error) {
                throw new Error(error.message)
            }
            router.actions.push(urls.home())
        },
        refreshToken: async () => {
            if (!values.user || !values.refreshToken) {
                return
            }
            const {data, error} = await supabase.functions.invoke("refresh-token", {
                body: {
                    refreshToken: values.refreshToken
                }
            })
            if (error) {
                throw new Error(error.message)
            }
            await supabase.auth.updateUser({
                data: {
                    provider_token: data.access_token,
                    provider_refresh_token: data.refresh_token
                }
            })
            actions.setUser(merge({}, values.user, {
                provider_token: data.access_token,
                provider_refresh_token: data.refresh_token,
                user: {
                    user_metadata: {
                        provider_token: data.access_token,
                        provider_refresh_token: data.refresh_token
                    }
                }
            }));
        },
    })),
    afterMount(async ({actions, cache}) => {
        // Redirect to home if user isn't authenticated but private route is requested
        const {
            data: {session: currentSession},
        } = await supabase.auth.getSession();

        cache.unsubscribeOnAuthStateChange = supabase.auth.onAuthStateChange(
            (authState: any, session: Session | null) => {
                if (authState === "SIGNED_OUT") {
                    return
                }
                if (authState === "USER_UPDATED") {
                    actions.setUser(session);
                }
            }
        );

        // Check if user is already logged in
        if (!currentSession) {
            router.actions.push(urls.home())
            return
        }

        // TODO temporarily give everyone life
        await supabase.auth.updateUser({
            data: {
                plan: PricingTier.Life,
                provider_token: currentSession.provider_token,
                provider_refresh_token: currentSession.provider_refresh_token
            }
        })

        actions.generateBillingPortalLink({})
    }),
    beforeUnmount(({cache}) => {
        cache.unsubscribeOnAuthStateChange?.();
    }),
    selectors(() => ({
        providerToken: [
            (s) => [s.user],
            (user) => {
                return user?.user?.user_metadata?.provider_token
            }
        ],
        plan: [
            (s) => [s.user],
            (user) => {
                return user?.user?.user_metadata?.plan ?? PricingTier.Free
            }
        ],
        refreshToken: [
            (s) => [s.user],
            (user) => {
                return user?.user?.user_metadata?.provider_refresh_token
            }
        ],
        gravatarLink: [
            (s) => [s.user],
            (user) => {
                if (!user?.user?.email) {
                    return null
                }
                return `https://www.gravatar.com/avatar/${md5(user.user.email.toLowerCase())}`;
            }
        ]
    }))
])