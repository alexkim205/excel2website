import {
    Avatar, Button, Chip, Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader, useDisclosure,
} from "@nextui-org/react";
import {useValues} from "kea";
import {userLogic} from "../../logics/userLogic";
import {capitalizeFirstLetter} from "kea-forms/lib/utils";
import {PricingTier} from "../../utils/types";
import {TIERS} from "./PublishModal";
import {TierPerks} from "../TierPerks";
import {PaywallModal} from "./PaywallModal";

export function UserCircle() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {isOpen: isPublishModalOpen, onClose: closePublishModal, onOpen: openPublishModal} = useDisclosure()
    const {user, gravatarLink, billingPortalLinkLoading, billingPortalLink, plan} = useValues(userLogic)

    const currentTier = TIERS.find(({value}) => value === plan)

    return (
        <>
            <Avatar src={gravatarLink ?? ""} onClick={() => onOpen()} size="md" showFallback name={user?.user.email}
                    isBordered color="default" className="cursor-pointer"/>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex-col items-center justify-center">
                                <h3 className="text-2xl font-bold">Account Settings</h3>
                            </ModalHeader>
                            <Divider/>
                            <ModalBody className="flex flex-col">
                                <div className="flex flex-row justify-between items-center">
                                    <span className="font-bold text-lg">Current Plan</span>
                                    <Chip color="success" classNames={{content: "font-semibold text-white"}} size="lg"
                                          variant="solid">{capitalizeFirstLetter(plan)}</Chip>
                                </div>
                                {currentTier && (
                                    <div className="flex flex-col">
                                        <TierPerks perks={currentTier.perks}/>
                                    </div>
                                )}
                                <Button
                                    color="primary" size="lg" className="font-semibold disabled:opacity-50"
                                    isLoading={billingPortalLinkLoading} isDisabled={billingPortalLinkLoading}
                                    onPress={() => {
                                        if (plan === PricingTier.Free) {
                                            openPublishModal()
                                            return
                                        }
                                        if (billingPortalLink) {
                                            window.location.href = billingPortalLink
                                        }
                                    }}
                                >
                                    {plan === PricingTier.Free ? "Upgrade subscription" : "Manage subscription"}
                                </Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <PaywallModal open={isPublishModalOpen} setOpen={(open) => {
                if (open) {
                    openPublishModal()
                } else {
                    closePublishModal()
                }
            }}/>
        </>
    )
}