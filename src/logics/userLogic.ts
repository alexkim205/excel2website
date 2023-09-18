import {actions, defaults, kea, listeners, path, reducers} from "kea";
import type {userLogicType} from "./userLogicType";
import supabase from "../supabase";

export const userLogic = kea<userLogicType>([
    path(["src", "logics", "userLogic"]),
    defaults(() => ({
        user: null as Record<string, string> | null
    })),
    actions(() => ({
        signInWithMicrosoft: true,
        signOut: true,
        setUser: (user: Record<string, string> | null) => ({user})
    })),
    reducers(() => ({
        user: {
            setUser: (_, {user}) => user,
            signOut: () => null
        }
    })),
    listeners(({actions}) => ({
        signInWithMicrosoft: async (_, breakpoint) => {
            breakpoint()
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'azure',
                options: {
                    scopes: 'email',
                },
            })
            if (error) {
                throw new Error(error.message)
            }
            console.log("data", data)
            actions.setUser(data)
        },
        signOut: async () => {
            const { error } = await supabase.auth.signOut()
            if (error) {
                throw new Error(error.message)
            }
        }
    }))
])