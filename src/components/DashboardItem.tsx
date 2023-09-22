import {Card, CardBody} from "@nextui-org/react";
import {AiOutlinePlus} from "react-icons/ai";
import {useActions} from "kea";
import {dashboardItemLogic} from "../logics/dashboardItemLogic";
import {DashboardItemType} from "../utils/types";
import {DataSelectModal} from "./Modal/DataSelectModal";
import {forwardRef} from "react";
import {RxDragHandleDots2} from "react-icons/rx";
import {DashboardLogicProps} from "../logics/dashboardLogic";


export const DashboardItem = forwardRef<HTMLDivElement, {
    chart: DashboardItemType,
    dashboardProps: DashboardLogicProps
}>(({chart, dashboardProps}, ref) => {
    const logicProps = {id: chart.id, dashboardProps}
    const logic = dashboardItemLogic(logicProps)
    const {setOpen} = useActions(logic)

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
            >
                <CardBody className="flex flex-row gap-3 justify-center items-center text-base text-default-400"
                          onClick={() => {
                          }}>
                    <AiOutlinePlus className="text-lg"/> Add chart
                </CardBody>
            </Card>
            <div className="custom-draggable-handle absolute top-2 left-1.5 cursor-grab w-2 h-2">
                <RxDragHandleDots2 className="text-default-400 text-lg"/>
            </div>
            <DataSelectModal props={logicProps} dashboardProps={dashboardProps}/>
        </>
    )
})

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
            <div className="custom-draggable-handle absolute top-2 left-1.5 cursor-grab w-2 h-2">
                <RxDragHandleDots2 className="text-default-400 text-lg"/>
            </div>
            <DataSelectModal props={logicProps} dashboardProps={dashboardProps}/>
        </>
    )
})
