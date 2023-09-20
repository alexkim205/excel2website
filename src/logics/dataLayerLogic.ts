import {actions, afterMount, connect, defaults, kea, listeners, path, selectors} from "kea";
import {loaders} from "kea-loaders";
import {userLogic} from "./userLogic";
import type {dataLayerLogicType} from "./dataLayerLogicType";
import {ChartPresetType, ChartType, WorkbookType} from "../types";
import merge from "lodash.merge"
import {DeepPartial} from "kea-forms";

export function graphFetch({url = "", method = "GET", providerToken, body}: {url: string, method?: "GET" | "POST", providerToken: string, body?: Record<string, any>}) {
    return fetch(`https://graph.microsoft.com/v1.0/me/drive/${url}`, {
        method,
        headers: new Headers({
            Authorization: `Bearer ${providerToken}`,
            Host: "graph.microsoft.com"
        }),
        body: JSON.stringify(body)
    })
}

function generateEmptyChart(id: ChartType["id"]): ChartType {
    return {
        id,
        type: ChartPresetType.StackedBar,
        dataSourceId: "",
        dataRange: "'Sheet1'!A1:B17",
        selector: "",
        coordinates: { x: 0, y: 0, w: 3, h: 3},
        chart: {
            title: {
                text: "",
                fontSize: 32
            },
            description: "",
            xAxis: {
                name: "",
                type: null
            },
            yAxis: {
                name: "",
                type: null
            },
        }
    }
}

export const dataLayerLogic = kea<dataLayerLogicType>([
    path(["src", "logics", "apiLogic"]),
    connect(() => ({
        values: [userLogic, ["providerToken"]],
        actions: [userLogic, ["setUser"]]
    })),
    defaults(() => ({
        charts: [generateEmptyChart("0")] as ChartType[],
        workbooks: [] as WorkbookType[],
    })),
    actions(() => ({
        setChart: (chart: DeepPartial<ChartType>) => ({chart})
    })),
    loaders(({values}) => ({
        charts: {
            setChart: ({chart}) => {
                console.log("THIS CHART", chart)
                return values.charts.map((thisChart) => thisChart.id === chart.id ? merge({}, thisChart, chart) : thisChart)
            }
        },
        workbooks: {
            loadWorkbooks: async (_, breakpoint) => {
                if(!values.providerToken) {
                    return values.workbooks
                }
                await breakpoint(1)
                const response = await graphFetch({url: "root/children", providerToken: values.providerToken})
                const data = await response.json()
                breakpoint()
                return data.value.filter(({name}:{name: string}) => name.endsWith(".xlsx")) ?? []
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
        if (values.providerToken) {
            actions.loadWorkbooks({})
        }
    }),
    selectors(() => ({
        layouts: [
            (s) => [s.charts],
            (charts) => ({
                sm: charts.map(chart => ({i: chart.id, ...chart.coordinates})),
                md: charts.map(chart => ({i: chart.id, ...chart.coordinates})),
                lg: charts.map(chart => ({i: chart.id, ...chart.coordinates})),
            })
        ],
    }))
])