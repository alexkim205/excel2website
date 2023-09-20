import {AxisType, ChartPresetType, ChartType, DataType} from "../../types";
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
import {isNumeric} from "../../utils";

export const graphTypeTabs = [
    {
        id: ChartPresetType.BasicBar,
        label: "Bar",
        Icon: MdOutlineBarChart
    },
    {
        id: ChartPresetType.StackedBar,
        label: "Stacked Bar",
        Icon: MdStackedBarChart
    },
    {
        id: ChartPresetType.BasicLine,
        label: "Line",
        Icon: MdShowChart
    },
    {
        id: ChartPresetType.StackedLine,
        label: "Stacked Line",
        Icon: MdSsidChart
    },
    {
        id: ChartPresetType.AreaLine,
        label: "Area Line",
        Icon: MdAreaChart
    },
    {
        id: ChartPresetType.BasicPie,
        label: "Pie",
        Icon: MdPieChart
    },
    {
        id: ChartPresetType.RingPie,
        label: "Ring Pie",
        Icon: MdDonutLarge
    },
    {
        id: ChartPresetType.BasicScatter,
        label: "Scatter",
        Icon: MdScatterPlot
    },
]

export function determineAxisType(source: (string | number)[]): AxisType {
    if (source.every(item => isNumeric(String(item)))) {
        return AxisType.Value
    }
    if (source.every(item => dayjs(item).isValid())) {
        return AxisType.Time
    }
    return AxisType.Category
}

export const graphTypeToOptions: Record<ChartPresetType, (data: DataType, chart: ChartType) => ECBasicOption | null> = {
    [ChartPresetType.BasicBar]: (data, chart) => {
        const seriesNames = data.values?.[0]?.slice(1)
        return {
            title: chart.chart.title,
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
            title: chart.chart.title,
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
                    y : seriesName,
                },
            }))
        }
    },
    [ChartPresetType.BasicLine]: (data, chart) => {
        const seriesNames = data.values?.[0]?.slice(1)
        return {
            title: chart.chart.title,
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
            title: chart.chart.title,
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
            title: chart.chart.title,
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
    [ChartPresetType.BasicPie]: () => null,
    [ChartPresetType.RingPie]: () => null,
    [ChartPresetType.BasicScatter]: () => null
}