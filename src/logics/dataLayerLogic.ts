import {afterMount, connect, defaults, kea, listeners, path} from "kea";
import {loaders} from "kea-loaders";
import {userLogic} from "./userLogic";
import type { dataLayerLogicType } from "./dataLayerLogicType";
import {ChartType, WorkbookType} from "../types";
import merge from "lodash.merge"

function graphFetch({url = "", method = "GET", providerToken, body}: {url: string, method?: "GET" | "POST", providerToken: string, body?: Record<string, any>}) {
    return fetch(`https://graph.microsoft.com/v1.0/me/drive/${url}`, {
        method,
        headers: new Headers({
            Authorization: `Bearer ${providerToken}`,
            Host: "graph.microsoft.com"
        }),
        body: JSON.stringify(body)
    })
}

export const dataLayerLogic = kea<dataLayerLogicType>([
    path(["src", "logics", "apiLogic"]),
    connect(() => ({
        values: [userLogic, ["providerToken"]],
        actions: [userLogic, ["setUser"]]
    })),
    defaults(() => ({
        charts: [{id: 0, dataSourceId: "", selector: ""}] as ChartType[],
        workbooks: [] as WorkbookType[],
    })),
    loaders(({values}) => ({
        charts: {
            setChart: ({chart}) => {
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
    })
])