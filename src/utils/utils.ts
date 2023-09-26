import {ChartPresetType, DashboardDataType, DashboardItemDataType} from "./types";
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8)

export function isNumeric(str: any) {
    if (typeof str != "string") return false // we only process strings!
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function generateEmptyDashboardData(id: DashboardDataType["id"]): DashboardDataType {
    return {
        id,
        title: "",
        description: "",
    }
}

export function generateEmptyDashboardItem(id: DashboardItemDataType["id"]): DashboardItemDataType {
    return {
        id,
        type: ChartPresetType.BasicBar,
        dataSourceId: "",
        dataRange: "'Sheet1'!A1:B17",
        coordinates: {
            sm: {x: 0, y: 0, w: 3, h: 3, static: true},
            md: {x: 0, y: 0, w: 3, h: 3, static: true},
            lg: {x: 0, y: 0, w: 3, h: 3, static: true}
        },
        chart: {
            title: {
                text: "",
                subtext: "",
                textStyle: {
                    fontSize: 24
                },
                subtextStyle: {
                    fontSize: 16
                }
            },
            legend: {
              show: true
            },
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

export function generateDashboardSubdomain(): string {
    return nanoid()
}