import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader, Link,
    Listbox,
    ListboxItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@nextui-org/react";
import {useActions, useValues} from "kea";
import {publishModalLogic, PublishModalLogicProps} from "../../logics/publishModalLogic";
import {PricingTier} from "../../utils/types";
import {TbLayoutGrid, TbMessageQuestion, TbWorldWww} from "react-icons/tb";
import {capitalizeFirstLetter} from "kea-forms/lib/utils";

export interface PublishModalProps {
    props: PublishModalLogicProps
}

export function PublishModal({props}: PublishModalProps) {
    const logic = publishModalLogic(props)
    const {open} = useValues(logic)
    const {setOpen} = useActions(logic)

    const tiers = [
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

    return (
        <Modal size="3xl" isOpen={open} onClose={() => setOpen(false)} scrollBehavior="inside">
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex-col items-center justify-center">
                            <h3 className="text-2xl font-bold">Pricing and Why</h3>
                        </ModalHeader>
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
                                with details for a heavily discounted license.</p>
                            <p className="text-sm">Thank you for supporting this product and as always looking forward
                                to hearing your feedback! :)</p>
                            <div className="grid sm:grid-cols-4 grid-cols-2 gap-3">
                                {tiers.map(({value, price, perks}) => (
                                    <Card shadow="none" className="w-full border-medium p-2 gap-3"
                                          classNames={{body: "p-0", footer: "p-0"}}>
                                        <CardHeader
                                            className="text-lg flex flex-col gap-1 font-medium text-center justify-center bg-default-200 p-3 rounded-medium">
                                            {capitalizeFirstLetter(value)}
                                            <div className="flex flex-row text-4xl"><span
                                                className="text-lg self-start">$</span>{price}<span
                                                className="text-lg self-end">/mo</span></div>
                                        </CardHeader>
                                        <CardBody>
                                            <Listbox
                                                aria-label={`${value}-perks`}
                                                color="default"
                                                variant="solid"
                                                className="p-0"
                                                itemClasses={{base: "data-[hover=true]:bg-white cursor-default select-none"}}
                                            >
                                                {perks.map(({Icon, label}) => (
                                                    <ListboxItem
                                                        classNames={{title: "whitespace-normal"}}
                                                        startContent={<Icon className="text-lg"/>}
                                                        key={label}>{label}</ListboxItem>
                                                ))}
                                            </Listbox>
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
                                                <Button variant="flat" radius="md" className="text-base font-medium" color="primary"
                                                        fullWidth size="lg">
                                                    Select
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}