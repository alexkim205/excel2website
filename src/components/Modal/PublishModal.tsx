import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import {useActions, useValues} from "kea";
import {publishModalLogic} from "../../logics/publishModalLogic";
import {PricingTier} from "../../utils/types";
import {TbLayoutGrid, TbMessageQuestion, TbWorldWww} from "react-icons/tb";
import {capitalizeFirstLetter} from "kea-forms/lib/utils";
import {userLogic} from "../../logics/userLogic";
import {TierPerks} from "../TierPerks";
import {DashboardLogicProps} from "../../logics/dashboardLogic";

export interface PublishModalProps {
    props: DashboardLogicProps
}

export const TIERS = [
    {
        value: PricingTier.Free,
        price: 0,
        perks: [
            {
                Icon: TbLayoutGrid,
                label: "Unlimited personal offline dashboards"
            },
        ]
    },
    {
        value: PricingTier.Tiny,
        price: 5,
        perks: [
            {
                Icon: TbLayoutGrid,
                label: "Up to 5 shareable dashboards"
            },
            {
                Icon: TbWorldWww,
                label: "Custom domain"
            },
        ]
    },
    {
        value: PricingTier.Small,
        price: 10,
        perks: [
            {
                Icon: TbLayoutGrid,
                label: "Up to 15 shareable dashboards"
            },
            {
                Icon: TbWorldWww,
                label: "Custom domain"
            },
        ]
    },
    {
        value: PricingTier.Mega,
        price: 20,
        perks: [
            {
                Icon: TbLayoutGrid,
                label: "Unlimited shareable dashboards"
            },
            {
                Icon: TbWorldWww,
                label: "Custom domain"
            },
            {
                Icon: TbMessageQuestion,
                label: "Priority support"
            },
        ]
    }
]

export function PublishModal({props}: PublishModalProps) {
    const logic = publishModalLogic(props)
    const {plan} = useValues(userLogic)
    const {open, loadingPaymentLinkPricingTier, dashboard} = useValues(logic)
    const {setOpen, generatePaymentLink} = useActions(logic)

    console.log("dashboard", dashboard)

    return (
        <Modal size={plan === PricingTier.Free ? "3xl" : "lg"} isOpen={open} onClose={() => setOpen(false)} scrollBehavior="inside">
            <ModalContent>
                {() => plan === PricingTier.Free ? (
                    <>
                        <ModalHeader className="flex-col items-center justify-center">
                            <h3 className="text-2xl font-bold">Pricing and Why</h3>
                        </ModalHeader>
                        <Divider/>
                        <ModalBody>
                            <p className="text-sm font-normal mb-2">Hi 👋 this is Alex, the solo founder of Sheets to
                                Dashboard. I initially made this product to solve a problem I was running into, and was
                                floored by the positive feedback I got when I released the beta. I'd love to keep
                                this product free, however with server/api/data/domain/email costs (and my own bills to
                                pay 🫠), I have concerns about sustaining this product and its growth if it remains
                                entirely free.</p>
                            <p className="text-sm font-normal mb-2"><span className="font-semibold">There are paid tiers, but there will always be a freemium
                                tier for Sheets to Dashboard</span>, which at its bare minimum lets you create an
                                unlimited amount of offline
                                dashboards for your personal use. If you pay for a license, you can publish your
                                dashboards to your own custom domain or a subdomain like abc.sheetstodashboard.com.
                                Plus, it comes with other features you might find helpful. And of course, if you are a
                                non-profit or current student, shoot me an email at
                                <Link size="sm" className="mx-1"
                                      href="mailto:hellosimplelanding@gmail.com">hellosimplelanding@gmail.com</Link>
                                with details for a discounted license.</p>
                            <p className="text-sm">Thank you for supporting this product. Looking forward
                                to hearing your feedback and making a great product! :)</p>
                            <div className="grid sm:grid-cols-4 grid-cols-2 gap-3">
                                {TIERS.map(({value, price, perks}) => (
                                    <Card key={value} shadow="none" className="w-full border-medium p-2 gap-3"
                                          classNames={{body: "p-0", footer: "p-0"}}>
                                        <CardHeader
                                            className="text-lg flex flex-col gap-1 font-medium text-center justify-center bg-default-200 p-3 rounded-medium">
                                            {capitalizeFirstLetter(value)}
                                            <div className="flex flex-row gap-1 text-4xl">
                                                <span className="text-lg self-start">$</span>{price}
                                                <div className="flex flex-col justify-start items-start">
                                                    <span className="text-sm">per</span>
                                                    <span className="text-sm -mt-1">mo</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            <TierPerks perks={perks}/>
                                        </CardBody>
                                        <CardFooter>
                                            {value === PricingTier.Free ? (
                                                <Button variant="faded" radius="md" disabled
                                                        className="disabled:opacity-50 text-base font-medium"
                                                        color="primary"
                                                        fullWidth size="lg">
                                                    Current plan
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="flat" radius="md" className="text-base font-medium disabled:opacity-50"
                                                    color="primary"
                                                    fullWidth size="lg"
                                                    disabled={value === loadingPaymentLinkPricingTier}
                                                    isLoading={value === loadingPaymentLinkPricingTier}
                                                    onPress={() => {
                                                        generatePaymentLink(value)
                                                    }}
                                                >
                                                    Subscribe
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </ModalBody>
                    </>
                ) : (
                    <>
                        <ModalHeader className="flex-col items-center justify-center">
                            <h3 className="text-2xl font-bold">Publish Dashboard</h3>
                        </ModalHeader>
                        <Divider className="my-2"/>
                        <ModalBody className="flex flex-col">
                            <h2 className="text-lg font-bold mb-6">Domains</h2>
                            <Input value={`${dashboard?.subdomain}.sheetstodashboard.com`}
                                   isDisabled
                                   label="Default Domain"
                                   labelPlacement="outside"
                                   size="md"
                                   radius="sm" type="text"
                                   classNames={{
                                       inputWrapper: "shadow-none"
                                   }}
                                   description="Cannot be changed"
                            />
                            <Input value={`${dashboard?.subdomain}.sheetstodashboard.com`}
                                   isDisabled
                                   label="Default Domain"
                                   labelPlacement="outside"
                                   size="md"
                                   radius="sm" type="text"
                                   classNames={{
                                       inputWrapper: "shadow-none"
                                   }}
                                   description="Cannot be changed"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary">Publish</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}