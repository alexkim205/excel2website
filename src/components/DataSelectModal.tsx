import {
    Button,
    Input,
    Listbox,
    ListboxItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
} from "@nextui-org/react";
import {useActions, useValues} from "kea";
import {dataLogic, DataLogicProps} from "../logics/dataLogic";
import {dataLayerLogic} from "../logics/dataLayerLogic";

export function DataSelectModal({props}: { props: DataLogicProps }) {
    const {workbooks} = useValues(dataLayerLogic)
    const logic = dataLogic(props)
    const {open, thisChart} = useValues(logic)
    const {setOpen, setThisChart} = useActions(logic)

    return (
        <Modal
            size="3xl"
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody className="py-2 px-4 gap-4 grid sm:grid-cols-2 grid-cols-1">
                            <div className="py-2 flex flex-col gap-3">
                                <div className="font-semibold text-lg">Select your workbook</div>
                                <div className="px-1 py-2 rounded-small border-medium border-default-200 dark:border-default-100">
                                    <Listbox
                                        aria-label="Select your workbook"
                                        variant="flat"
                                        disallowEmptySelection={false}
                                        selectionMode="single"
                                        className="max-h-[200px] overflow-y-auto"
                                        selectedKeys={thisChart?.dataSourceId}
                                        onSelectionChange={(keys) => {
                                            setThisChart({dataSourceId: keys.toString()})
                                        }}
                                    >
                                        {workbooks.length < 1 ? (
                                            <>
                                                No workbooks found in your drive.
                                            </>
                                        ) : (
                                            workbooks.map((workbook) => (
                                                <ListboxItem key={workbook.id}>
                                                    {workbook.name}
                                                </ListboxItem>
                                            ))
                                        )}
                                    </Listbox>
                                </div>
                            </div>
                            <div className="py-2 flex flex-col gap-3">
                                <div className="font-semibold text-lg">Set cell range</div>
                                <Input isClearable size="md" radius="sm" variant="bordered" type="text" placeholder="'Sheet1'!C14:D15" />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Next
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}