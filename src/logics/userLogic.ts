import {actions, afterMount, beforeUnmount, defaults, kea, listeners, path, reducers, selectors} from "kea";
import type {userLogicType} from "./userLogicType";
import supabase from "../utils/supabase";
import type {Session} from "@supabase/gotrue-js/dist/module/lib/types";
import {router} from "kea-router";
import {SceneKey, urls} from "../utils/routes";
import md5 from "md5"
import merge from "lodash.merge";
import {loaders} from "kea-loaders";
import {PricingTier, Provider} from "../utils/types";
import {_generateBillingPortalLink} from "./pricingLogic";
import posthog from "posthog-js";
import {generateUserMetadata} from "../utils/utils";


export const userLogic = kea<userLogicType>([
    path(["src", "logics", "userLogic"]),
    defaults(() => ({
        user: null as Session | null,
        billingPortalLink: "" as string
    })),
    actions(() => ({
        signInWithMicrosoft: true,
        signInWithGoogle: true,
        signOut: true,
        setUser: (user: Session | null, fetchMetadata: boolean = false) => ({user, fetchMetadata}),
        refreshToken: (provider: Provider) => ({provider}),
        linkAccount: (provider: Provider, toEmail: string) => ({provider, toEmail})
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
        signInWithGoogle: async (_, breakpoint) => {
            breakpoint()
            const {error} = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    scopes: "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file  https://www.googleapis.com/auth/spreadsheets.readonly",
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })

            if (error) {
                throw new Error(error.message)
            }
        },
        linkAccount: async({provider, toEmail}, breakpoint) => {
            if (!values.user) {
                return
            }
            breakpoint()
            const {error} = await supabase.functions.invoke("link-account", {
                body: {
                    from_email: values.user.user.email,
                    to_email: toEmail
                }
            })
            if (error) {
                throw new Error(error.message)
            }
            if (provider === Provider.Google) {
                actions.signInWithGoogle()
            } else if (provider === Provider.Azure) {
                actions.signInWithMicrosoft()
            }
        },
        signOut: async () => {
            const {error} = await supabase.auth.signOut()
            if (error) {
                throw new Error(error.message)
            }
            router.actions.push(urls.home())
        },
        refreshTokens: async () => {
            const azureRefreshToken = values.getRefreshToken(Provider.Azure)
            const googleRefreshToken = values.getRefreshToken(Provider.Google)
            if (!values.user || !(azureRefreshToken || googleRefreshToken)) {
                return
            }
            let nextUserMetadata = {}
            if (azureRefreshToken) {
                const {data, error} = await supabase.functions.invoke("refresh-token", {
                    body: {
                        refreshToken: azureRefreshToken,
                        provider: Provider.Azure
                    }
                })
                if (error) {
                    throw new Error(error.message)
                }
                nextUserMetadata = {...nextUserMetadata, ...generateUserMetadata(data)}
            }
            if (googleRefreshToken) {
                const {data, error} = await supabase.functions.invoke("refresh-token", {
                    body: {
                        refreshToken: googleRefreshToken,
                        provider: Provider.Google
                    }
                })
                if (error) {
                    throw new Error(error.message)
                }
                nextUserMetadata = {...nextUserMetadata, ...generateUserMetadata(data)}
            }
            await supabase.auth.updateUser({
                data: nextUserMetadata
            })
            actions.setUser(merge({}, values.user, {
                user: {
                    user_metadata: nextUserMetadata
                }
            }));
        },
        setUser: async ({fetchMetadata}, breakpoint) => {
            if (!fetchMetadata) {
                return
            }
            // Get full metadata of all linked accounts
            await breakpoint(1)
            const {data, error} = await supabase.functions.invoke("fetch-user-metadata")
            if (error) {
                throw new Error(error.message)
            }
            // Overwrite metadata
            actions.setUser(merge({}, values.user, {user: {user_metadata: data}}))
        }
    })),
    afterMount(async ({actions, cache}) => {
        // Redirect to home if user isn't authenticated but private route is requested
        const {
            data: {session: currentSession},
        } = await supabase.auth.getSession();

        cache.unsubscribeOnAuthStateChange = supabase.auth.onAuthStateChange(
            (authState: any, session: Session | null) => {
                if (authState === "SIGNED_OUT") {
                    posthog.reset()
                    return
                }
                if (authState === "USER_UPDATED") {
                    actions.setUser(session, true);
                }
            }
        );

        // Check if user is already logged in
        if (!currentSession) {
            // Redirect on reset password page if user isn't signed in via email link
            if (![urls.sign_in(), urls.sign_up(), urls.forgot_password()].includes(router.values.currentLocation.pathname as SceneKey)) {
                router.actions.push(urls.home())
            }
            return
        }

        posthog.identify(currentSession.user.id, {
            email: currentSession.user.email,
        })
        const nextUserMetadata = generateUserMetadata(currentSession)
        // Don't overwrite if tokens are invalid
        if (Object.values(nextUserMetadata).length !== 0) {
            await supabase.auth.updateUser({
                data: nextUserMetadata
            })
        } else {
            // setUser trigger isn't called if updateUser isn't called - call it manually here
            // hacky workaround
            actions.setUser(currentSession, true);
        }

        actions.generateBillingPortalLink({})
    }),
    beforeUnmount(({cache}) => {
        cache.unsubscribeOnAuthStateChange?.();
    }),
    selectors(() => ({
        linkedProviders: [
            (s) => [s.user, s.getProviderToken],
            (user, getProviderToken) => {
                let linkedProviders = {
                    [Provider.Azure]: false,
                    [Provider.Google]: false,
                    [Provider.Raw]: true
                }
                if (!user) {
                    return linkedProviders
                }
                [Provider.Azure, Provider.Google].forEach((provider) => {
                    linkedProviders = {
                        ...linkedProviders,
                        [provider]: !!getProviderToken(provider)
                    }
                })
                return linkedProviders
            }
        ],
        getProviderToken: [
            (s) => [s.user],
            (user) => (provider: Provider) => {
                return user?.user?.user_metadata?.[provider]?.provider_token
            }
        ],
        plan: [
            (s) => [s.user],
            (user) => {
                return user?.user?.user_metadata?.plan ?? PricingTier.Free
            }
        ],
        getRefreshToken: [
            (s) => [s.user],
            (user) => (provider: Provider) => {
                return user?.user?.user_metadata?.[provider]?.provider_refresh_token
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