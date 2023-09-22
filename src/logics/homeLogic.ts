import {afterMount, connect, defaults, kea, path} from "kea";
import {loaders} from "kea-loaders";
import {DashboardType, SupabaseTable} from "../utils/types";
import supabase from "../utils/supabase";
import type {homeLogicType} from "./homeLogicType";
import {userLogic} from "./userLogic";
import {subscriptions} from "kea-subscriptions";

export const homeLogic = kea<homeLogicType>([
    path(["src", "logics", "homeLogic"]),
    defaults({
        dashboards: [] as DashboardType[]
    }),
    connect(() => ({
        values: [userLogic, ["user"]]
    })),
    loaders(({values}) => ({
        dashboards: {
            loadDashboards: async (_, breakpoint) => {
                console.log("data values", values.user)
                if (!values.user) {
                    return []
                }
                await breakpoint()
                const {data, error} = await supabase.from(SupabaseTable.Dashboards).select().eq('user', values.user.user.id)
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                return data
            }
        }
    })),
    subscriptions(({actions}) => ({
       user: (_, newUser) => {
           if (newUser) {
               actions.loadDashboards({})
           }
       }
    })),
    afterMount(({actions, values}) => {
        if (!values.user) {
            return
        }
        actions.loadDashboards({})
    })
])