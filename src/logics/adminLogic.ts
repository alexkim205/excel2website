import {actions, connect, defaults, kea, listeners, path} from "kea";
import {userLogic} from "./userLogic";
import type {adminLogicType} from "./adminLogicType";
import {loaders} from "kea-loaders";
import {router} from "kea-router";
import {urls} from "../utils/routes";
import {supabaseService} from "../utils/supabase";
import {User} from "@supabase/gotrue-js/dist/module/lib/types";
import {PricingTier} from "../utils/types";
import merge from "lodash.merge";

const PROD_SUPER_USER_ID = '5aadc53d-cc8f-4273-a039-31d558df19f0'
export const adminLogic = kea<adminLogicType>([
    path(["src", "logics", "adminLogic"]),
    connect(() => ({
        values: [userLogic, ["user"]],
        actions: [userLogic, ["setUser"]]
    })),
    defaults({
        users: [] as User[],
    }),
    actions(() => ({
        changeUserPlan: (userId: User["id"], plan: PricingTier) => ({userId, plan}),
    })),
    loaders(({values}) => ({
        users: {
            loadUsers: async (_, breakpoint) => {
                await breakpoint(1)
                const {data, error} = await supabaseService.auth.admin.listUsers()
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                return data.users ?? []
            },
            changeUserPlan: async ({userId, plan}, breakpoint) => {
                await breakpoint(1)
                const {error} = await supabaseService.auth.admin.updateUserById(
                    userId,
                    {user_metadata: {plan}}
                )
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                return values.users.map((user) => user.id === userId ? merge({}, user, {user_metadata: {plan}}) : user)
            }
        }
    })),
    listeners(({actions}) => ({
        setUser: ({user}) => {
            if (import.meta.env.PROD && user?.user?.id !== PROD_SUPER_USER_ID) {
                router.actions.push(urls.home())
            }
            actions.loadUsers({})
        }
    })),
])