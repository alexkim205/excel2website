import {Avatar, AvatarGroup, Button, Divider, Input, Link, Tooltip} from "@nextui-org/react";
import {useActions, useValues} from "kea";
import {authFormLogic, AuthFormLogicProps} from "../../logics/authFormLogic";
import {SceneKey, urls} from "../../utils/routes";
import {Field, Form} from "kea-forms";
import {A} from "kea-router"
import {Fragment, ReactNode} from "react";
import {homeLogic} from "../../logics/homeLogic";
import {TfiMicrosoftAlt} from "react-icons/tfi";
import {LuCheck} from "react-icons/lu";
import {FcGoogle} from "react-icons/fc";

type FieldType = "email" | "password" | "password2"

export function AuthSwitchComponent(logicProps: AuthFormLogicProps) {
    const {gravatarIds} = useValues(homeLogic)
    const logic = authFormLogic(logicProps)
    const {isAuthFormSubmitting, authFormHasErrors, authFormTouched, isAuthFormSubmitted} = useValues(logic)
    const {signInWithGoogle, signInWithMicrosoft} = useActions(logic)

    function renderLabel(): ReactNode {
        if (logicProps.scene === SceneKey.SignUp) {
            return (
                <>
                    <h2 className="sm:text-4xl text-3xl font-bold sm:!leading-[3rem] !leading-[2.2rem] max-w-full break-words">
                        Get Started
                    </h2>
                    <p className="text-sm text-default-500">Create a new account</p>
                </>
            )
        }
        if (logicProps.scene === SceneKey.SignIn) {
            return (
                <>
                    <h2 className="sm:text-4xl text-3xl font-bold sm:!leading-[3rem] !leading-[2.2rem] max-w-full break-words">
                        Welcome back
                    </h2>
                    <p className="text-sm text-default-500">Sign into your account</p>
                </>
            )
        }
        if (logicProps.scene === SceneKey.ForgotPassword) {
            return (
                <>
                    <h2 className="sm:text-4xl text-3xl font-bold sm:!leading-[3rem] !leading-[2.2rem] max-w-full break-words">
                        Forgot password
                    </h2>
                </>
            )
        }
        return (
            <>
                <h2 className="sm:text-4xl text-3xl font-bold sm:!leading-[3rem] !leading-[2.2rem] max-w-full break-words">
                    Reset password
                </h2>
            </>
        )
    }

    function renderFooterLabel(): ReactNode {
        if (logicProps.scene === SceneKey.SignIn) {
            return (
                <p className="text-sm">Don't have an account? <A className="underline text-black font-medium"
                                                                 href={urls.sign_up()}>Sign Up Now</A>.</p>
            )
        }
        if (logicProps.scene === SceneKey.SignUp) {
            return (
                <p className="text-sm">Have an account? <A className="underline text-black font-medium"
                                                           href={urls.sign_in()}>Sign In Now</A>.</p>
            )
        }
        if (logicProps.scene === SceneKey.ForgotPassword) {
            return (
                <p className="text-sm">Back to <A className="underline text-black font-medium"
                                                  href={urls.sign_in()}>Log In</A>.</p>
            )
        }
    }

    const typeToField: Record<FieldType, ReactNode> = {
        email: <Field name="email" noStyle>
            {({value, onChangeEvent, error}) => (
                <Input type="email" key="user-email-field" name="user-email-field"
                       id="user-email-field" label="Email" placeholder="alex@abc.com"
                       labelPlacement="outside"
                       value={value}
                       required
                       isInvalid={!!error}
                       onChange={onChangeEvent}
                       errorMessage={error}
                       autoComplete="username"
                />
            )}
        </Field>,
        password: <Field name="password" noStyle>
            {({value, onChangeEvent, error}) => (
                <Input type="password" key="user-password-field" name="user-password-field"
                       id="user-password-field" label="Password" placeholder="***********"
                       labelPlacement="outside"
                       value={value}
                       required
                       isInvalid={!!error}
                       onChange={onChangeEvent}
                       errorMessage={error}
                       description={logicProps.scene !== SceneKey.ResetPassword && (
                           <div className="absolute right-0"><A className="text-default-400"
                                                                href={urls.forgot_password()}>Forgot password?</A></div>
                       )}
                       autoComplete="password"
                />
            )}
        </Field>,
        password2: <Field name="password2" noStyle>
            {({value, onChangeEvent, error}) => (
                <Input type="password" key="user-password2-field" name="user-password2-field"
                       id="user-password2-field" label="Confirm password" placeholder="***********"
                       labelPlacement="outside"
                       value={value}
                       required
                       isInvalid={!!error}
                       onChange={onChangeEvent}
                       errorMessage={error}
                       autoComplete="password"
                />
            )}
        </Field>
    }

    const sceneToForm: Record<AuthFormLogicProps["scene"], {
        scene: AuthFormLogicProps["scene"],
        inputs: FieldType[],
        submit: ReactNode
    }> = {
        [SceneKey.SignIn]: {
            scene: SceneKey.SignIn, inputs: ["email", "password"], submit: (
                <Button size="lg" className="px-4 font-medium text-sm" color="primary"
                        radius="md" fullWidth type="submit" isLoading={isAuthFormSubmitting}
                        isDisabled={authFormTouched && authFormHasErrors}>
                    Sign in with email
                </Button>
            )
        },
        [SceneKey.SignUp]: {
            scene: SceneKey.SignUp, inputs: ["email", "password", "password2"], submit: (
                <Button size="lg" className="px-4 font-medium text-sm" color="primary"
                        radius="md" fullWidth type="submit" isLoading={isAuthFormSubmitting}
                        isDisabled={authFormTouched && authFormHasErrors}>
                    Sign up with email
                </Button>
            )
        },
        [SceneKey.ResetPassword]: {
            scene: SceneKey.ResetPassword, inputs: ["password", "password2"], submit: (
                <Button size="lg" className="px-4 font-medium text-sm" color="primary"
                        radius="md" fullWidth type="submit" isLoading={isAuthFormSubmitting}
                        isDisabled={authFormTouched && authFormHasErrors}>
                    Reset password
                </Button>
            )
        },
        [SceneKey.ForgotPassword]: {
            scene: SceneKey.ForgotPassword, inputs: ["email"], submit: (
                <Button size="lg" className="px-4 font-medium text-sm" color="primary"
                        radius="md" fullWidth type="submit" isLoading={isAuthFormSubmitting}
                        isDisabled={isAuthFormSubmitted || authFormTouched && authFormHasErrors}
                        startContent={isAuthFormSubmitted ? <LuCheck className="text-xl"/> : null}
                >
                    {isAuthFormSubmitted ? "Email sent!" : "Send password reset email"}
                </Button>
            )
        },
    }

    function renderForm(): ReactNode {
        const formBase = sceneToForm[logicProps.scene]
        return (
            <>
                {formBase.inputs.map((type) => <Fragment key={type}>
                    {typeToField[type]}
                </Fragment>)}
                <div className="mt-3">
                    {formBase.submit}
                </div>
            </>
        )
    }

    return (
        <div
            id={`auth-wrapper`}
            className="flex flex-col justify-between h-[calc(100vh-64px)] items-center w-full grow"
        >
            <div className="md:grid md:grid-cols-5 grow w-full flex justify-center">
                <div
                    className="md:col-span-2 justify-center items-center col-span-full max-w-md flex flex-col mx-auto w-full gap-4 px-8 py-8">
                    <div className="flex flex-col w-full gap-1 justify-start">
                        {renderLabel()}
                    </div>
                    {[SceneKey.SignUp, SceneKey.SignIn].includes(logicProps.scene) && (
                        <>
                            <div className="flex flex-col w-full gap-2">
                                <Button
                                    size="lg"
                                    radius="md"
                                    variant="flat"
                                    color="default"
                                    fullWidth
                                    isLoading={isAuthFormSubmitting}
                                    onPress={() => signInWithGoogle()}
                                    className="px-2 font-medium text-sm"
                                    startContent={!isAuthFormSubmitting &&
                                        <FcGoogle className="shrink-0 text-2xl text-[#4285F4]"/>}
                                >
                                    <span>{logicProps.scene === SceneKey.SignIn ? "Sign in" : "Sign up"} with Google</span>
                                </Button>
                                <Button
                                    size="lg"
                                    radius="md"
                                    color="default"
                                    variant="flat"
                                    fullWidth
                                    isLoading={isAuthFormSubmitting}
                                    onPress={() => signInWithMicrosoft()}
                                    className="px-2 font-medium text-sm"
                                    startContent={!isAuthFormSubmitting &&
                                        <TfiMicrosoftAlt className="shrink-0 text-xl text-[#00A4EF]"/>}
                                >
                                    <span>{logicProps.scene === SceneKey.SignIn ? "Sign in" : "Sign up"} with Microsoft</span>
                                </Button>
                                <Tooltip
                                    size="sm"
                                    placement="bottom-start"
                                    content={(
                                        <div className="max-w-[200px] p-2 px-0 text-default-500 leading-normal">
                                            Link your
                                            Google or Microsoft account to access worksheets in your Google Sheets
                                            and/or Microsoft
                                            Excel account. SheetsToDashboard does not store any spreadsheet data and
                                            never will. Read more about our privacy practices
                                            <Link
                                                href={urls.trust()}
                                                isExternal
                                                showAnchorIcon
                                                className="ml-1 text-xs"
                                                color="primary"
                                            >
                                                here
                                            </Link>.
                                        </div>
                                    )}>
                                    <div
                                        className="text-xs underline-offset-[3px] text-default-500 underline decoration-dashed">
                                        What does linking your account do?
                                    </div>
                                </Tooltip>
                            </div>
                            <Divider className="my-2"/>
                        </>
                    )}
                    <Form logic={authFormLogic} formKey="authForm" className="w-full" props={logicProps}
                          enableFormOnSubmit>
                        <div className="flex flex-col gap-4 w-full">
                            {renderForm()}
                        </div>
                    </Form>
                    <div className="text-center text-default-500">
                        {renderFooterLabel()}
                    </div>
                </div>
                <div
                    className="md:col-span-3 md:flex hidden md:flex-col text-center gap-8 p-6 md:justify-center md:items-center bg-gradient-to-tr from-primary to-secondary from-80">
                    <h2 className="text-3xl !leading-[2.5rem] max-w-md font-bold text-white"><span
                        className="underline underline-offset-4">100+ and counting</span> trust and use
                        Sheets to Dashboard today. <span className="text-5xl">🙌</span></h2>
                    <AvatarGroup
                        isBordered
                        max={23}
                        total={100}
                        className="flex flex-wrap max-w-2xl mx-auto"
                    >
                        {gravatarIds.map(({hash, initials}, index) => (
                            <Avatar color="primary" classNames={{base: "shrink-0", name: "font-medium text-xl"}}
                                    src={`https://www.gravatar.com/avatar/${hash}?d=identicon`}
                                    name={initials.toUpperCase()} key={index} size="lg"/>
                        ))}
                    </AvatarGroup>
                </div>
            </div>
        </div>
    )
}
