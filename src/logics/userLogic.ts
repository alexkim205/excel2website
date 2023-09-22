import {actions, afterMount, beforeUnmount, defaults, kea, listeners, path, reducers, selectors} from "kea";
import type {userLogicType} from "./userLogicType";
import supabase from "../utils/supabase";
import type {Session} from "@supabase/gotrue-js/dist/module/lib/types";
import dayjs from "dayjs";

export const userLogic = kea<userLogicType>([
    path(["src", "logics", "userLogic"]),
    defaults(() => ({
        user: null as Session | null,
        tokens: {
            provider_token: null as string | null,
            provider_refresh_token: null as string | null
        }
    })),
    actions(() => ({
        signInWithMicrosoft: true,
        signOut: true,
        setUser: (user: Session | null) => ({user}),
        setTokens: (tokens: { provider_token: string | null, provider_refresh_token: string | null }) => ({tokens}),
    })),
    reducers(() => ({
        user: {
            setUser: (_, {user}) => user,
            signOut: () => null
        },
        // most recent refreshed tokens
        tokens: {
            signOut: () => ({provider_token: null, provider_refresh_token: null}),
            setTokens: (_, {tokens}) => tokens
        }
    })),
    listeners(() => ({
        signInWithMicrosoft: async (_, breakpoint) => {
            breakpoint()
            const {error} = await supabase.auth.signInWithOAuth({
                provider: 'azure',
                options: {
                    scopes: 'offline_access email Files.Read Files.Read.All Files.ReadWrite Files.ReadWrite.All',
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
        }
    })),
    afterMount(async ({actions, cache}) => {
        // Redirect to home if user isn't authenticated but private route is requested
        const {
            data: {session: currentSession},
        } = await supabase.auth.getSession();

        cache.unsubscribeOnAuthStateChange = supabase.auth.onAuthStateChange(
            (_: any, session: Session | null) => {
                actions.setUser(session);
            }
        );

        // Check if user is already logged in
        if (!currentSession || !currentSession.expires_at || !currentSession.provider_refresh_token) {
            return
        }
        // Check if access token has expired
        if (dayjs().isAfter(dayjs.unix(currentSession.expires_at))) {
            const {data, error} = await supabase.functions.invoke('refresh-token', {
                body: {refreshToken: currentSession.provider_refresh_token},
            })
            if (error) {
                throw new Error(error.message)
            }

            actions.setTokens({
                provider_token: data.access_token,
                provider_refresh_token: data.refresh_token
            })
            actions.setUser({
                ...currentSession,
                provider_token: data.access_token,
                provider_refresh_token: data.refresh_token
            })
            return
        }

        actions.setUser(currentSession);
    }),
    beforeUnmount(({cache}) => {
        cache.unsubscribeOnAuthStateChange?.();
    }),
    selectors(() => ({
        providerToken: [
            (s) => [s.user, s.tokens],
            (user, tokens) => {
                return tokens.provider_token || user?.provider_token
            }
        ],
        refreshToken: [
            (s) => [s.user, s.tokens],
            (user, tokens) => {
                return tokens.provider_refresh_token || user?.provider_refresh_token
            }
        ]
    }))
])