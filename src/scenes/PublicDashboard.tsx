import {useValues} from "kea";
import {publicDashboardLogic} from "../logics/publicDashboardLogic";
import {Button, Link, Spinner} from "@nextui-org/react";
import {Grid} from "../components/Grid/Grid";
import {StaticDashboardItem} from "../components/DashboardItem";
import {BsFillFileEarmarkSpreadsheetFill} from "react-icons/bs";
import {RxHeartFilled} from "react-icons/rx";

export interface PublicDashboardProps {
    subdomain: string | null
}

function PublicDashboard({subdomain}: PublicDashboardProps) {
    const logicProps = {
        domain: subdomain
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
                        {dashboard?.data?.title || <span className="italic text-default-400">Untitled Dashboard</span>}
                    </h1>
                    <h1
                        id="dashboard-title-field"
                        className="text-small"
                    >
                        {dashboard?.data?.description}
                    </h1>
                </div>
                <Link
                    href={import.meta.env.DEV ? "http://localhost:5173/" : "https://www.sheetstodashboard.com"}
                    underline="none"
                    isExternal
                    showAnchorIcon
                    isBlock
                    size="sm"
                    className="whitespace-nowrap text-default-500 self-start hover:text-primary"
                    color="primary"
                >
                    Made with <BsFillFileEarmarkSpreadsheetFill className="text-sm text-green-700 ml-1.5 mr-1"/> SheetsToDashboard + <RxHeartFilled className="text-sm ml-1 text-red-500"/>
                </Link>
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

export default PublicDashboard