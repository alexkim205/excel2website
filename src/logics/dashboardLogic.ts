import {actions, afterMount, connect, defaults, kea, key, listeners, path, props, reducers, selectors} from "kea";
import {loaders} from "kea-loaders";
import {userLogic} from "./userLogic";
import {DashboardItemType, DashboardType, PublishStatus, SupabaseTable} from "../utils/types";
import merge from "lodash.merge"
import type {DeepPartial} from "kea-forms/lib/types";
import type {dashboardLogicType} from "./dashboardLogicType";
import supabase from "../utils/supabase";
import {
    findFirstLinkedProvider,
    generateDashboardSubdomain,
    generateEmptyDashboardData,
    generateEmptyDashboardItem
} from "../utils/utils";
import type {Layout, Layouts} from "react-grid-layout";
import equal from "lodash.isequal";
import pick from "lodash.pick";

export interface DashboardLogicProps {
    id: DashboardType["id"]
    newDashboardItemId?: DashboardItemType["id"] // keep track of new item id at top level
}

export const dashboardLogic = kea<dashboardLogicType>([
    props({} as DashboardLogicProps),
    path((key) => ["src", "logics", "dashboardLogic", key]),
    key((props) => props.id),
    connect(() => ({
        values: [userLogic, ["user", "linkedProviders"]],
        actions: [userLogic, ["setUser", "signOut", "refreshToken"]]
    })),
    defaults(() => ({
        dashboard: null as DashboardType | null,
        charts: [] as DashboardItemType[],
        childChartsLoading: {} as Record<DashboardItemType["id"], boolean>,
        publishStatus: PublishStatus.Online as PublishStatus,
    })),
    actions(() => ({
        setChart: (chart: DeepPartial<DashboardItemType>) => ({chart}),
        setCharts: (charts: DeepPartial<DashboardItemType>[], changedItemIds: Set<DashboardItemType["id"]>) => ({charts, changedItemIds}),
        setDashboard: (dashboard: DeepPartial<DashboardType>) => ({dashboard}),
        onLayoutChange: (layouts: Layouts) => ({layouts}),
        setChildChartsLoading: (id: DashboardItemType["id"], loading: boolean) => ({id, loading})
    })),
    reducers(() => ({
        childChartsLoading: {
            setChildChartsLoading: (prev, {id, loading}) => merge({}, prev, {[id]: loading})
        }
    })),
    loaders(({values, props}) => ({
        dashboard: {
            loadDashboard: async (_, breakpoint) => {
                if (props.id === "global") {
                    return
                }
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

                if (data) {
                    return data
                }

                // If dashboard returns null, create it!
                const {data: insertData, error: insertError} = await supabase
                    .from(SupabaseTable.Dashboards)
                    .insert({
                        id: props.id,
                        user: values.user?.user.id,
                        data: generateEmptyDashboardData(props.id),
                        subdomain: generateDashboardSubdomain()
                    }).select().maybeSingle()
                if (insertError) {
                    throw new Error(insertError.message)
                }

                breakpoint()
                return insertData
            },
            setDashboard: ({dashboard}) => {
                return merge({}, values.dashboard, dashboard)
            },
            saveDashboard: async (_, breakpoint) => {
                await breakpoint(3000)
                const {data, error} = await supabase
                    .from(SupabaseTable.Dashboards)
                    .update({
                        custom_domain: values.dashboard?.custom_domain,
                        data: values.dashboard?.data
                    })
                    .eq("id", props.id)
                    .select()
                    .maybeSingle()
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                return data
            }
        },
        charts: {
            loadCharts: async (_, breakpoint) => {
                await breakpoint(100)

                const {data, error} = await supabase
                    .from(SupabaseTable.DashboardItems)
                    .select()
                    .eq("dashboard", props.id)
                    .eq("user", values.user?.user.id)
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }

                // pick out new dashboard item
                const newDashboardItem = values.charts.find(({id}) => id === props.newDashboardItemId)

                return [newDashboardItem, ...data]
            },
            setChart: ({chart}) => {
                return values.charts.map((thisChart) => thisChart.id === chart.id ? merge({}, thisChart, chart) : thisChart)
            },
            setCharts: ({charts}) => charts as DashboardItemType[],
        },
        publishStatus: {
            verifyPublishStatus: async (_, breakpoint) => {
                if (!values.user || !values.dashboard?.custom_domain) {
                    return values.publishStatus
                }
                await breakpoint(1)
                const {data, error} = await supabase.functions.invoke("domains", {
                    body: {
                        operation: "verify",
                        domain: values.dashboard.custom_domain,
                        dashboard_id: props.id
                    }
                })
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                if (data.code === "domain_misconfigured") {
                    return PublishStatus.Misconfigured
                }
                return PublishStatus.Online
            }
        }
    })),
    listeners(({actions, values}) => ({
        setUser: ({user}) => {
            if (!user) {
                return
            }
            actions.loadDashboard({})
            // actions.loadWorkbooks({})
        },
        loadDashboardSuccess: () => {
            actions.loadCharts({})
            actions.verifyPublishStatus({})
        },
        onLayoutChange: async ({layouts}) => {
            const keys = layouts.sm.map(({i}) => i)
            const stripDimension = (layout: Layout | undefined): Layout | undefined => layout ? pick(layout, ["h","w","x","y","i"]) : undefined
            const idToOldDimensions = Object.fromEntries(keys.map((i) => [i, {
                sm: stripDimension(values.layouts.sm.find(({i: thisI}) => thisI === i)),
                md: stripDimension(values.layouts.md.find(({i: thisI}) => thisI === i)),
                lg: stripDimension(values.layouts.lg.find(({i: thisI}) => thisI === i))
            }]))
            const idToNewDimensions = Object.fromEntries(keys.map((i) => [i, {
                sm: stripDimension(layouts.sm.find(({i: thisI}) => thisI === i)),
                md: stripDimension(layouts.md.find(({i: thisI}) => thisI === i)),
                lg: stripDimension(layouts.lg.find(({i: thisI}) => thisI === i))
            }]))
            const changedItemIds = keys.filter((key) => !equal(idToOldDimensions?.[key], idToNewDimensions?.[key]))

            actions.setCharts(values.charts.map((chart) => merge({}, chart, {data: {coordinates: idToNewDimensions?.[chart.id] ?? chart.data.coordinates}})), new Set(changedItemIds))
        },
        setDashboard: async () => {
            actions.saveDashboard({})
        }
    })),
    afterMount(({actions, values, props}) => {
        if (values.user) {
            actions.loadDashboard({})
        }

        // Populate dashboard with first new chart
        actions.setCharts([
            {
                id: props.newDashboardItemId,
                dashboard: props.id,
                data: generateEmptyDashboardItem(props.newDashboardItemId as string, findFirstLinkedProvider(values.linkedProviders)),
                created_at: null
            }
        ], new Set())
    }),
    selectors(() => ({
        layouts: [
            (s) => [s.charts],
            (charts) => {
                return {
                    sm: charts.map(chart => ({...chart.data.coordinates.sm, i: chart.id})),
                    md: charts.map(chart => ({...chart.data.coordinates.md, i: chart.id})),
                    lg: charts.map(chart => ({...chart.data.coordinates.lg, i: chart.id}))
                }
            }
        ],
        saving: [
            (s) => [s.dashboardLoading, s.childChartsLoading],
            (dashboardLoading, childChartsLoading) => {
                return dashboardLoading || Object.values(childChartsLoading).some(b=>!!b)
            }
        ]
    }))
])