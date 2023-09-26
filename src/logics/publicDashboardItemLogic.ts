import {afterMount, defaults, kea, key, path, props} from "kea";
import {DashboardItemType, DashboardType, DataType} from "../utils/types";
import type {publicDashboardItemLogicType} from "./publicDashboardItemLogicType";
import {loaders} from "kea-loaders";
import supabase from "../utils/supabase";

export interface PublicDashboardItemLogicProps {
    chart: DashboardItemType,
    dashboard: DashboardType
}
export const publicDashboardItemLogic = kea<publicDashboardItemLogicType>([
    path((key) => ["src", "logics", "publicDashboardItemLogic", key]),
    props({} as PublicDashboardItemLogicProps),
    key((props) => `static-${props.dashboard.id}-${props.chart.id}`),
    defaults({
        data: null as DataType | null,
    }),
    loaders(({props}) => ({
        data: {
            fetchData: async (_, breakpoint) => {
                // Make api call
                await breakpoint(100)
                const {data, error} = await supabase.functions.invoke('fetch-chart-data', {
                    body: {
                        chart: props.chart
                    }
                })
                if (error) {
                    throw new Error(error.message)
                }
                return data
            }
        },
    })),
    afterMount(({actions}) => {
        actions.fetchData({})
    })
])