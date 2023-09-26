import clsx from "clsx";
import {dashboardItemLogic, DashboardItemLogicProps} from "../../logics/dashboardItemLogic";
import {useEffect, useRef} from "react";
import {getInstanceByDom, init} from "echarts";
import {useValues} from "kea";
import {ECBasicOption} from "echarts/types/dist/shared";
import {graphTypeToOptions} from "./graph";
import pick from "lodash.pick";
import {Spinner} from "@nextui-org/react";
import {publicDashboardItemLogic, PublicDashboardItemLogicProps} from "../../logics/publicDashboardItemLogic";

export interface ChartProps {
    props: DashboardItemLogicProps,
    className?: string
}

export function Chart({props, className}: ChartProps) {
    const logic = dashboardItemLogic(props)
    const {open, localMergedChart, dataLoading, data} = useValues(logic)

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Update chart
        if (ref.current) {
            const chart = getInstanceByDom(ref.current);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            if (dataLoading) {
                chart?.showLoading()
            } else {
                chart?.hideLoading()
            }
        }
    }, [dataLoading]);

    useEffect(() => {
        if (ref.current && data) {
            const chart = init(ref.current);
            const option = graphTypeToOptions[localMergedChart.data.type](data, localMergedChart.data)
            chart.setOption(option as ECBasicOption);

            // Add chart resize listener
            // ResizeObserver is leading to a bit janky UX
            // eslint-disable-next-line no-inner-declarations
            function resizeChart() {
                chart?.resize();
            }

            window.addEventListener("resize", resizeChart);

            // Return cleanup function
            return () => {
                chart?.dispose();
                window.removeEventListener("resize", resizeChart);
            };
        }
    }, [ref.current, open, data, JSON.stringify([
        pick(localMergedChart.data.coordinates.sm, ["w", "h"]),
        pick(localMergedChart.data.coordinates.md, ["w", "h"]),
        pick(localMergedChart.data.coordinates.lg, ["w", "h"])
    ])])

    useEffect(() => {
        if (!ref.current || !data) {
            return
        }
        const chart = getInstanceByDom(ref.current)
        if (chart && localMergedChart.data.type) {
            const option = graphTypeToOptions[localMergedChart.data.type](data, localMergedChart.data)
            chart.clear()
            chart.setOption(option as ECBasicOption);
        }
    }, [JSON.stringify(localMergedChart.data.chart), JSON.stringify(localMergedChart.data.type)])

    return (
        <div id={`${props.id}-chart`} ref={ref} className={
            clsx("rounded-small w-full transition-background transition-colors py-4 px-2 bg-white",
                data ? "sm:h-full h-[400px]" : "flex grow justify-center items-center text-base text-default-400 h-auto",
                className
            )
        }>
            {dataLoading ? (
                <Spinner size="lg" color="default"/>
            ) : !data && (
                <span className="h-40 flex justify-center items-center">Sync data preview the chart.</span>
            )}
        </div>
    )
}

export interface StaticChartProps {
    props: PublicDashboardItemLogicProps,
    className?: string
}

export function StaticChart({props, className}: StaticChartProps) {
    const logic = publicDashboardItemLogic(props)
    const thisChart = props.chart
    const {data, dataLoading} = useValues(logic)

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Update chart
        if (ref.current) {
            const chart = getInstanceByDom(ref.current);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            if (dataLoading) {
                chart?.showLoading()
            } else {
                chart?.hideLoading()
            }
        }
    }, [dataLoading]);

    useEffect(() => {
        if (ref.current && data) {
            const chart = init(ref.current);
            const option = graphTypeToOptions[thisChart.data.type](data, thisChart.data)
            chart.setOption(option as ECBasicOption);

            // Add chart resize listener
            // ResizeObserver is leading to a bit janky UX
            // eslint-disable-next-line no-inner-declarations
            function resizeChart() {
                chart?.resize();
            }

            window.addEventListener("resize", resizeChart);

            // Return cleanup function
            return () => {
                chart?.dispose();
                window.removeEventListener("resize", resizeChart);
            };
        }
    }, [ref.current, data, JSON.stringify([
        pick(thisChart.data.coordinates.sm, ["w", "h"]),
        pick(thisChart.data.coordinates.md, ["w", "h"]),
        pick(thisChart.data.coordinates.lg, ["w", "h"])
    ])])

    useEffect(() => {
        if (!ref.current || !data) {
            return
        }
        const chart = getInstanceByDom(ref.current)
        if (chart && thisChart.data.type) {
            const option = graphTypeToOptions[thisChart.data.type](data, thisChart.data)
            chart.clear()
            chart.setOption(option as ECBasicOption);
        }
    }, [JSON.stringify(thisChart.data.chart), JSON.stringify(thisChart.data.type)])

    return (
        <div id={`${props.chart.id}-chart`} ref={ref} className={
            clsx("rounded-small w-full transition-background transition-colors py-4 px-2 bg-white",
                data ? "sm:h-full h-[400px]" : "flex grow justify-center items-center text-base text-default-400 h-auto",
                className
            )
        }>
            {dataLoading ? (
                <Spinner size="lg" color="default"/>
            ) : !data && (
                <span className="h-40 flex justify-center items-center">Sync data preview the chart.</span>
            )}
        </div>
    )
}