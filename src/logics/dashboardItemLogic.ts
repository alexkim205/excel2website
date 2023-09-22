import {actions, connect, defaults, kea, key, listeners, path, props, reducers, selectors} from "kea";
import {dashboardLogic, DashboardLogicProps, graphFetch} from "./dashboardLogic";
import {DashboardItemType, DataType, SupabaseTable} from "../utils/types";
import {userLogic} from "./userLogic";
import {loaders} from "kea-loaders";
import {DeepPartial} from "kea-forms/lib/types";
import supabase from "../utils/supabase";
import { v4 as uuidv4 } from 'uuid';
import type { dashboardItemLogicType } from "./dashboardItemLogicType";
import {generateEmptyDashboardItem} from "../utils/utils";

export interface DashboardItemLogicProps {
    id: DashboardItemType["id"],
    dashboardProps: DashboardLogicProps
}

export const dashboardItemLogic = kea<dashboardItemLogicType>([
    key((props) => `${props.dashboardProps.id}-${props.id}`),
    path((key) => ["src", "dataLogic", key]),
    props({} as DashboardItemLogicProps),
    connect((props: DashboardItemLogicProps) => ({
        values: [dashboardLogic(props.dashboardProps), ["charts"], userLogic, ["providerToken", "user"]],
        actions: [dashboardLogic(props.dashboardProps), ["setChart"]]
    })),
    defaults({
        open: false as boolean,
        data: null as DataType | null
    }),
    actions(()=> ({
        setOpen: (open: boolean) => ({open}),
        setThisChart: (chart: DeepPartial<DashboardItemType>) => ({chart}),
        saveThisChart: true
    })),
    loaders(({values}) => ({
        data: {
            fetchData: async (_, breakpoint) => {
                // Make api call
                if(!values.providerToken || !values.parsedRange.sheet || !values.parsedRange.range || !values.thisChart?.data?.dataSourceId) {
                    return
                }
                await breakpoint(100)
                const response = await graphFetch({
                    url: `items/${values.thisChart.data.dataSourceId}/workbook/worksheets/${values.parsedRange.sheet}/range(address='${values.parsedRange.range}')`,
                    method: "GET",
                    providerToken: values.providerToken,
                })
                const data = await response.json()
                breakpoint()
                return data
            }
        },
        chart: {
            saveThisChart: async(_, breakpoint) => {
                if (!values.dataSourceReadyForSync || !values.user) {
                    return
                }
                await breakpoint(100)
                const newId = values.thisChart.id === "new" ? uuidv4() : values.thisChart.id
                const {data, error} = await supabase
                    .from(SupabaseTable.DashboardItems)
                    .upsert({
                        id: newId,
                        data: {
                            ...values.thisChart,
                            id: newId
                        },
                        user: values.user?.user?.id
                    }).select()
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                console.log("SAVED, ", data)
                return data
            }
        }
    })),
    reducers(() => ({
        open: {
            setOpen: (_,{open}) => open
        },
    })),
    listeners(({actions, props}) => ({
        setThisChart: ({chart}) => {
            actions.setChart({
                ...chart,
                id: props.id
            })
        },
    })),
    selectors(() => ({
        existingChart: [
            (s) => [s.charts, (_, props) => props.id],
            (charts, thisId): DashboardItemType | null => charts.find(({id}) => id === thisId) ?? null
        ],
        thisChart: [
            (s) => [s.existingChart, (_, props) => props.id, (_, props) => props.dashboardProps, s.user],
            (existingChart: DashboardItemType | null, thisId: DashboardItemType["id"], dashboardProps: DashboardLogicProps, user: any): DashboardItemType => {
                if (existingChart) {
                    return existingChart
                }
                return {
                    id: thisId,
                    dashboard: dashboardProps.id,
                    user: user?.user?.id,
                    data: generateEmptyDashboardItem(thisId),
                    created_at: null
                }
            }
        ],
        parsedRange: [
            (s) => [s.thisChart],
            (thisChart) => {
                const range = thisChart?.data?.dataRange
                const sheetAndRange = range?.split("!")
                const sheet = sheetAndRange?.[0]?.replace(/^'+|'+$/g, '')
                const parsedRange = sheetAndRange?.[1]

                if(!sheet || !parsedRange) {
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
        dataSourceReadyForSync: [
            (s) => [s.providerToken, s.parsedRange, s.thisChart],
            (providerToken, parsedRange, thisChart) => {
                return providerToken && parsedRange.sheet && parsedRange.range && (thisChart?.data?.dataSourceId && thisChart.data.dataSourceId !== "null" && thisChart.data.dataSourceId != "undefined")
            }
        ],
    })),
])