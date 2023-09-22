import {actions, afterMount, beforeUnmount, defaults, kea, listeners, path, reducers, selectors} from "kea";
import type {userLogicType} from "./userLogicType";
import supabase from "../utils/supabase";
import {Session} from "@supabase/gotrue-js/dist/module/lib/types";

export const userLogic = kea<userLogicType>([
    path(["src", "logics", "userLogic"]),
    defaults(() => ({
        user: null as Session | null
    })),
    actions(() => ({
        signInWithMicrosoft: true,
        signOut: true,
        setUser: (user: Session | null) => ({user})
    })),
    reducers(() => ({
        user: {
            setUser: (_, {user}) => user,
            signOut: () => null
        }
    })),
    listeners(() => ({
        signInWithMicrosoft: async (_, breakpoint) => {
            breakpoint()
            const { error } = await supabase.auth.signInWithOAuth({
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
            const { error } = await supabase.auth.signOut()
            if (error) {
                throw new Error(error.message)
            }
        }
    })),
    afterMount(async ({ actions, cache }) => {
        // Redirect to home if user isn't authenticated but private route is requested
        const {
            data: { session: currentSession },
        } = await supabase.auth.getSession();

        cache.unsubscribeOnAuthStateChange = supabase.auth.onAuthStateChange(
            (authStateEvent: any, session: Session | null) => {
                console.log("USRE SESSION", authStateEvent, session)
                actions.setUser(session);
            }
        );

        // Check if user is already logged in
        if (!currentSession) {
            return
        }
        else {
            actions.setUser(currentSession);
        }
    }),
    beforeUnmount(({ cache }) => {
        cache.unsubscribeOnAuthStateChange?.();
    }),
    selectors(() => ({
        providerToken: [
            (s) => [s.user],
            (user) => {
                return user?.provider_token
            }
        ]
    }))
])