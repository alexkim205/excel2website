import {
    Button,
    Chip,
    Divider,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Tooltip,
} from "@nextui-org/react";
import {Provider} from "../../utils/types";
import {Session} from "@supabase/gotrue-js/dist/module/lib/types";
import {useState} from "react";
import {EMAIL_REGEX} from "../../utils/utils";
import clsx from "clsx";
import {LuCheck, LuX} from "react-icons/lu";
import {useActions, useValues} from "kea";
import {userLogic} from "../../logics/userLogic";
import {UseDisclosureReturn} from "@nextui-org/use-disclosure";
import {urls} from "../../utils/routes";

export function LinkedAccountsModal({isOpen, onOpenChange}: UseDisclosureReturn) {

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex-col items-center justify-center">
                            <h3 className="text-2xl font-bold">Linked Accounts</h3>
                        </ModalHeader>
                        <Divider/>
                        <ModalBody className="flex flex-col py-4">
                            <LinkedAccountContent/>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export function LinkedAccountContent() {
    const {linkAccount} = useActions(userLogic)
    const {user, signInLoading} = useValues(userLogic)

    const linkedAccounts: Omit<LinkedAccountRowProps, "user" | "linkAccount" | "isLoading">[] = [
        {
            provider: Provider.Azure,
            label: "Microsoft Excel",
        },
        {
            provider: Provider.Google,
            label: "Google Sheets",
        }
    ]

    return (
        <div className="flex flex-col gap-6">
            <span className="leading-relaxed text-base">
                Link your Google or Microsoft account to access worksheets in your Google Sheets
                and/or Microsoft Excel account. SheetsToDashboard does not store any spreadsheet
                data and never will. Read more about our privacy practices
                <Link
                    href={urls.trust()}
                    isExternal
                    showAnchorIcon
                    className="ml-1.5"
                    color="primary"
                >
                here
            </Link>.
            </span>
            <div className="flex flex-col gap-3">
                {linkedAccounts.map((props) => (
                    <LinkedAccountRow user={user} {...props} key={props.provider}
                                      linkAccount={linkAccount} isLoading={signInLoading}/>
                ))}
            </div>
        </div>
    )
}

export interface LinkedAccountRowProps {
    provider: Provider,
    label: string,
    user: Session | null,
    linkAccount: (provider: Provider, toEmail: string) => void
    isLoading: boolean
}

export function LinkedAccountRow({provider, label, user, linkAccount, isLoading}: LinkedAccountRowProps) {
    const linked = !!user?.user?.user_metadata?.[provider]?.provider_token
    const [linkSetupOpen, setLinkSetupOpen] = useState(!linked)
    const [email, setEmail] = useState<string>('')

    const submittable = EMAIL_REGEX.test(email)

    const submitButton = (
        <Button color="primary" size="sm"
                radius="md"
                className="px-4 text-base font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                variant="solid"
                onPress={() => {
                    submittable && linkAccount(provider, email)
                }}
                isLoading={isLoading}
                disabled={!submittable}
        >
            Link
        </Button>
    )

    return (
        <div className={clsx("flex flex-col gap-2", linkSetupOpen && "px-2 border-medium border-primary-400 rounded-medium py-2")}>
            <div className={clsx("flex flex-row justify-between", linkSetupOpen ? "items-start" : "items-center")} key={provider}>
                <span className="text-base">{label}</span>
                {linked ? (
                    <Chip color="success" classNames={{content: "font-semibold text-white"}}
                          size="lg"
                          radius="md"
                          variant="solid" startContent={<LuCheck
                        className="text-xl text-white"/>}>Linked</Chip>
                ) : (
                    <div className="flex flex-col gap-2">
                        <Button color={linkSetupOpen ? "danger" : "primary"} size="sm"
                                className="text-base font-semibold"
                                variant={linkSetupOpen ? "flat" : "solid"}
                                radius="md"
                                isIconOnly={linkSetupOpen}
                                onPress={() => setLinkSetupOpen(!linkSetupOpen)}
                                endContent={undefined}
                        >
                            {linkSetupOpen ? <LuX className="text-xl font-semibold"/> : "Click to setup"}
                        </Button>
                    </div>
                )}
            </div>
            {linkSetupOpen && (
                <div className="flex flex-row justify-between items-end gap-2">
                    <Input type="email" key={`${provider}-linked-email-field`} name={`${provider}-linked-email-field`}
                           aria-label={`${provider}-linked-email-field`}
                           size="sm"
                           radius="md"
                           id={`${provider}-linked-email-field`} label="Email" placeholder="alex@abc.com"
                           labelPlacement="outside"
                           value={email}
                           required
                           onChange={(e) => setEmail(e.currentTarget.value)}
                           autoComplete="username"
                    />
                    {submittable ? (
                        submitButton
                    ) : (
                        <Tooltip color="danger" content={"Email is invalid"} placement="top-end">
                            {submitButton}
                        </Tooltip>
                    )}

                </div>
            )}
        </div>
    )
}