import {actions, afterMount, connect, defaults, kea, key, listeners, path, props, selectors} from "kea";
import {loaders} from "kea-loaders";
import {userLogic} from "./userLogic";
import {DashboardItemType, DashboardType, SupabaseTable, WorkbookType} from "../utils/types";
import merge from "lodash.merge"
import type {DeepPartial} from "kea-forms/lib/types";
import type {dashboardLogicType} from "./dashboardLogicType";
import {router} from "kea-router";
import {urls} from "../utils/routes";
import supabase from "../utils/supabase";
import {generateEmptyDashboardData, generateEmptyDashboardItem} from "../utils/utils";

export function graphFetch({url = "", method = "GET", providerToken, body}: {
    url: string,
    method?: "GET" | "POST",
    providerToken: string,
    body?: Record<string, any>
}) {
    return fetch(`https://graph.microsoft.com/v1.0/me/drive/${url}`, {
        method,
        headers: new Headers({
            Authorization: `Bearer ${providerToken}`,
            Host: "graph.microsoft.com"
        }),
        body: JSON.stringify(body)
    })
}

export interface DashboardLogicProps {
    id: DashboardType["id"]
    newDashboardItemId?: DashboardItemType["id"] // keep track of new item id at top level
}

export const dashboardLogic = kea<dashboardLogicType>([
    props({} as DashboardLogicProps),
    path((key) => ["src", "logics", "apiLogic", key]),
    key((props) => props.id),
    connect(() => ({
        values: [userLogic, ["providerToken", "user"]],
        actions: [userLogic, ["setUser"]]
    })),
    defaults({
        dashboard: null as DashboardType | null,
        charts: [] as DashboardItemType[],
        workbooks: [] as WorkbookType[],
    }),
    actions(() => ({
        setChart: (chart: DeepPartial<DashboardItemType>) => ({chart})
    })),
    loaders(({values, props}) => ({
        dashboard: {
            loadDashboard: async (_, breakpoint) => {
                await breakpoint(100)
                const {data, error} = await supabase
                    .from(SupabaseTable.Dashboards)
                    .select()
                    .eq("user", values.user?.user.id)
                    .eq("id", props.id)
                    .maybeSingle()
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }

                console.log("DATA", data)

                if (data) {
                    return data
                }

                // If dashboard returns null, create it!
                const {data: insertData, error: insertError} = await supabase
                    .from(SupabaseTable.Dashboards)
                    .insert({
                        id: props.id,
                        user: values.user?.user.id,
                        data: generateEmptyDashboardData(props.id)
                    }).select().maybeSingle()
                if (insertError) {
                    throw new Error(insertError.message)
                }

                console.log("DASHBOARD DATA", insertData)
                breakpoint()
                return data
            }
        },
        charts: {
            setChart: ({chart}) => {
                return values.charts.map((thisChart) => thisChart.id === chart.id ? merge({}, thisChart, chart) : thisChart)
            }
        },
        workbooks: {
            loadWorkbooks: async (_, breakpoint) => {
                if (!values.providerToken) {
                    return values.workbooks
                }
                await breakpoint(1)
                const response = await graphFetch({url: "root/children", providerToken: values.providerToken})
                const data = await response.json()
                breakpoint()
                return data.value.filter(({name}: { name: string }) => name.endsWith(".xlsx")) ?? []
            }
        }
    })),
    listeners(({actions}) => ({
        setUser: ({user}) => {
            if (!user) {
                return
            }
            actions.loadWorkbooks({})
        }
    })),
    afterMount(({actions, values}) => {
        if (!values.user) {
            router.actions.push(urls.home())
            return
        }
        if (values.providerToken) {
            actions.loadDashboard({})
            actions.loadWorkbooks({})
        }
    }),
    selectors(() => ({
        layouts: [
            (s) => [s.charts, (_, props) => props.newDashboardItemId],
            (charts, newDashboardItemId) => {
                const newCharts = [...charts, ...(newDashboardItemId ? [{
                    id: newDashboardItemId,
                    data: generateEmptyDashboardItem(newDashboardItemId),
                }] : [])]
                return {
                    sm: newCharts.map(chart => ({i: chart.id, ...chart.data.coordinates})),
                    md: newCharts.map(chart => ({i: chart.id, ...chart.data.coordinates})),
                    lg: newCharts.map(chart => ({i: chart.id, ...chart.data.coordinates})),
                }
            }
        ],
    }))
])