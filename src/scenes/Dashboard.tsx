import {DashboardItem, NewDashboardItem} from "../components/DashboardItem";
import {Grid} from "../components/Grid/Grid";
import {useActions, useValues} from "kea";
import {dashboardLogic, DashboardLogicProps} from "../logics/dashboardLogic";
import {useMemo} from "react";
import {v4 as uuidv4} from "uuid";
import AutosizeInput from 'react-input-autosize';

export function Dashboard({props}: { props: DashboardLogicProps }) {
    const newUUID = useMemo(() => uuidv4(), [])
    const logic = dashboardLogic({...props, newDashboardItemId: newUUID})
    const {dashboard, charts, layouts} = useValues(logic)
    const {setDashboard} = useActions(logic)

    return (
        <div id={`${props.id}-dashboard-wrapper`} className="flex flex-col w-full px-3 sm:gap-6 gap-4">
            <div className="flex flex-col gap-1">
                <AutosizeInput
                    name="dashboard-title-field"
                    value={dashboard?.data?.title}
                    placeholder="Name this dashboard"
                    inputStyle={{
                        fontWeight: 600,
                        fontSize: 30
                    }}
                    className="!bg-transparent px-3 outline-none focus:outline-none max-w-full overflow-hidden overflow-ellipsis placeholder:text-foreground-500 is-filled"
                    onChange={(event) => {
                        setDashboard({data: {title: event.currentTarget.value}})
                    }}
                />
                <AutosizeInput
                    name="dashboard-description-field"
                    value={dashboard?.data?.description}
                    placeholder="Description (optional)"
                    inputStyle={{
                        fontSize: 14
                    }}
                    className="!bg-transparent px-3 outline-none focus:outline-none max-w-full overflow-hidden overflow-ellipsis placeholder:text-foreground-500 is-filled"
                    onChange={(event) => {
                        setDashboard({data: {description: event.currentTarget.value}})
                    }}
                />
            </div>
            <Grid layouts={layouts}>
                {charts.map((chart) =>
                    <div key={chart.id} className="relative">
                        <DashboardItem key={chart.id} chart={chart} dashboardProps={props}/>
                    </div>
                )}
                <div key={newUUID} className="relative">
                    <NewDashboardItem newId={newUUID} dashboardProps={props}/>
                </div>
            </Grid>
        </div>
    )
}