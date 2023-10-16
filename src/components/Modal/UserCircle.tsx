import {
    Avatar,
    Button,
    Chip,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import {useValues} from "kea";
import {userLogic} from "../../logics/userLogic";
import {capitalizeFirstLetter} from "kea-forms/lib/utils";
import {PricingTier} from "../../utils/types";
import {TIERS_WITH_LIFE} from "./PublishModal";
import {TierPerks} from "../TierPerks";
import {PaywallModal} from "./PaywallModal";
import {LinkedAccountContent} from "./LinkedAccountsModal";

export function UserCircle() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {isOpen: isPublishModalOpen, onClose: closePublishModal, onOpen: openPublishModal} = useDisclosure()
    const {user, gravatarLink, billingPortalLinkLoading, billingPortalLink, plan} = useValues(userLogic)

    const currentTier = TIERS_WITH_LIFE.find(({value}) => value === plan)

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
                            <ModalBody className="flex flex-col py-4">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-row justify-between items-center">
                                        <span className="font-bold text-lg">Current Plan</span>
                                        <Chip color="success" classNames={{content: "font-semibold text-white"}}
                                              size="lg"
                                              radius="md"
                                              variant="solid">{capitalizeFirstLetter(plan)}</Chip>
                                    </div>
                                    {currentTier && (
                                        <div className="flex flex-col">
                                            <TierPerks perks={currentTier.perks}/>
                                        </div>
                                    )}
                                    {plan !== PricingTier.Life && (
                                        <Button
                                            color="primary" size="lg" radius="md"
                                            className="font-semibold disabled:opacity-50 text-lg"
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
                                    )}
                                </div>
                                <Divider className="my-2"/>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-row justify-between items-center">
                                        <span className="font-bold text-lg">Linked Accounts</span>
                                    </div>
                                    <LinkedAccountContent/>
                                </div>
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
