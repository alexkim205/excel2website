import {ChartPresetType, DashboardDataType, DashboardItemDataType} from "./types";

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
        selector: "",
        coordinates: {x: 0, y: 0, w: 3, h: 3},
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