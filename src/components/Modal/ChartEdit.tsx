import clsx from "clsx";
import {dashboardItemLogic, DashboardItemLogicProps} from "../../logics/dashboardItemLogic";
import {useEffect, useRef} from "react";
import {getInstanceByDom, init} from "echarts";
import {useValues} from "kea";
import {ECBasicOption} from "echarts/types/dist/shared";
import {graphTypeToOptions} from "./graph";

export function ChartEdit({props}: { props: DashboardItemLogicProps }) {
    const logic = dashboardItemLogic(props)
    const {open, thisChart, dataLoading, data} = useValues(logic)

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
            console.log("option", option)
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
    }, [ref.current, open, data])

    useEffect(() => {
        if (!ref.current || !data) {
            return
        }
        const chart = getInstanceByDom(ref.current)
        if (chart && thisChart.data.type) {
            const option = graphTypeToOptions[thisChart.data.type](data, thisChart.data)
            console.log("option", option)
            chart.clear()
            chart.setOption(option as ECBasicOption);
        }
    }, [thisChart.data.chart, thisChart.data.type])

    return (
        <div id={`${props.id}-chart`} ref={ref} className={
            clsx("rounded-small w-full transition-background transition-colors p-4 bg-white",
                !data && "flex grow justify-center items-center text-base text-default-400"
            )
        } style={{height: data ? 500 : "auto"}}>
            {!data && (
                <span className="h-40 flex justify-center items-center">Sync data preview the chart.</span>
            )}
        </div>
    )
}