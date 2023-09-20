import {actions, connect, defaults, kea, key, listeners, path, props, reducers, selectors} from "kea";
import type { dataLogicType } from "./dataLogicType";
import {dataLayerLogic, graphFetch} from "./dataLayerLogic";
import {ChartType, DataType} from "../types";
import {userLogic} from "./userLogic";
import {loaders} from "kea-loaders";
import {DeepPartial} from "kea-forms";

export interface DataLogicProps {
    id: ChartType["id"]
}

export const dataLogic = kea<dataLogicType>([
    key((props) => props.id),
    path((key) => ["src", "dataLogic", key]),
    props({} as DataLogicProps),
    connect(() => ({
        values: [dataLayerLogic, ["charts"], userLogic, ["providerToken"]],
        actions: [dataLayerLogic, ["setChart"]]
    })),
    defaults(() => ({
        open: false as boolean,
        data: null as DataType | null
    })),
    actions(()=> ({
        setOpen: (open: boolean) => ({open}),
        setThisChart: (chart: DeepPartial<ChartType>) => ({chart}),
    })),
    loaders(({values}) => ({
        data: {
            fetchData: async (_, breakpoint) => {
                // Make api call
                if(!values.providerToken || !values.parsedRange.sheet || !values.parsedRange.range || !values.thisChart?.dataSourceId) {
                    return
                }
                await breakpoint(100)
                const response = await graphFetch({
                    url: `items/${values.thisChart.dataSourceId}/workbook/worksheets/${values.parsedRange.sheet}/range(address='${values.parsedRange.range}')`,
                    method: "GET",
                    providerToken: values.providerToken,
                })
                const data = await response.json()
                breakpoint()
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
        thisChart: [
            (s) => [s.charts, (_, props) => props.id],
            (charts, thisId): ChartType => charts.find(({id}) => id === thisId) as ChartType
        ],
        parsedRange: [
            (s) => [s.thisChart],
            (thisChart) => {
                const range = thisChart?.dataRange
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
                return providerToken && parsedRange.sheet && parsedRange.range && (thisChart?.dataSourceId && thisChart.dataSourceId !== "null" && thisChart.dataSourceId != "undefined")
            }
        ]
    }))
])