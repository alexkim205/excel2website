import {actions, afterMount, connect, defaults, kea, listeners, path} from "kea";
import {loaders} from "kea-loaders";
import {DashboardType, SupabaseTable} from "../utils/types";
import supabase from "../utils/supabase";
import {userLogic} from "./userLogic";

import type { dashboardGridLogicType } from "./dashboardGridLogicType";

export const dashboardGridLogic = kea<dashboardGridLogicType>([
    path(["src", "logics", "dashboardGridLogic"]),
    defaults({
        dashboards: [] as DashboardType[]
    }),
    connect(() => ({
        values: [userLogic, ["user"]],
        actions: [userLogic, ["setUser", "signOut"]]
    })),
    actions(() => ({
        deleteDashboard: (id: DashboardType["id"]) => ({id})
    })),
    loaders(({values}) => ({
        dashboards: {
            loadDashboards: async (_, breakpoint) => {
                if (!values.user) {
                    return []
                }
                await breakpoint(100)
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
            signOut: () => [],
            deleteDashboard: async ({id}, breakpoint) => {
                await breakpoint(100)
                const {error} = await supabase
                    .from(SupabaseTable.Dashboards)
                    .delete()
                    .eq('id', id)
                breakpoint()

                if (error) {
                    throw new Error(error.message)
                }
                return values.dashboards.filter(({id: thisId}) => thisId !== id)
            }
        }
    })),
    listeners(({actions}) => ({
        setUser: () => {
            actions.loadDashboards({})
        }
    })),
    afterMount(({actions}) => {
        actions.loadDashboards({})
    })
])