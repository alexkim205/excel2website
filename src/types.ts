export enum AxisType {
    Value = 'value',
    Category = 'category',
    Time = 'time',
    Log = 'log'
}

export interface ChartType {
    id: string
    type: ChartPresetType
    dataSourceId: string | undefined | null // data file id related to Microsoft Graph API
    dataRange: string | undefined // A1:C4
    selector: string // Sheet and range in this format, i.e. 'Sheet1'!A3:B9
    coordinates: {
        x: number,
        y: number,
        w: number,
        h: number
    },
    chart: {
        title: {
            text: string,
            fontSize: number
        }
        description: string
        xAxis: {
            name: string
            type: AxisType | null
        }
        yAxis: {
            name: string
            type: AxisType | null
        }
    }
}

export enum ChartPresetType {
    BasicBar = "basic_bar",
    StackedBar = "stacked_bar",
    BasicLine = "basic_line",
    StackedLine = "stacked_line",
    AreaLine = "area_line",
    BasicPie = "basic_pie",
    RingPie = "ring_pie",
    BasicScatter = "basic_scatter"
}

export interface DataType {
    values: (string | number)[][]
}

export interface WorkbookType {
    id: string
    lastModifiedDateTime: string
    createdDateTime: string,
    name: string
}