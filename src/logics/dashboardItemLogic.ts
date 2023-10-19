import {actions, afterMount, connect, defaults, kea, key, listeners, path, props, reducers, selectors} from "kea";
import {dashboardLogic, DashboardLogicProps} from "./dashboardLogic";
import {DashboardItemType, DataType, SupabaseTable} from "../utils/types";
import {userLogic} from "./userLogic";
import {loaders} from "kea-loaders";
import {DeepPartial} from "kea-forms/lib/types";
import supabase from "../utils/supabase";
import type {dashboardItemLogicType} from "./dashboardItemLogicType";
import equal from "lodash.isequal"
import pick from "lodash.pick"
import omit from "lodash.omit"
import {toast} from "react-toastify";
import {v4 as uuidv4} from "uuid";
import {findFirstLinkedProvider, generateEmptyDashboardItem, parseWorkbookUrlAndGetId} from "../utils/utils";
import merge from "lodash.merge";
import type {User} from "@supabase/supabase-js";
import {router} from "kea-router";
import {urls} from "../utils/routes";

export interface DashboardItemLogicProps {
    id: DashboardItemType["id"],
    dashboardProps: DashboardLogicProps
    autoSync?: boolean
}

export const dashboardItemLogic = kea<dashboardItemLogicType>([
    key((props) => `${props.dashboardProps.id}-${props.id}`),
    path((key) => ["src", "dashboardItemLogic", key]),
    props({autoSync: false} as DashboardItemLogicProps),
    connect((props: DashboardItemLogicProps) => ({
        values: [dashboardLogic(props.dashboardProps), ["charts"], userLogic, ["getProviderToken", "user", "linkedProviders"]],
        actions: [dashboardLogic(props.dashboardProps), ["setChart", "loadCharts", "setCharts", "setChildChartsLoading"]]
    })),
    defaults({
        open: false as boolean,
        data: null as DataType | null,
        localChart: {} as DeepPartial<DashboardItemType>
    }),
    actions(() => ({
        setOpen: (open: boolean) => ({open}),
        setThisChart: (chart: DeepPartial<DashboardItemType>) => ({chart}),
        saveThisChart: (shouldToast: boolean = true) => ({shouldToast}),
        setLastSyncedChart: (lastSyncedChart: DashboardItemType) => ({lastSyncedChart}),
        setLocalChart: (chart: DeepPartial<DashboardItemType>) => ({chart})
    })),
    loaders(({values, props, actions}) => ({
        data: {
            fetchData: async (_, breakpoint) => {
                // Make api call
                if (!values.syncable || !values.user || !values.parsedWorkbookId || !values.parsedRange.sheet || !values.parsedRange.range) {
                    return
                }
                await breakpoint(100)
                const {data, error} = await supabase.functions.invoke('root-function', {
                    body: {
                        functionName: 'fetch-chart-data',
                        chart: {
                            ...values.localMergedChart,
                            user: values.user.user.id, // make sure user gets injected even on new items
                        }
                    }
                })
                breakpoint()

                if (error) {
                    throw new Error(error.message)
                }

                // Set last synced data
                actions.setLastSyncedChart(values.localMergedChart)

                return data
            }
        },
        chart: {
            saveThisChart: async ({shouldToast}, breakpoint) => {
                if (!values.syncable || !values.user) {
                    return null
                }
                if (values.isDemoDashboard) {
                    actions.setOpen(false)
                    return null
                }

                await breakpoint(100)
                // generate new id if this is a new dashboard item
                const newId = values.isNew ? uuidv4() : props.id
                const findNewCoordinates = (size: "sm" | "md" | "lg") => values.isNew ? {
                    ...omit(values.localMergedChart.data.coordinates[size], ["static"]),
                    x: 0,
                    y: 0
                } : values.localMergedChart.data.coordinates[size]

                const dataToUpsert = {
                    id: newId,
                    data: {
                        ...values.localMergedChart.data,
                        coordinates: {
                            sm: findNewCoordinates("sm"),
                            md: findNewCoordinates("md"),
                            lg: findNewCoordinates("lg")
                        },
                        id: newId
                    },
                    dashboard: props.dashboardProps.id,
                    user: values.user?.user?.id
                }

                const {data, error} = await supabase
                    .from(SupabaseTable.DashboardItems)
                    .upsert(dataToUpsert).select().maybeSingle()
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }

                if (shouldToast) {
                    toast.success("Dashboard item saved.")
                }

                if (values.isNew) {
                    actions.loadCharts({})
                    // reset data in new modal
                    actions.setThisChart(generateEmptyDashboardItem(props.id, findFirstLinkedProvider(values.linkedProviders)))
                } else {
                    actions.setThisChart(data as DashboardItemType)
                }

                actions.setOpen(false)

                return data
            },
            deleteThisChart: async (_, breakpoint) => {
                await breakpoint(100)

                const {error} = await supabase
                    .from(SupabaseTable.DashboardItems)
                    .delete()
                    .eq('id', props.id)

                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                return null
            }
        }
    })),
    reducers(() => ({
        localChart: {
            setLocalChart: (lastChart, {chart}) => merge({}, lastChart, chart),
            setOpen: () => ({})
        },
        open: {
            setOpen: (_, {open}) => open
        },
        lastSyncedChart: {
            setLastSyncedChart: (_, {lastSyncedChart}) => lastSyncedChart
        },
    })),
    listeners(({actions, props, values}) => ({
        setThisChart: ({chart}) => {
            actions.setChart({
                ...chart,
                id: props.id
            })
        },
        // debounced save on changing layout
        setCharts: async ({changedItemIds}, breakpoint) => {
            if (changedItemIds.has(props.id)) {
                actions.saveThisChart(false)
            }
            breakpoint()
        },
        // Handles loading states
        deleteThisChart: () => {
            actions.setChildChartsLoading(props.id, true)
        },
        deleteThisChartSuccess: () => {
            actions.setCharts(values.charts.filter(chart => chart.id !== props.id), new Set())
            actions.setChildChartsLoading(props.id, false)
        },
        deleteThisChartFailure: () => {
            actions.setChildChartsLoading(props.id, false)
        },
        saveThisChart: () => {
            actions.setChildChartsLoading(props.id, true)
        },
        saveThisChartSuccess: () => {
            actions.setChildChartsLoading(props.id, false)
        },
        saveThisChartFailure: () => {
            actions.setChildChartsLoading(props.id, false)
        }
    })),
    selectors(() => ({
        isDemoDashboard: [
            () => [router.selectors.location],
            ({pathname}) => pathname.startsWith(urls.demo_dashboard())
        ],
        isNew: [
            () => [(_, props) => props.id, (_, props) => props.dashboardProps.newDashboardItemId],
            (thisId, newDashboardItemId) => thisId === newDashboardItemId
        ],
        thisChart: [
            (s) => [s.charts, (_, props) => props.id],
            (charts, thisId): DashboardItemType => charts.find(({id}) => id === thisId) as DashboardItemType
        ],
        localMergedChart: [
            (s) => [s.thisChart, s.localChart],
            (thisChart, localChart): DashboardItemType => merge({}, thisChart, localChart)
        ],
        parsedWorkbookId: [
            (s) => [s.localMergedChart],
            (localMergedChart) => {
                return parseWorkbookUrlAndGetId(localMergedChart.data.srcProvider, localMergedChart.data.srcUrl)
            }
        ],
        parsedRange: [
            (s) => [s.localMergedChart],
            (localMergedChart) => {
                const range = localMergedChart?.data?.dataRange
                const sheetAndRange = range?.split("!")
                const sheet = sheetAndRange?.[0]?.replace(/^'+|'+$/g, '')
                const parsedRange = sheetAndRange?.[1]

                if (!sheet || !parsedRange) {
                    return {
                        sheet: null,
                        range: null
                    }
                }

                return {
                    sheet,
                    range: parsedRange
                }
            }
        ],
        syncable: [
            (s) => [s.user, s.parsedRange, s.parsedWorkbookId],
            (user: User, parsedRange: { sheet: string; range: string; }, parsedWorkbookId: string) => {
                return user && parsedRange.sheet && parsedRange.range && parsedWorkbookId
            }
        ],
        synced: [
            (s) => [s.lastSyncedChart, s.localMergedChart],
            (lastSyncedChart, localMergedChart) => equal(pick(lastSyncedChart?.data, ["srcUrl", "dataRange", "srcProvider"]), pick(localMergedChart?.data, ["srcUrl", "dataRange", "srcProvider"]))
        ],
    })),
    afterMount(({props, actions}) => {
        if (props.autoSync || router.values.location.pathname.startsWith(urls.demo_dashboard())) {
            actions.fetchData({})
        }
    })
])