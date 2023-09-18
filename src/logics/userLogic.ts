import {actions, kea, listeners, path} from "kea";
import type {userLogicType} from "./userLogicType";

export const userLogic = kea<userLogicType>([
    path(["src", "logics", "userLogic"]),
    actions(() => ({
        signInWithMicrosoft: true,
        signOut: true
    })),
    listeners(() => ({
        signInWithMicrosoft: async (_, breakpoint) => {
            breakpoint()
        }
    }))
])