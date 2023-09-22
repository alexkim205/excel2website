import {actions, afterMount, beforeUnmount, defaults, kea, listeners, path, reducers, selectors} from "kea";
import type {userLogicType} from "./userLogicType";
import supabase from "../utils/supabase";
import type {Session} from "@supabase/gotrue-js/dist/module/lib/types";
import {router} from "kea-router";
import {urls} from "../utils/routes";

export const userLogic = kea<userLogicType>([
    path(["src", "logics", "userLogic"]),
    defaults(() => ({
        user: null as Session | null
    })),
    actions(() => ({
        signInWithMicrosoft: true,
        signOut: true,
        setUser: (user: Session | null) => ({user}),
    })),
    reducers(() => ({
        user: {
            setUser: (_, {user}) => user,
            signOut: () => null
        },
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
            console.log("SIGN OUT GREAT")
            const {error} = await supabase.auth.signOut()
            console.log("SIGN OUT", error)
            if (error) {
                throw new Error(error.message)
            }
            router.actions.push(urls.home())
        }
    })),
    afterMount(async ({actions, cache}) => {
        // Redirect to home if user isn't authenticated but private route is requested
        const {
            data: {session: currentSession},
        } = await supabase.auth.getSession();

        cache.unsubscribeOnAuthStateChange = supabase.auth.onAuthStateChange(
            (authState: any, session: Session | null) => {
                if (authState === "SIGNED_OUT" || authState === "USER_UPDATED") {
                    return
                }
                if (session) {
                    // update provider access and refresh tokens on supabase
                    supabase.auth.updateUser({
                        data: {
                            provider_token: session.provider_token,
                            provider_refresh_token: session.provider_refresh_token
                        }
                    })
                }
                actions.setUser(session);
            }
        );

        // Check if user is already logged in
        if (!currentSession) {
            router.actions.push(urls.home())
            return
        }

        actions.setUser(currentSession);
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
        refreshToken: [
            (s) => [s.user],
            (user) => {
                return user?.user?.user_metadata?.provider_refresh_token
            }
        ]
    }))
])