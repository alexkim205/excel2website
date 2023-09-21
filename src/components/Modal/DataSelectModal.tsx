import {
    Button,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    Select,
    SelectItem,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tabs,
    Textarea,
} from "@nextui-org/react";
import {useActions, useValues} from "kea";
import {dataLogic, DataLogicProps} from "../../logics/dataLogic";
import {dataLayerLogic} from "../../logics/dataLayerLogic";
import {FormEvent, useState} from "react";
import {MdOutlineSync} from "react-icons/md";
import {ChartEdit} from "./ChartEdit";
import {graphTypeTabs} from "./graph";
import {ChartPresetType, DataTableTab} from "../../types";

export function DataSelectModal({props}: { props: DataLogicProps }) {
    const {workbooks} = useValues(dataLayerLogic)
    const logic = dataLogic(props)
    const {open, thisChart, parsedRange, dataLoading, dataSourceReadyForSync, data} = useValues(logic)
    const {setOpen, setThisChart, fetchData} = useActions(logic)
    const [dataTableTab, setDataTableTab] = useState<DataTableTab>(DataTableTab.Preview)

    return (
        <Modal
            size="5xl"
            isOpen={open}
            onClose={() => setOpen(false)}
            classNames={{
                body: "p-0"
            }}
            scrollBehavior="inside"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody className="py-6 overflow-y-auto">
                            <div className="px-6 flex flex-col gap-4">
                                <div className="flex flex-row justify-between">
                                    <h2 className="text-3xl font-bold mb-2">Data</h2>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                                    <div className="flex flex-col w-full sm:w-[calc(50%-0.75rem)] gap-3">
                                        <div className="flex flex-col gap-2 w-full">
                                            <Select placeholder="Select workbook" aria-label="Select workbook"
                                                    labelPlacement="outside" label="Select workbook"
                                                    selectedKeys={new Set(thisChart?.dataSourceId ? [String(thisChart.dataSourceId)] : [])}
                                                    onSelectionChange={(keys) => {
                                                        setThisChart({dataSourceId: Array.from(keys)?.[0] ? String(Array.from(keys)[0]) : null})
                                                    }}
                                            >
                                                {workbooks.map((workbook) => (
                                                    <SelectItem key={workbook.id} value={workbook.id}>
                                                        {workbook.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <Input value={thisChart?.dataRange}
                                                   onValueChange={(value) => setThisChart({dataRange: value})}
                                                   isClearable
                                                   label="Select cell range"
                                                   labelPlacement="outside"
                                                   size="md"
                                                   radius="sm" type="text"
                                                   classNames={{
                                                       inputWrapper: "shadow-none"
                                                   }}
                                                   placeholder="i.e., 'Sheet1'!A1:B17"
                                                   description={`Worksheet: ${parsedRange.sheet ?? '<empty>'}, Range: ${parsedRange.range ?? '<empty>'}`}
                                            />
                                        </div>
                                        <Button
                                            className="font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                                            startContent={dataLoading ? null : <MdOutlineSync className="text-xl"/>}
                                            color="primary" isLoading={dataLoading}
                                            disabled={!dataSourceReadyForSync}
                                            onClick={() => {
                                                fetchData({})
                                            }}>
                                            Sync data
                                        </Button>
                                    </div>
                                    <div className="flex flex-col w-full sm:w-[calc(50%-0.75rem)]">
                                        <Tabs
                                            fullWidth
                                            aria-label="Data Table"
                                            selectedKey={dataTableTab}
                                            onSelectionChange={(nextTab) => setDataTableTab(nextTab as DataTableTab)}
                                            classNames={{panel: "px-0 py-1.5"}}
                                        >
                                            <Tab key={DataTableTab.Preview} title="Preview data">
                                                {data ? (
                                                    <Table aria-label="Data Preview Table" shadow="none"
                                                           classNames={{wrapper: "p-0"}}>
                                                        <TableHeader className="rounded-none">
                                                            {data.values?.[0]?.map((column: string | number, columnIndex: number) =>
                                                                <TableColumn className="uppercase"
                                                                             key={columnIndex}>{column}</TableColumn>) ?? <>
                                                                <TableColumn>Data</TableColumn></>}
                                                        </TableHeader>
                                                        <TableBody emptyContent={"No rows to display."}>
                                                            {data.values?.slice(1, 6)?.map((row: (string | number)[], rowIndex: number) => (
                                                                <TableRow key={rowIndex}>
                                                                    {row.map((cell, cellIndex) => <TableCell
                                                                        key={cellIndex}>{cell}</TableCell>)}
                                                                </TableRow>
                                                            )) ?? []}
                                                        </TableBody>
                                                    </Table>
                                                ) : (
                                                    <Table hideHeader aria-label="Data Preview Table" shadow="none"
                                                           classNames={{wrapper: "p-0"}}>
                                                        <TableHeader className="rounded-none">
                                                            <TableColumn>DATA</TableColumn>
                                                        </TableHeader>
                                                        <TableBody emptyContent={"No rows to display."}>
                                                            {[]}
                                                        </TableBody>
                                                    </Table>
                                                )}
                                            </Tab>
                                            <Tab key={DataTableTab.Expected} title="Expected format">
                                                <div className="text-tiny text-foreground-400 pb-1.5">
                                                    Showing expected shape of data for
                                                    a {graphTypeTabs[thisChart.type].label} chart.
                                                </div>
                                                <Table aria-label="Expected Data Table" shadow="none"
                                                       classNames={{wrapper: "p-0"}}>
                                                    <TableHeader className="rounded-none">
                                                        {graphTypeTabs[thisChart.type].expectedData[0].map((column: string | number, columnIndex: number) =>
                                                            <TableColumn className="uppercase"
                                                                         key={columnIndex}>{column}</TableColumn>) ?? <>
                                                            <TableColumn>Data</TableColumn></>}
                                                    </TableHeader>
                                                    <TableBody emptyContent={"No rows to display."}>
                                                        {graphTypeTabs[thisChart.type].expectedData.slice(1).map((row: (string | number)[], rowIndex: number) => (
                                                            <TableRow key={rowIndex}>
                                                                {row.map((cell, cellIndex) => <TableCell
                                                                    key={cellIndex}>{cell}</TableCell>)}
                                                            </TableRow>
                                                        )) ?? []}
                                                    </TableBody>
                                                </Table>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                            <Divider className="my-2"/>
                            <div id={`${props.id}-chart-wrapper`} className="px-6 flex flex-col gap-4">
                                <h2 className="text-3xl font-bold mb-2">Chart</h2>
                                <Tabs classNames={{tabList: "flex-wrap", tab: "w-auto"}} aria-label="Dynamic tabs"
                                      items={Object.values(graphTypeTabs)} selectedKey={thisChart?.type}
                                      onSelectionChange={(nextType) => setThisChart({type: nextType as ChartPresetType})}>
                                    {(item) => (
                                        <Tab key={item.id} title={<div className="flex items-center space-x-2">
                                            <item.Icon/>
                                            <span>{item.label}</span>
                                        </div>}/>
                                    )}
                                </Tabs>
                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 sm:gap-6 mb-4">
                                    <Input type="text" key="chart-title-field" name="chart-title-field"
                                           id="chart-title-field" label="Title" placeholder="Name this chart"
                                           labelPlacement="outside" value={thisChart?.chart?.title?.text}
                                           onChange={(event: FormEvent<HTMLInputElement>) => {
                                               setThisChart({chart: {title: {text: event.currentTarget.value}}})
                                           }}/>
                                    <Textarea
                                        name="chart-description-field"
                                        label="Description (optional)"
                                        labelPlacement="outside"
                                        minRows={2}
                                        cacheMeasurements
                                        value={thisChart?.chart?.title?.subtext}
                                        onValueChange={(value) => {
                                            setThisChart({chart: {title: {subtext: value}}})
                                        }}
                                        type="text"
                                        placeholder="Write a description"
                                    />
                                    {![ChartPresetType.RingPie, ChartPresetType.BasicPie].includes(thisChart.type) && (
                                        <>
                                            <Input type="text" key="chart-xaxis-field" name="chart-xaxis-field"
                                                   id="chart-xaxis-field" label="X-axis label" placeholder="Time"
                                                   labelPlacement="outside" value={thisChart?.chart?.xAxis?.name}
                                                   onChange={(event: FormEvent<HTMLInputElement>) => {
                                                       setThisChart({chart: {xAxis: {name: event.currentTarget.value}}})
                                                   }}/>
                                            <Input type="text" key="chart-yaxis-field" name="chart-yaxis-field"
                                                   id="chart-yaxis-field" label="Y-axis label" placeholder="Units"
                                                   labelPlacement="outside" value={thisChart?.chart?.yAxis?.name}
                                                   onChange={(event: FormEvent<HTMLInputElement>) => {
                                                       setThisChart({chart: {yAxis: {name: event.currentTarget.value}}})
                                                   }}/>
                                        </>
                                    )}
                                </div>
                                <ChartEdit props={props}/>
                            </div>
                        </ModalBody>
                        <Divider/>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={() => alert("Save")}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}