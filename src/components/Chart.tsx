import {Card, CardBody} from "@nextui-org/react";
import {AiOutlinePlus} from "react-icons/ai";
import {useActions} from "kea";
import {dataLogic} from "../logics/dataLogic";
import {ChartType} from "../types";
import {DataSelectModal} from "./DataSelectModal";

export function Chart({chart}: {chart: ChartType}) {
    const logicProps = {id: chart.id}
    const logic = dataLogic(logicProps)
    const {setOpen} = useActions(logic)

    return (
        <>
            <Card id={`${chart.id}-card`} shadow="sm" className="aspect-square"  key="Select data" isPressable onPress={() => setOpen(true)}>
                <CardBody className="flex flex-row gap-3 justify-center items-center text-base text-gray-400" onClick={() => {}}>
                    <AiOutlinePlus className="text-lg"/> Add chart
                </CardBody>
            </Card>
            <DataSelectModal props={logicProps}/>
        </>
    )
}