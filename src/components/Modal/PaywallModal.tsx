import {Divider, Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import {PaywallBlurb, PaywallTiers} from "./PublishModal";

export interface PaywallModalProps {
    open: boolean,
    setOpen: (open: boolean) => void
}

export function PaywallModal({open, setOpen}:PaywallModalProps) {
    return (
        <Modal size="4xl" isOpen={open} onClose={() => setOpen(false)}
               scrollBehavior="inside">
            <ModalContent>
                <ModalHeader className="flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold">Pricing and Why</h3>
                </ModalHeader>
                <Divider/>
                <ModalBody>
                    <PaywallBlurb/>
                    <PaywallTiers/>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}