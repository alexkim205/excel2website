import clsx from "clsx";
import {dataLogic, DataLogicProps} from "../../logics/dataLogic";
import {useEffect, useRef} from "react";
import {getInstanceByDom, init} from "echarts";
import {useValues} from "kea";
import {ECBasicOption} from "echarts/types/dist/shared";
import {graphTypeToOptions} from "./graph";

export function ChartEdit({props}: { props: DataLogicProps }) {
    const logic = dataLogic(props)
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
            const option = graphTypeToOptions[thisChart.type](data, thisChart)
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
        if (chart && thisChart.type) {
            const option = graphTypeToOptions[thisChart.type](data, thisChart)
            console.log("option", option)
            chart.clear()
            chart.setOption(option as ECBasicOption);
        }
    }, [thisChart.chart, thisChart.type])

    // useEffect(() => {
    //     if (!ref.current || !data) {
    //         return
    //     }
    //     const chart = getInstanceByDom(ref.current)
    //     if (chart) {
    //         const option = graphTypeToOptions[thisChart.type](data, thisChart)
    //         chart.clear()
    //         chart.setOption(option as ECBasicOption);
    //     }
    // }, [thisChart?.type])

    return (
        <div id={`${props.id}-chart`} ref={ref} className={
            clsx("rounded-small w-full transition-background transition-colors",
                !data && "flex justify-center items-center text-lg text-gray-400"
            )
        } style={{height: data ? 500 : 300}}>
            {!data && (
                <span>Sync data above to preview the chart.</span>
            )}
        </div>
    )
}