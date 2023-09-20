import {Card, CardBody} from "@nextui-org/react";
import {AiOutlinePlus} from "react-icons/ai";
import {useActions} from "kea";
import {dataLogic} from "../logics/dataLogic";
import {ChartType} from "../types";
import {DataSelectModal} from "./Modal/DataSelectModal";
import {forwardRef} from "react";
import {RxDragHandleDots2} from "react-icons/rx";

export const DashboardItem = forwardRef<HTMLDivElement, { chart: ChartType }>(({chart}, ref) => {
    const logicProps = {id: chart.id}
    const logic = dataLogic(logicProps)
    const {setOpen} = useActions(logic)

    return (
        <>
            <Card
                ref={ref}
                id={`${chart.id}-card`}
                shadow="sm"
                fullWidth
                className="h-full"
                key="Select data"
                isPressable
                onPress={() => setOpen(true)}
            >
                <CardBody className="flex flex-row gap-3 justify-center items-center text-base text-gray-400"
                          onClick={() => {
                          }}>
                    <AiOutlinePlus className="text-lg"/> Add chart
                </CardBody>
            </Card>
            <div className="custom-draggable-handle absolute top-2 left-1.5 cursor-grab w-2 h-2">
                <RxDragHandleDots2
                className="text-gray-400 text-lg"/></div>
            <DataSelectModal props={logicProps}/>
        </>
    )
})
