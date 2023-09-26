import {
    Button,
    Card,
    CardBody,
    Listbox,
    ListboxItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Spinner
} from "@nextui-org/react";
import {AiOutlinePlus} from "react-icons/ai";
import {useActions, useValues} from "kea";
import {dashboardItemLogic} from "../logics/dashboardItemLogic";
import {DashboardItemType} from "../utils/types";
import {DataSelectModal} from "./Modal/DataSelectModal";
import {forwardRef, useState} from "react";
import {RxDotsVertical, RxDragHandleDots2, RxPencil1, RxTrash} from "react-icons/rx";
import {DashboardLogicProps} from "../logics/dashboardLogic";
import {Chart, StaticChart} from "./Modal/Chart";
import clsx from "clsx";
import {PublicDashboardItemLogicProps} from "../logics/publicDashboardItemLogic";

export const DashboardItem = forwardRef<HTMLDivElement, {
    chart: DashboardItemType,
    dashboardProps: DashboardLogicProps
}>(({chart, dashboardProps}, ref) => {
    const logicProps = {id: chart.id, dashboardProps, autoSync: true}
    const logic = dashboardItemLogic(logicProps)
    const {chartLoading} = useValues(logic)
    const {setOpen, deleteThisChart} = useActions(logic)
    const [popoverOpen, setPopoverOpen] = useState(false)

    return (
        <>
            <Card
                ref={ref}
                id={`${chart.id}-card`}
                shadow="sm"
                fullWidth
                className="h-full"
                key={`${chart.id}-card`}
                isPressable
                onPress={() => setOpen(true)}
                classNames={{
                    body: "p-1 overflow-hidden"
                }}
            >
                <CardBody>
                    <div className="custom-draggable-cancel relative self-end">
                        <Popover key={`${chart.id}-menu`} placement="bottom-end" isOpen={popoverOpen} onOpenChange={(open) => setPopoverOpen(open)}>
                            <PopoverTrigger>
                                <Button variant="light" size="md" isIconOnly>
                                    <RxDotsVertical className="text-default-400 text-md"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                                <Listbox
                                    aria-label={`${chart.id}-menu-options`}
                                >
                                    <ListboxItem
                                        key="edit"
                                        color="default"
                                        startContent={<RxPencil1 className="text-lg"/>}
                                        onClick={() => {
                                            setPopoverOpen(false)
                                            setOpen(true)
                                        }}
                                    >
                                        Edit
                                    </ListboxItem>
                                    <ListboxItem
                                        key="delete"
                                        color="danger"
                                        startContent={chartLoading ? <Spinner color="white" size="sm"/> : <RxTrash  className="text-lg"/>}
                                        className={clsx(chartLoading && "cursor-not-allowed opacity-60")}
                                        onClick={() => {
                                            if (chartLoading) {
                                                return
                                            }
                                            if (confirm('Are you sure you want to delete this chart?')) {
                                                deleteThisChart({})
                                            } else {
                                                // Do nothing!
                                            }
                                        }}
                                    >
                                        Delete
                                    </ListboxItem>
                                </Listbox>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Chart className="-mt-6 pt-0" props={logicProps}/>
                </CardBody>
            </Card>
            <div className="custom-draggable-handle absolute top-1 left-1 cursor-grab w-10 h-10 justify-center flex items-center">
                <RxDragHandleDots2 className="text-default-400 text-lg"/>
            </div>
            <DataSelectModal props={logicProps} dashboardProps={dashboardProps}/>
        </>
    )
})

export function StaticDashboardItem(props: PublicDashboardItemLogicProps) {

    return (
        <>
            <Card
                id={`${props.chart.id}-card`}
                shadow="sm"
                fullWidth
                className="h-full"
                key={`${props.chart.id}-card`}
                classNames={{
                    body: "p-1 overflow-hidden"
                }}
            >
                <CardBody>
                    <StaticChart props={props}/>
                </CardBody>
            </Card>
        </>
    )
}

export const NewDashboardItem = forwardRef<HTMLDivElement, {
    newId: DashboardItemType["id"],
    dashboardProps: DashboardLogicProps
}>(({dashboardProps, newId}, ref) => {
    const logicProps = {id: newId, dashboardProps}
    const logic = dashboardItemLogic(logicProps)
    const {setOpen} = useActions(logic)

    return (
        <>
            <Card
                ref={ref}
                id={`${newId}-card`}
                shadow="sm"
                fullWidth
                className="h-full"
                key={`${newId}-card`}
                isPressable
                onPress={() => setOpen(true)}
            >
                <CardBody className="flex flex-row gap-3 justify-center items-center text-base text-default-400"
                          onClick={() => {
                          }}>
                    <AiOutlinePlus className="text-lg"/> Add chart
                </CardBody>
            </Card>
            <DataSelectModal props={logicProps} dashboardProps={dashboardProps}/>
        </>
    )
})
