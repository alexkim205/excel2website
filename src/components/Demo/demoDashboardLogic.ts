import {DashboardItemType, DashboardType, Provider, PublishStatus} from "../../utils/types";
import {
    actions,
    connect,
    defaults,
    kea,
    key,
    listeners,
    path,
    props,
    reducers,
    selectors
} from "kea";
import {DeepPartial} from "kea-forms/lib/types";
import {Layout, Layouts} from "react-grid-layout";
import merge from "lodash.merge";
import {loaders} from "kea-loaders";
import {generateEmptyDashboardItem} from "../../utils/utils";
import pick from "lodash.pick";
import equal from "lodash.isequal";
import type {demoDashboardLogicType} from "./demoDashboardLogicType";
import {demoData} from "./demo.data";
import {userLogic} from "../../logics/userLogic";

export interface DemoDashboardLogicProps {
    id: DashboardType["id"]
    newDashboardItemId?: DashboardItemType["id"] // keep track of new item id at top level
}

export const demoDashboardLogic = kea<demoDashboardLogicType>([
    props({} as DemoDashboardLogicProps),
    path((key) => ["src", "logics", "dashboardLogic", key]),
    key((props) => props.id),
    connect({
       actions: [userLogic, ["setUser", "signOut"]]
    }),
    defaults(({props}) => ({
        dashboard: demoData.dashboard as DashboardType | null,
        charts: [{
            id: props.newDashboardItemId,
            dashboard: props.id,
            data: generateEmptyDashboardItem(props.newDashboardItemId as string, Provider.Azure, "https://onedrive.live.com/edit.aspx?resid=demo"),
            created_at: null
        }, ...demoData.charts] as DashboardItemType[],
        childChartsLoading: {} as Record<DashboardItemType["id"], boolean>,
        publishStatus: PublishStatus.Online as PublishStatus,
    })),
    actions(() => ({
        setChart: (chart: DeepPartial<DashboardItemType>) => ({chart}),
        setCharts: (charts: DeepPartial<DashboardItemType>[], changedItemIds: Set<DashboardItemType["id"]>) => ({charts, changedItemIds}),
        setDashboard: (dashboard: DeepPartial<DashboardType>) => ({dashboard}),
        onLayoutChange: (layouts: Layouts) => ({layouts}),
        setChildChartsLoading: (id: DashboardItemType["id"], loading: boolean) => ({id, loading})
    })),
    reducers(() => ({
        childChartsLoading: {
            setChildChartsLoading: (prev, {id, loading}) => merge({}, prev, {[id]: loading})
        }
    })),
    loaders(({values}) => ({
        dashboard: {
            setDashboard: ({dashboard}) => {
                return merge({}, values.dashboard, dashboard)
            },
            saveDashboard: () => {
                return values.dashboard
            }
        },
        charts: {
            setChart: ({chart}) => {
                return values.charts.map((thisChart) => thisChart.id === chart.id ? merge({}, thisChart, chart) : thisChart)
            },
            setCharts: ({charts}) => charts as DashboardItemType[],
        },
    })),
    listeners(({actions, values}) => ({
        onLayoutChange: ({layouts}) => {
            const keys = layouts.sm.map(({i}) => i)
            const stripDimension = (layout: Layout | undefined): Layout | undefined => layout ? pick(layout, ["h","w","x","y","i"]) : undefined
            const idToOldDimensions = Object.fromEntries(keys.map((i) => [i, {
                sm: stripDimension(values.layouts.sm.find(({i: thisI}) => thisI === i)),
                md: stripDimension(values.layouts.md.find(({i: thisI}) => thisI === i)),
                lg: stripDimension(values.layouts.lg.find(({i: thisI}) => thisI === i))
            }]))
            const idToNewDimensions = Object.fromEntries(keys.map((i) => [i, {
                sm: stripDimension(layouts.sm.find(({i: thisI}) => thisI === i)),
                md: stripDimension(layouts.md.find(({i: thisI}) => thisI === i)),
                lg: stripDimension(layouts.lg.find(({i: thisI}) => thisI === i))
            }]))
            const changedItemIds = keys.filter((key) => !equal(idToOldDimensions?.[key], idToNewDimensions?.[key]))

            actions.setCharts(values.charts.map((chart) => merge({}, chart, {data: {coordinates: idToNewDimensions?.[chart.id] ?? chart.data.coordinates}})), new Set(changedItemIds))
        },
        setDashboard: () => {
            actions.saveDashboard()
        }
    })),
    selectors(() => ({
        layouts: [
            (s) => [s.charts],
            (charts) => {
                return {
                    sm: charts.map(chart => ({...chart.data.coordinates.sm, i: chart.id})),
                    md: charts.map(chart => ({...chart.data.coordinates.md, i: chart.id})),
                    lg: charts.map(chart => ({...chart.data.coordinates.lg, i: chart.id}))
                }
            }
        ],
        saving: [
            (s) => [s.dashboardLoading, s.childChartsLoading],
            (dashboardLoading, childChartsLoading) => {
                return dashboardLoading || Object.values(childChartsLoading).some(b=>!!b)
            }
        ]
    }))
])