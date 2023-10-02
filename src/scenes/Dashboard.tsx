import {DashboardItem, NewDashboardItem} from "../components/DashboardItem";
import {Grid} from "../components/Grid/Grid";
import {useActions, useValues} from "kea";
import {dashboardLogic, DashboardLogicProps} from "../logics/dashboardLogic";
import AutosizeInput from 'react-input-autosize';
import {Button, Skeleton} from "@nextui-org/react";
import {RxGlobe} from "react-icons/rx";
import {publishModalLogic} from "../logics/publishModalLogic";
import {PublishModal} from "../components/Modal/PublishModal";
import {RiShareBoxLine} from "react-icons/ri";
import {A} from "kea-router";

export function Dashboard({props}: { props: DashboardLogicProps }) {
    const newUUID = `${props.id}-new-item`
    const dashboardProps = {...props, newDashboardItemId: newUUID}
    const publishModalProps = {id: props.id}
    const logic = dashboardLogic(dashboardProps)
    const publishLogic = publishModalLogic(publishModalProps)
    const {dashboard, charts, layouts, saving, dashboardLoading} = useValues(logic)
    const {setDashboard, onLayoutChange} = useActions(logic)
    const {setOpen} = useActions(publishLogic)

    console.log("SUBDOMAIN", dashboard?.subdomain ? import.meta.env.DEV ? `http://${dashboard.subdomain}.localhost:5173` : `${dashboard.subdomain}.sheetstodashboard.com` : undefined)

    return (
        <>
            <div id={`${dashboardProps.id}-dashboard-wrapper`} className="flex flex-col w-full px-3 sm:gap-6 gap-4">
                <div className="max-w-[1024px] mx-auto px-6 flex flex-row justify-between gap-4 w-full">
                    <div className="flex flex-col gap-1 w-full">
                        {dashboardLoading && !dashboard ? (
                            <>
                                <Skeleton className="rounded-lg w-3/5">
                                    <div className="h-[45px] rounded-lg bg-default-300"></div>
                                </Skeleton>
                                <Skeleton className="rounded-lg w-4/5">
                                    <div className="h-[21px] rounded-lg bg-default-300"></div>
                                </Skeleton>
                            </>
                        ) : (
                            <>
                                <AutosizeInput
                                    name="dashboard-title-field"
                                    value={dashboard?.data?.title}
                                    placeholder="Name this dashboard"
                                    inputStyle={{
                                        fontWeight: 700,
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
                            </>
                        )}
                    </div>
                    <div className="flex flex-row gap-4 self-start items-center">
                        {dashboardLoading && !dashboard ? (<></>) : (
                            <>
                                <div className="text-base text-default-400">{saving ? "Saving..." : "Saved"}</div>
                                <Button
                                    color="default"
                                    variant="flat"
                                    className="text-base"
                                    size="md"
                                    as={A}
                                    target="_blank"
                                    href={dashboard?.subdomain ? import.meta.env.DEV ? `http://${dashboard.subdomain}.localhost:5173` : `${dashboard.subdomain}.sheetstodashboard.com` : undefined}
                                    endContent={<RiShareBoxLine className="text-lg"/>}
                                >
                                    Preview
                                </Button>
                                <Button
                                    color="primary"
                                    className="font-medium text-base"
                                    size="md"
                                    endContent={<RxGlobe className="text-lg"/>}
                                    onPress={() => {
                                        setOpen(true)
                                    }}
                                >
                                    Publish
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="w-full max-w-[1600px] mx-auto px-[10px]">
                    <NewDashboardItem newId={newUUID} dashboardProps={dashboardProps}/>
                </div>
                <Grid layouts={layouts} onLayoutChange={(layouts) => onLayoutChange(layouts)}>
                    {charts.filter(({id}) => id !== newUUID).map((chart) => (
                        <div key={chart.id} className="relative">
                            <DashboardItem key={chart.id} chart={chart} dashboardProps={dashboardProps}/>
                        </div>
                    ))}
                </Grid>
            </div>
            <PublishModal props={publishModalProps}/>
        </>
    )
}