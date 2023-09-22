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
import {dashboardItemLogic, DashboardItemLogicProps} from "../../logics/dashboardItemLogic";
import {dashboardLogic, DashboardLogicProps} from "../../logics/dashboardLogic";
import {FormEvent, useState} from "react";
import {MdOutlineSync} from "react-icons/md";
import {ChartEdit} from "./ChartEdit";
import {graphTypeTabs} from "./graph";
import {ChartPresetType, PanelTab} from "../../utils/types";

export function DataSelectModal({dashboardProps, props}: { dashboardProps: DashboardLogicProps, props: DashboardItemLogicProps }) {
    const dashLogic = dashboardLogic(dashboardProps)
    const logic = dashboardItemLogic(props)
    const {workbooks} = useValues(dashLogic)
    const {open, thisChart, parsedRange, dataLoading, dataSourceReadyForSync, data} = useValues(logic)
    const {setOpen, setThisChart, fetchData, saveThisChart} = useActions(logic)
    const [dataTableTab, setDataTableTab] = useState<PanelTab>(PanelTab.Chart)

    const ThisChartIcon = graphTypeTabs[thisChart.data.type].Icon

    return (
        <Modal
            size="full"
            isOpen={open}
            onClose={() => setOpen(false)}
            classNames={{
                body: "p-0",
                wrapper: "sm:p-8 p-1.5"
            }}
            className="!rounded-large max-w-7xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody className="py-6 overflow-y-auto">
                            <div className="px-6 flex flex-row sm:flex-col gap-2">
                                <div className="flex flex-col justify-between sm:flex-row gap-3 w-full sm:gap-6">
                                    <div className="flex flex-col w-full sm:w-[calc(33%-0.75rem)] gap-3">
                                        <h2 className="text-lg font-bold">Data</h2>
                                        <Select placeholder="Select workbook" aria-label="Workbook"
                                                labelPlacement="outside" label="Workbook"
                                                selectedKeys={new Set(thisChart?.data?.dataSourceId ? [String(thisChart.data.dataSourceId)] : [])}
                                                onSelectionChange={(keys) => {
                                                    setThisChart({data: {dataSourceId: Array.from(keys)?.[0] ? String(Array.from(keys)[0]) : null}})
                                                }}
                                        >
                                            {workbooks.map((workbook) => (
                                                <SelectItem key={workbook.id} value={workbook.id}>
                                                    {workbook.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Input value={thisChart?.data?.dataRange}
                                               onValueChange={(value) => setThisChart({data: {dataRange: value}})}
                                               isClearable
                                               label="Cell range"
                                               labelPlacement="outside"
                                               size="md"
                                               radius="sm" type="text"
                                               classNames={{
                                                   inputWrapper: "shadow-none"
                                               }}
                                               placeholder="i.e., 'Sheet1'!A1:B17"
                                               description={`Worksheet: ${parsedRange.sheet ?? '<empty>'}, Range: ${parsedRange.range ?? '<empty>'}`}
                                        />
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
                                        <Divider/>
                                        <h2 className="text-lg font-bold">Chart</h2>
                                        <Select placeholder="Chart type" aria-label="Chart type"
                                                labelPlacement="outside" label="Chart type"
                                                startContent={<ThisChartIcon className="text-lg"/>}
                                                selectedKeys={new Set(thisChart?.data?.type ? [String(thisChart.data.type)] : [])}
                                                onSelectionChange={(keys) => {
                                                    setThisChart({data: {type: Array.from(keys)?.[0] ? String(Array.from(keys)[0]) as ChartPresetType : undefined}})
                                                }}
                                        >
                                            {Object.values(graphTypeTabs).map((type) => (
                                                <SelectItem key={type.id} value={type.id} startContent={<type.Icon className="text-lg"/>}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <div className="flex-col flex gap-3">
                                            <Input type="text" key="chart-title-field" name="chart-title-field"
                                                   id="chart-title-field" label="Title" placeholder="Name this chart"
                                                   labelPlacement="outside" value={thisChart?.data?.chart?.title?.text}
                                                   onChange={(event: FormEvent<HTMLInputElement>) => {
                                                       setThisChart({data: {chart: {title: {text: event.currentTarget.value}}}})
                                                   }}/>
                                            <Textarea
                                                name="chart-description-field"
                                                label="Description (optional)"
                                                labelPlacement="outside"
                                                minRows={2}
                                                cacheMeasurements
                                                value={thisChart?.data?.chart?.title?.subtext}
                                                onValueChange={(value) => {
                                                    setThisChart({data: {chart: {title: {subtext: value}}}})
                                                }}
                                                type="text"
                                                placeholder="Write a description"
                                            />
                                            {![ChartPresetType.RingPie, ChartPresetType.BasicPie].includes(thisChart.data.type) && (
                                                <>
                                                    <Input type="text" key="chart-xaxis-field" name="chart-xaxis-field"
                                                           id="chart-xaxis-field" label="X-axis label"
                                                           placeholder="Time"
                                                           labelPlacement="outside"
                                                           value={thisChart?.data?.chart?.xAxis?.name}
                                                           onChange={(event: FormEvent<HTMLInputElement>) => {
                                                               setThisChart({data: {chart: {xAxis: {name: event.currentTarget.value}}}})
                                                           }}/>
                                                    <Input type="text" key="chart-yaxis-field" name="chart-yaxis-field"
                                                           id="chart-yaxis-field" label="Y-axis label"
                                                           placeholder="Units"
                                                           labelPlacement="outside"
                                                           value={thisChart?.data?.chart?.yAxis?.name}
                                                           onChange={(event: FormEvent<HTMLInputElement>) => {
                                                               setThisChart({data: {chart: {yAxis: {name: event.currentTarget.value}}}})
                                                           }}/>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full sm:w-[calc(66%-0.75rem)] p-2 bg-default-100 rounded-large">
                                        <Tabs
                                            fullWidth
                                            aria-label="Data Table"
                                            selectedKey={dataTableTab}
                                            onSelectionChange={(nextTab) => setDataTableTab(nextTab as PanelTab)}
                                            classNames={{panel: "px-1 py-1.5 h-full sticky top-0"}}
                                        >
                                            <Tab key={PanelTab.Chart} title="Chart">
                                                <ChartEdit props={props}/>
                                            </Tab>
                                            <Tab key={PanelTab.PreviewData} title="Data">
                                                {data ? (
                                                    <Table aria-label="Data Preview Table" shadow="none">
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
                                                    <Table hideHeader aria-label="Data Preview Table" shadow="none">
                                                        <TableHeader className="rounded-none">
                                                            <TableColumn>DATA</TableColumn>
                                                        </TableHeader>
                                                        <TableBody emptyContent={"No rows to display."}>
                                                            {[]}
                                                        </TableBody>
                                                    </Table>
                                                )}
                                            </Tab>
                                            <Tab key={PanelTab.ExpectedData} title="Expected Format">
                                                <div className="text-tiny justify-center w-full flex text-foreground-400 pb-1.5">
                                                    Showing expected shape of data for
                                                    a {graphTypeTabs[thisChart.data.type].label} chart.
                                                </div>
                                                <Table aria-label="Expected Data Table" shadow="none">
                                                    <TableHeader className="rounded-none">
                                                        {graphTypeTabs[thisChart.data.type].expectedData[0].map((column: string | number, columnIndex: number) =>
                                                            <TableColumn className="uppercase"
                                                                         key={columnIndex}>{column}</TableColumn>) ?? <>
                                                            <TableColumn>Data</TableColumn></>}
                                                    </TableHeader>
                                                    <TableBody emptyContent={"No rows to display."}>
                                                        {graphTypeTabs[thisChart.data.type].expectedData.slice(1).map((row: (string | number)[], rowIndex: number) => (
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
                        </ModalBody>
                        <Divider/>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={() => saveThisChart()}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}