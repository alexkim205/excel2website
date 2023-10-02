import {Modal, ModalContent} from "@nextui-org/react";
import {PublishModalPaywall} from "./PublishModal";

export interface PaywallModalProps {
    open: boolean,
    setOpen: (open: boolean) => void
}

export function PaywallModal({open, setOpen}:PaywallModalProps) {
    return (
        <Modal size="3xl" isOpen={open} onClose={() => setOpen(false)}
               scrollBehavior="inside">
            <ModalContent>
                    <PublishModalPaywall/>
            </ModalContent>
        </Modal>
    )
}