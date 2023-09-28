import {actions, afterMount, connect, defaults, kea, key, listeners, path, props, reducers, selectors} from "kea";
import {dashboardLogic, DashboardLogicProps, graphFetch} from "./dashboardLogic";
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
import {generateEmptyDashboardItem} from "../utils/utils";
import merge from "lodash.merge";

export interface DashboardItemLogicProps {
    id: DashboardItemType["id"],
    dashboardProps: DashboardLogicProps
    autoSync?: boolean
}

export const dashboardItemLogic = kea<dashboardItemLogicType>([
    key((props) => `${props.dashboardProps.id}-${props.id}`),
    path((key) => ["src", "dataLogic", key]),
    props({autoSync: false} as DashboardItemLogicProps),
    connect((props: DashboardItemLogicProps) => ({
        values: [dashboardLogic(props.dashboardProps), ["charts"], userLogic, ["providerToken", "user"]],
        actions: [dashboardLogic(props.dashboardProps), ["setChart", "loadCharts", "setCharts", "setChildChartsLoading"], userLogic, ["signOut", "refreshToken"]]
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
                if (!values.syncable || !values.user) {
                    return
                }
                await breakpoint(100)
                const response = await graphFetch({
                    url: `items/${values.localMergedChart.data.dataSourceId}/workbook/worksheets/${values.parsedRange.sheet}/range(address='${values.parsedRange.range}')`,
                    method: "GET",
                    providerToken: values.providerToken,
                })
                const data = await response.json()
                breakpoint()
                if (response.status === 401) {
                    actions.refreshToken()
                    return
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
                await breakpoint(100)
                // generate new id if this is a new dashboard item
                const newId = values.isNew ? uuidv4() : props.id
                const findNewCoordinates = (size: "sm" | "md" | "lg") => values.isNew ? {
                    ...omit(values.localMergedChart.data.coordinates[size], ["static"]),
                    x: 0,
                    y: 0
                } : values.localMergedChart.data.coordinates[size]
                const {data, error} = await supabase
                    .from(SupabaseTable.DashboardItems)
                    .upsert({
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
                    }).select().maybeSingle()
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
                    actions.setThisChart(generateEmptyDashboardItem(props.id))
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
            (thisChart, localChart): DashboardItemType => merge({},thisChart, localChart)
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
            (s) => [s.providerToken, s.parsedRange, s.localMergedChart],
            (providerToken, parsedRange, localMergedChart) => {
                return providerToken && parsedRange.sheet && parsedRange.range && (localMergedChart?.data?.dataSourceId && localMergedChart.data.dataSourceId !== "null" && localMergedChart.data.dataSourceId != "undefined")
            }
        ],
        synced: [
            (s) => [s.lastSyncedChart, s.localMergedChart],
            (lastSyncedChart, localMergedChart) => equal(pick(lastSyncedChart?.data, ["dataSourceId", "dataRange"]), pick(localMergedChart?.data, ["dataSourceId", "dataRange"]))
        ],
    })),
    afterMount(({props, actions}) => {
        if (props.autoSync) {
            actions.fetchData({})
        }
    })
])