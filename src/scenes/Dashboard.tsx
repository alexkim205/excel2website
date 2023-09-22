import {DashboardItem, NewDashboardItem} from "../components/DashboardItem";
import {Grid} from "../components/Grid/Grid";
import {useValues} from "kea";
import {dashboardLogic, DashboardLogicProps} from "../logics/dashboardLogic";
import {useMemo} from "react";
import {v4 as uuidv4} from "uuid";

export function Dashboard({props}: { props: DashboardLogicProps }) {
    const newUUID = useMemo(() => uuidv4(), [])
    const {charts, layouts} = useValues(dashboardLogic({...props, newDashboardItemId: newUUID}))

    return (
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
    )
}