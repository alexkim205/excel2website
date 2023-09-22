import {DashboardItem, NewDashboardItem} from "../components/DashboardItem";
import {Grid} from "../components/Grid/Grid";
import {useActions, useValues} from "kea";
import {dashboardLogic, DashboardLogicProps} from "../logics/dashboardLogic";
import AutosizeInput from 'react-input-autosize';
import {Button} from "@nextui-org/react";

export function Dashboard({props}: { props: DashboardLogicProps }) {
    const newUUID = `${props.id}-new-item`
    const dashboardProps = {...props, newDashboardItemId: newUUID}
    const logic = dashboardLogic(dashboardProps)
    const {dashboard, charts, layouts} = useValues(logic)
    const {setDashboard, onLayoutChange} = useActions(logic)

    console.log("CHATS", charts)

    return (
        <div id={`${dashboardProps.id}-dashboard-wrapper`} className="flex flex-col w-full px-3 sm:gap-6 gap-4">
            <div className="max-w-[1024px] mx-auto px-6 flex flex-row justify-between gap-4 w-full">
                <div className="flex flex-col gap-1">
                    <AutosizeInput
                        name="dashboard-title-field"
                        value={dashboard?.data?.title}
                        placeholder="Name this dashboard"
                        inputStyle={{
                            fontWeight: 600,
                            fontSize: 30
                        }}
                        className="!bg-transparent outline-none focus:outline-none max-w-full overflow-hidden overflow-ellipsis placeholder:text-foreground-500 is-filled"
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
                        className="!bg-transparent outline-none focus:outline-none max-w-full overflow-hidden overflow-ellipsis placeholder:text-foreground-500 is-filled"
                        onChange={(event) => {
                            setDashboard({data: {description: event.currentTarget.value}})
                        }}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <Button color="primary" size="md">
                        Save and publish
                    </Button>
                </div>
            </div>
            <Grid layouts={layouts} onLayoutChange={(layouts) => onLayoutChange(layouts)}>
                {charts.map((chart) => chart.id === newUUID
                    ? <div key={newUUID} className="relative">
                        <NewDashboardItem newId={newUUID} dashboardProps={dashboardProps}/>
                    </div>
                    : <div key={chart.id} className="relative">
                        <DashboardItem key={chart.id} chart={chart} dashboardProps={dashboardProps}/>
                    </div>
                )}
            </Grid>
        </div>
    )
}