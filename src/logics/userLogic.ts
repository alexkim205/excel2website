import {actions, kea, listeners, path} from "kea";
import type {userLogicType} from "./userLogicType";
import supabase from "@supabase/supabase-js"

export const userLogic = kea<userLogicType>([
    path(["src", "logics", "userLogic"]),
    actions(() => ({
        signInWithMicrosoft: true,
        signOut: true
    })),
    listeners(() => ({
        signInWithMicrosoft: async (_, breakpoint) => {
            breakpoint()
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'azure',
                options: {
                    scopes: 'email',
                },
            })
        }
    }))
])