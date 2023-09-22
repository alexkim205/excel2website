import {AxisType, ChartPresetType, DashboardItemDataType, DataType} from "../../utils/types";
import type {ECBasicOption} from "echarts/types/dist/shared";
import {
    MdAreaChart,
    MdDonutLarge,
    MdOutlineBarChart,
    MdPieChart,
    MdScatterPlot,
    MdShowChart,
    MdSsidChart,
    MdStackedBarChart
} from "react-icons/md";
import dayjs from "dayjs";
import {isNumeric} from "../../utils/utils";

const EXPECTED_DATA_MULTI_SERIES = [
    ["X-Axis Unit", "Series A", "Series B", "Series C", "Series D"],
    [0, 350, 450, 345, 434],
    [1, 345, 330, 500, 343],
    [2, 453, 434, 664, 523],
    [3, 653, 309, 453, 504],
    [4, 567, 406, 236, 321],
]

// For pie and funnel graphs
const EXPECTED_DATA_SINGLE_SERIES = [
    ["Category", "Value"],
    ["Apple", 350],
    ["Grapes", 345],
    ["Pineapples", 453],
    ["Oranges", 653],
    ["Bananas", 567],
]

export const graphTypeTabs = {
    [ChartPresetType.BasicBar]: {
        id: ChartPresetType.BasicBar,
        label: "Bar",
        Icon: MdOutlineBarChart,
        expectedData: EXPECTED_DATA_MULTI_SERIES
    },
    [ChartPresetType.StackedBar]: {
        id: ChartPresetType.StackedBar,
        label: "Stacked Bar",
        Icon: MdStackedBarChart,
        expectedData: EXPECTED_DATA_MULTI_SERIES
    },
    [ChartPresetType.BasicLine]: {
        id: ChartPresetType.BasicLine,
        label: "Line",
        Icon: MdShowChart,
        expectedData: EXPECTED_DATA_MULTI_SERIES
    },
    [ChartPresetType.StackedLine]: {
        id: ChartPresetType.StackedLine,
        label: "Stacked Line",
        Icon: MdSsidChart,
        expectedData: EXPECTED_DATA_MULTI_SERIES
    },
    [ChartPresetType.AreaLine]: {
        id: ChartPresetType.AreaLine,
        label: "Area Line",
        Icon: MdAreaChart,
        expectedData: EXPECTED_DATA_MULTI_SERIES
    },
    [ChartPresetType.BasicPie]: {
        id: ChartPresetType.BasicPie,
        label: "Pie",
        Icon: MdPieChart,
        expectedData: EXPECTED_DATA_SINGLE_SERIES
    },
    [ChartPresetType.RingPie]: {
        id: ChartPresetType.RingPie,
        label: "Ring Pie",
        Icon: MdDonutLarge,
        expectedData: EXPECTED_DATA_SINGLE_SERIES
    },
    [ChartPresetType.BasicScatter]: {
        id: ChartPresetType.BasicScatter,
        label: "Scatter",
        Icon: MdScatterPlot,
        expectedData: EXPECTED_DATA_MULTI_SERIES
    }
}

export function determineAxisType(source: (string | number)[]): AxisType {
    if (source.every(item => isNumeric(String(item)))) {
        return AxisType.Value
    }
    if (source.every(item => dayjs(item).isValid())) {
        return AxisType.Time
    }
    return AxisType.Category
}

export const graphTypeToOptions: Record<ChartPresetType, (data: DataType, chart: DashboardItemDataType) => ECBasicOption | null> = {
    [ChartPresetType.BasicBar]: (data, chart) => {
        const seriesNames = data.values?.[0]?.slice(1)
        return {
            title: {
                ...chart.chart.title,
                left: 'center',
                padding: 0
            },
            grid: {
                top: 70
            },
            tooltip: {},
            legend: {
                data: seriesNames,
                orient: 'vertical',
                right: 10,
                top: 'center'
            },
            dataset: {
                source: data.values,
                sourceHeader: true,
            },
            xAxis: {
                ...chart.chart.xAxis,
                nameLocation: "middle",
                type: chart.chart.xAxis.type ?? determineAxisType(data.values.slice(1)?.map(arr => arr?.[0])),
                nameGap: 30,
            },
            yAxis: {
                ...chart.chart.yAxis,
                nameLocation: "middle",
                nameGap: 30
            },
            series: seriesNames.map((seriesName) => ({
                type: 'bar',
                name: seriesName,
                encode: {x: data.values?.[0]?.[0], y: seriesName}
            }))
        }
    },
    [ChartPresetType.StackedBar]: (data, chart) => {
        const seriesNames = data.values?.[0]?.slice(1)
        return {
            title: {
                ...chart.chart.title,
                left: 'center',
                padding: 0
            },
            grid: {
                top: 70
            },
            tooltip: {},
            legend: {
                data: seriesNames,
                orient: 'vertical',
                right: 10,
                top: 'center'
            },
            dataset: {
                source: data.values,
                sourceHeader: true,
            },
            xAxis: {
                ...chart.chart.xAxis,
                nameLocation: "middle",
                type: "category", // stacked bar only works with x axis categories
                nameGap: 30,
            },
            yAxis: {
                ...chart.chart.yAxis,
                nameLocation: "middle",
                type: "value",
                nameGap: 30
            },
            series: seriesNames.map((seriesName) => ({
                name: seriesName,
                type: 'bar',
                stack: 'total',
                encode: {
                    x: data.values?.[0]?.[0],
                    y: seriesName,
                },
            }))
        }
    },
    [ChartPresetType.BasicLine]: (data, chart) => {
        const seriesNames = data.values?.[0]?.slice(1)
        return {
            title: {
                ...chart.chart.title,
                left: 'center',
                padding: 0
            },
            grid: {
                top: 70
            },
            tooltip: {},
            legend: {
                data: seriesNames,
                orient: 'vertical',
                right: 10,
                top: 'center'
            },
            dataset: {
                source: data.values,
                sourceHeader: true,
            },
            xAxis: {
                ...chart.chart.xAxis,
                type: chart.chart.xAxis.type ?? determineAxisType(data.values.slice(1)?.map(arr => arr?.[0])),
                nameLocation: "middle",
                nameGap: 30,
            },
            yAxis: {
                ...chart.chart.yAxis,
                nameLocation: "middle",
                nameGap: 30
            },
            series: seriesNames.map((seriesName) => ({
                type: 'line',
                name: seriesName,
                encode: {x: data.values?.[0]?.[0], y: seriesName}
            }))
        }
    },
    [ChartPresetType.StackedLine]: (data, chart) => {
        const seriesNames = data.values?.[0]?.slice(1)
        return {
            title: {
                ...chart.chart.title,
                left: 'center',
                padding: 0
            },
            grid: {
                top: 70
            },
            tooltip: {},
            legend: {
                data: seriesNames,
                orient: 'vertical',
                right: 10,
                top: 'center'
            },
            dataset: {
                source: data.values,
                sourceHeader: true,
            },
            xAxis: {
                ...chart.chart.xAxis,
                type: "category", // stacked bar only works with x axis categories
                nameLocation: "middle",
                nameGap: 30,
            },
            yAxis: {
                ...chart.chart.yAxis,
                nameLocation: "middle",
                nameGap: 30
            },
            series: seriesNames.map((seriesName) => ({
                type: 'line',
                stack: true,
                name: seriesName,
                encode: {x: data.values?.[0]?.[0], y: seriesName}
            }))
        }
    },
    [ChartPresetType.AreaLine]: (data, chart) => {
        const seriesNames = data.values?.[0]?.slice(1)
        return {
            title: {
                ...chart.chart.title,
                left: 'center',
                padding: 0
            },
            grid: {
                top: 70
            },
            tooltip: {},
            legend: {
                data: seriesNames,
                orient: 'vertical',
                right: 10,
                top: 'center'
            },
            dataset: {
                source: data.values,
                sourceHeader: true,
            },
            xAxis: {
                ...chart.chart.xAxis,
                type: chart.chart.xAxis.type ?? determineAxisType(data.values.slice(1)?.map(arr => arr?.[0])),
                nameLocation: "middle",
                nameGap: 30,
            },
            yAxis: {
                ...chart.chart.yAxis,
                nameLocation: "middle",
                nameGap: 30
            },
            series: seriesNames.map((seriesName) => ({
                type: 'line',
                name: seriesName,
                areaStyle: {
                    opacity: 0.1
                },
                encode: {x: data.values?.[0]?.[0], y: seriesName}
            }))
        }
    },
    [ChartPresetType.BasicPie]: (data, chart) => {
        const datasetSource = data.values?.map((arr) => [String(arr[0]), arr[1]])
        return {
            title: {
                ...chart.chart.title,
                left: 'center',
                padding: 0
            },
            grid: {
                top: 120,
            },
            tooltip: {},
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center'
            },
            dataset: {
                source: datasetSource,
                sourceHeader: true,
            },
            series: {
                type: 'pie',
                radius: ['0%','70%']
            }
        }
    },
    [ChartPresetType.RingPie]: (data, chart) => {
        const datasetSource = data.values?.map((arr) => [String(arr[0]), arr[1]])
        return {
            title: {
                ...chart.chart.title,
                left: 'center',
                padding: 0
            },
            grid: {
                top: 120,
            },
            tooltip: {},
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center'
            },
            dataset: {
                source: datasetSource,
                sourceHeader: true,
            },
            series: {
                type: 'pie',
                radius: ['40%', '70%']
            }
        }
    },
    [ChartPresetType.BasicScatter]: (data, chart) => {
        const seriesNames = data.values?.[0]?.slice(1)
        return {
            title: {
                ...chart.chart.title,
                left: 'center',
                padding: 0
            },
            grid: {
                top: 70
            },
            tooltip: {},
            legend: {
                data: seriesNames,
                orient: 'vertical',
                right: 10,
                top: 'center'
            },
            dataset: {
                source: data.values,
                sourceHeader: true,
            },
            xAxis: {
                ...chart.chart.xAxis,
                type: chart.chart.xAxis.type ?? determineAxisType(data.values.slice(1)?.map(arr => arr?.[0])),
                nameLocation: "middle",
                nameGap: 30,
            },
            yAxis: {
                ...chart.chart.yAxis,
                nameLocation: "middle",
                nameGap: 30
            },
            series: seriesNames.map((seriesName) => ({
                type: 'scatter',
                name: seriesName,
                encode: {x: data.values?.[0]?.[0], y: seriesName}
            }))
        }
    },
}