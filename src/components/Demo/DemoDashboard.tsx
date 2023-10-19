import {useActions, useValues} from "kea";
import {A} from "kea-router";
import useCopy from "@react-hook/copy";
import {Button, Skeleton} from "@nextui-org/react";
import AutosizeInput from "react-input-autosize";
import {RiShareBoxLine} from "react-icons/ri";
import {toast} from "react-toastify";
import {RxLink2} from "react-icons/rx";
import {Grid} from "../Grid/Grid";
import {demoDashboardLogic} from "./demoDashboardLogic";
import {DashboardItem, NewDashboardItem} from "../DashboardItem";

function DemoDashboard() {
    const props = {
        id: "demo"
    }
    const newUUID = `${props.id}-new-item`
    const dashboardProps = {...props, newDashboardItemId: newUUID}
    const logic = demoDashboardLogic(dashboardProps)
    const {dashboard, charts, layouts, dashboardLoading} = useValues(logic)
    const {setDashboard, onLayoutChange} = useActions(logic)
    const linkToCopy = "https://demo.sheetstodashboard.com"
    const {copy} = useCopy(
        linkToCopy
    )

    return (
        <>
            <div id={`${dashboardProps.id}-dashboard-wrapper`} className="min-h-[calc(100vh-64px)] pt-12 flex flex-col w-full px-3 sm:gap-6 gap-4">
                <div className="max-w-[1024px] mx-auto px-6 flex flex-col sm:flex-row justify-between gap-4 w-full">
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
                    <div className="flex flex-row gap-3 self-end sm:flex-nowrap flex-wrap sm:self-start items-center">
                        {dashboardLoading && !dashboard ? (<></>) : (
                            <>
                                <Button
                                    color="default"
                                    variant="flat"
                                    className="text-base"
                                    size="md"
                                    as={A}
                                    target="_blank"
                                    href={linkToCopy}
                                    endContent={<RiShareBoxLine className="text-lg"/>}
                                >
                                    Preview
                                </Button>
                                {linkToCopy && (
                                    <Button
                                        isIconOnly
                                        color="default"
                                        variant="flat"
                                        size="md"
                                        onPress={async () => {
                                            await copy()
                                            toast.success("Copied to clipboard.")
                                        }}
                                    >
                                        <RxLink2 className="text-lg font-medium"/>
                                    </Button>
                                )}
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
        </>
    )
}

export default DemoDashboard