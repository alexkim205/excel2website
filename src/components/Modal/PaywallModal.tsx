import {Divider, Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import {PaywallBlurb, PaywallTiers} from "./PublishModal";
import {UseDisclosureReturn} from "@nextui-org/use-disclosure";

export function PaywallModal({isOpen, onClose}:UseDisclosureReturn) {
    return (
        <Modal size="3xl" isOpen={isOpen} onClose={onClose}
               scrollBehavior="inside">
            <ModalContent>
                <ModalHeader className="flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold">Pricing and Why</h3>
                </ModalHeader>
                <Divider/>
                <ModalBody>
                    <div className="flex sm:flex-row flex-col-reverse gap-6">
                        <div className="sm:w-1/2 w-full">
                            <PaywallTiers/>
                        </div>
                        <div className="sm:w-1/2 w-full">
                            <PaywallBlurb/>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}