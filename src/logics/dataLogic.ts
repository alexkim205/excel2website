import {actions, connect, defaults, kea, key, listeners, path, props, reducers, selectors} from "kea";
import type { dataLogicType } from "./dataLogicType";
import {dataLayerLogic} from "./dataLayerLogic";
import {ChartType} from "../types";

export interface DataLogicProps {
    id: ChartType["id"]
}

export const dataLogic = kea<dataLogicType>([
    key((props) => props.id),
    path((key) => ["src", "dataLogic", key]),
    props({} as DataLogicProps),
    connect(() => ({
        values: [dataLayerLogic, ["charts"]],
        actions: [dataLayerLogic, ["setChart"]]
    })),
    defaults(() => ({
        open: false as boolean,
    })),
    actions(()=> ({
        setOpen: (open: boolean) => ({open}),
        setThisChart: (chart: Partial<ChartType>) => ({chart})
    })),
    reducers(() => ({
        open: {
            setOpen: (_,{open}) => open
        },
    })),
    listeners(({actions, props}) => ({
        setThisChart: ({chart}) => {
            actions.setChart({
                ...chart,
                id: props
            })
        }
    })),
    selectors(() => ({
        thisChart: [
            (s) => [s.charts, (_, props) => props.id],
            (charts, thisId) => charts.find(({id}) => id === thisId) ?? null
        ]
    }))
])