import {connect, defaults, kea, key, listeners, path, props, reducers} from "kea";
import {AuthSceneKey, SceneKey, urls} from "../utils/routes";
import {forms} from "kea-forms";
import {AuthFormData} from "../utils/types";
import {EMAIL_REGEX} from "../utils/utils";
import supabase from "../utils/supabase";
import type {AuthError, User} from "@supabase/supabase-js";
import posthog from "posthog-js";
import {userLogic} from "./userLogic";
import {A, router} from "kea-router";
import type {authFormLogicType} from "./authFormLogicType";
import {toast} from "react-toastify";

export interface AuthFormLogicProps {
    scene: AuthSceneKey
}

export const authFormLogic = kea<authFormLogicType>([
    path(["src", "logics", "authFormLogic"]),
    props({} as AuthFormLogicProps),
    key(({scene}: AuthFormLogicProps) => scene),
    connect(() => ({
        values: [userLogic, ["user"]],
        actions: [userLogic, ["signInWithMicrosoft", "signInWithGoogle", "setUser"]]
    })),
    defaults({
        isAuthFormSubmitted: false as boolean
    }),
    reducers({
        isAuthFormSubmitted: {
            submitAuthFormSuccess: () => true
        }
    }),
    forms(({props}) => ({
        authForm: {
            defaults: {
                email: "",
                password: "",
                password2: ""
            } as AuthFormData,
            errors: ({email, password, password2}) => ({
                email: [SceneKey.ResetPassword].includes(props.scene)
                    ? undefined
                    : email
                        ? EMAIL_REGEX.test(email)
                            ? undefined
                            : "Email is invalid" : "Email is required",
                password:
                    [SceneKey.ForgotPassword].includes(props.scene)
                        ? undefined
                        : password?.length > 5
                            ? undefined
                            : "Password must be at least 5 characters",
                password2: [SceneKey.SignIn, SceneKey.ForgotPassword].includes(props.scene)
                    ? undefined
                    : password === password2
                        ? undefined
                        : "Passwords do not match",
            }),
            async submit({email, password}, breakpoint) {
                let error: AuthError | null = null
                let user: User | null = null
                if (props.scene === SceneKey.SignIn) {
                    const {
                        error: loginError,
                        data: {user: loginUser},
                    } = await supabase.auth.signInWithPassword({email, password});
                    error = loginError;
                    user = loginUser;
                } else if (props.scene === SceneKey.SignUp) {
                    const {
                        error: loginError,
                        data: {user: loginUser},
                    } = await supabase.auth.signUp({email, password});
                    error = loginError;
                    user = loginUser;
                } else if (props.scene === SceneKey.ForgotPassword) {
                    const {error: forgotPasswordError} = await supabase.auth
                        .resetPasswordForEmail(email, {
                            redirectTo: `${import.meta.env.DEV ? "http://localhost:5173" : "https://sheetstodashboard.com"}${urls.reset_password()}`
                        })
                    error = forgotPasswordError;
                    user = null;
                } else if (props.scene === SceneKey.ResetPassword) {
                    const {error: resetPasswordError, data: resetPasswordData} = await supabase.auth.updateUser({
                        password
                    })
                    error = resetPasswordError
                    user = resetPasswordData.user
                }
                breakpoint()

                if (error) {
                    console.error(error);
                    throw new Error(error.message);
                }
                if (user) {
                    posthog.identify(user.id, {email: user.email});
                }
            }
        }
    })),
    listeners(({props, actions}) => ({
        submitAuthFormFailure: ({error}) => {
            if (!error) {
                return
            }
            if (error.message === "Validation Failed") {
                return
            }
            if (error.message === "User already registered") {
                toast.error(<span>
                    You may already have an account. Try signing in with one of the providers, or click <A
                    className="underline text-blue-600" href={urls.forgot_password()}>here</A> to reset your password.
                </span>)
                return
            }
            toast.error(`There was an error signing you in. Please try again later.`)
        },
        submitAuthFormSuccess: async () => {
            if (props.scene === SceneKey.ForgotPassword) {
                return
            }
            if (props.scene === SceneKey.ResetPassword) {
                toast.success(`Password reset successfully.`)
            }
            const {
                data: {session: currentSession},
            } = await supabase.auth.getSession();
            actions.setUser(currentSession)
            router.actions.push(urls.dashboards())
        }
    }))
])