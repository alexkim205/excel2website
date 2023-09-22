import {afterMount, connect, defaults, kea, listeners, path} from "kea";
import {loaders} from "kea-loaders";
import {DashboardType, SupabaseTable} from "../utils/types";
import supabase from "../utils/supabase";
import type {homeLogicType} from "./homeLogicType";
import {userLogic} from "./userLogic";

export const homeLogic = kea<homeLogicType>([
    path(["src", "logics", "homeLogic"]),
    defaults({
        dashboards: [] as DashboardType[]
    }),
    connect(() => ({
        values: [userLogic, ["user"]],
        actions: [userLogic, ["setUser", "signOut"]]
    })),
    loaders(({values}) => ({
        dashboards: {
            loadDashboards: async (_, breakpoint) => {
                console.log("data values", values.user, values.dashboards)
                if (!values.user) {
                    return []
                }
                await breakpoint()
                const {data, error} = await supabase
                    .from(SupabaseTable.Dashboards)
                    .select(`*, dashboard_items(*)`)
                    .eq('user', values.user.user.id)
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                return data
            },
            signOut: () => []
        }
    })),
    listeners(({actions}) => ({
       setUser: ({user}) => {
           console.log("NEW SER", user)
           actions.loadDashboards({})
       }
    })),
    afterMount(({actions}) => {
        actions.loadDashboards({})
    })
])