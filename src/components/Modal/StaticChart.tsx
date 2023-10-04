import {publicDashboardItemLogic, PublicDashboardItemLogicProps} from "../../logics/publicDashboardItemLogic";
import {useValues} from "kea";
import {useEffect, useRef} from "react";
import echarts from "../../utils/echarts";
import {graphTypeToOptions} from "./graph";
import {ECBasicOption} from "echarts/types/dist/shared";
import pick from "lodash.pick";
import clsx from "clsx";
import {Spinner} from "@nextui-org/react";

export interface StaticChartProps {
    props: PublicDashboardItemLogicProps,
}

function StaticChart({props}: StaticChartProps) {
    const logic = publicDashboardItemLogic(props)
    const thisChart = props.chart
    const {data, dataLoading} = useValues(logic)

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Update chart
        if (ref.current) {
            const chart = echarts.getInstanceByDom(ref.current);
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
            const chart = echarts.init(ref.current);
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
        const chart = echarts.getInstanceByDom(ref.current)
        if (chart && thisChart.data.type) {
            const option = graphTypeToOptions[thisChart.data.type](data, thisChart.data)
            chart.clear()
            chart.setOption(option as ECBasicOption);
        }
    }, [JSON.stringify(thisChart.data.chart), JSON.stringify(thisChart.data.type)])

    return (
        <div id={`${props.chart.id}-chart`} ref={ref} className={
            clsx("rounded-small w-full transition-background transition-colors py-4 px-2 bg-white",
                data ? "h-full" : "flex grow justify-center items-center text-base text-default-400 h-auto",
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

export default StaticChart