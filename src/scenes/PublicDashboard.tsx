import {useValues} from "kea";
import {publicDashboardLogic} from "../logics/publicDashboardLogic";
import {Button, Link, Spinner} from "@nextui-org/react";
import {Grid} from "../components/Grid/Grid";
import {StaticDashboardItem} from "../components/DashboardItem";

export interface PublicDashboardProps {
    subdomain: string | null
}

export function PublicDashboard({subdomain}: PublicDashboardProps) {
    const logicProps = {
        id: subdomain
    }
    const {dashboard, dashboardLoading, layouts} = useValues(publicDashboardLogic(logicProps))

    if (dashboardLoading && !dashboard) {
        return (
            <div className="flex flex-col w-screen h-screen justify-center items-center">
                <Spinner size="lg"/>
            </div>
        )
    }

    if (!dashboardLoading && !dashboard) {
        return (
            <div className="flex flex-col gap-6 w-screen h-screen text-default-600 justify-center items-center">
                <h3 className="text-xl font-medium">Dashboard not found.</h3>
                <Button size="lg" color="primary" as={Link} href={import.meta.env.DEV ? "http://localhost:5173/" : "https://www.sheetstodashboard.com"}>Go back to Sheets To Dashboard</Button>
            </div>
        )
    }

    return (
        <div id={`${subdomain}-dashboard-wrapper`} className="flex flex-col w-full px-3 py-6 sm:gap-6 gap-4">
            <div className="max-w-[1024px] mx-auto px-6 flex flex-row justify-between gap-4 w-full">
                <div className="flex flex-col gap-2 w-full">
                    <h1
                        id="dashboard-title-field"
                        className="text-3xl font-bold"
                    >
                        {dashboard?.data?.title}
                    </h1>
                    <h1
                        id="dashboard-title-field"
                        className="text-small"
                    >
                        {dashboard?.data?.description}
                    </h1>
                </div>
            </div>
            <Grid layouts={layouts} isDraggable={false} isResizable={false} isDroppable={false}>
                {dashboard?.dashboard_items?.map((chart) => (
                    <div key={chart.id} className="relative">
                        <StaticDashboardItem chart={chart} dashboard={dashboard}/>
                    </div>
                ))}
            </Grid>
        </div>
    )
}