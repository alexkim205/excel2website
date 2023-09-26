import {kea, props, path, defaults, afterMount, key, selectors} from "kea";
import {DashboardItemType, DashboardType, SupabaseTable} from "../utils/types";
import type { publicDashboardLogicType } from "./publicDashboardLogicType";
import {loaders} from "kea-loaders";
import supabase from "../utils/supabase";

export interface PublicDashboardLogicProps {
    id: DashboardType["id"] | null
}

export const publicDashboardLogic = kea<publicDashboardLogicType>([
    props({} as PublicDashboardLogicProps),
    key((props) => props.id ?? "global"),
    path((key) => ["src", "logics", "publicDashboardLogic", key]),
    defaults({
        dashboard: null as DashboardType | null
    }),
    loaders(({props}) => ({
        dashboard: {
            loadDashboard: async (_, breakpoint) => {
                await breakpoint(100)
                const {data, error} = await supabase
                    .from(SupabaseTable.Dashboards)
                    .select(`*, dashboard_items(*)`)
                    .eq("subdomain", props.id)
                    .maybeSingle()
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                return data
            }
        }
    })),
    afterMount(({actions}) => {
        actions.loadDashboard({})
    }),
    selectors(() => ({
        layouts: [
            (s) => [s.dashboard],
            (dashboard) => {
                const charts = dashboard?.dashboard_items ?? [] as DashboardItemType[]
                return {
                    sm: charts.map(chart => ({...chart.data.coordinates.sm, i: chart.id})),
                    md: charts.map(chart => ({...chart.data.coordinates.md, i: chart.id})),
                    lg: charts.map(chart => ({...chart.data.coordinates.lg, i: chart.id}))
                }
            }
        ]
    }))
])