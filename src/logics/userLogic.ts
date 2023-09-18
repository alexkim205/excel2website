import {actions, afterMount, beforeUnmount, defaults, kea, listeners, path, reducers} from "kea";
import type {userLogicType} from "./userLogicType";
import supabase from "../supabase";
import {User, Session} from "@supabase/gotrue-js/dist/module/lib/types";

export const userLogic = kea<userLogicType>([
    path(["src", "logics", "userLogic"]),
    defaults(() => ({
        user: null as User | null
    })),
    actions(() => ({
        signInWithMicrosoft: true,
        signOut: true,
        setUser: (user: User | null) => ({user})
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
                    scopes: 'email',
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
            data: { user: currentUser },
        } = await supabase.auth.getUser();

        console.log("after mount", currentUser)

        cache.unsubscribeOnAuthStateChange = supabase.auth.onAuthStateChange(
            (_: any, session: Session | null) => {
                const nextUser = session?.user ?? null;
                console.log("USRE SESSION", session)
                actions.setUser(nextUser);
            }
        );

        // Check if user is already logged in
        if (!currentUser) {
            return
        }
        else {
            actions.setUser(currentUser);
        }
    }),
    beforeUnmount(({ cache }) => {
        cache.unsubscribeOnAuthStateChange?.();
    }),
])