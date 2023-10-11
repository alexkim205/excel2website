import {Badge, Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import {useActions, useValues} from "kea";
import {userLogic} from "../logics/userLogic";
import {A, router} from "kea-router";
import {SceneKey, urls} from "../utils/routes";
import {BsFillFileEarmarkSpreadsheetFill} from "react-icons/bs";
import {UserCircle} from "./Modal/UserCircle";
import {sceneLogic} from "../logics/sceneLogic";
import {FiPlus} from "react-icons/fi";

export function Nav() {
    const {scene} = useValues(sceneLogic)
    const {user} = useValues(userLogic)
    const {signOut} = useActions(userLogic)

    return (
        <>
            <Navbar position="static" className="bg-gray-950 text-gray-100">
                <NavbarBrand className="flex gap-3 items-center cursor-pointer"
                             onClick={() => router.actions.push(urls.home())}>
                    <BsFillFileEarmarkSpreadsheetFill className="text-3xl"/>
                    <Badge content="Beta!" disableOutline size="lg" color="primary" placement="top-right"
                           classNames={{badge: "sm:block hidden top-2 px-2 py-1 tracking-wider font-semibold text-xs -right-3 rotate-[20deg]"}}>
                        <p className="sm:block hidden font-bold text-3xl text-inherit">Sheets to Dashboard</p>
                        <p className="sm:hidden block font-bold text-3xl text-inherit">S2D</p>
                    </Badge>
                </NavbarBrand>
                <NavbarContent justify="end">
                    {(scene === SceneKey.Home || scene === SceneKey.Pricing || scene === SceneKey.Trust) && (
                        <>
                            <NavbarItem className="flex">
                                <Button as={A} href={urls.trust()} color="default"
                                        className="text-gray-400 hover:text-white hover:bg-transparent bg-transparent px-2 min-w-fit"
                                        variant="flat" size="lg">
                                    Trust & Security
                                </Button>
                            </NavbarItem>
                            <NavbarItem className="flex">
                                <Button as={A} href={urls.pricing()} color="default"
                                        className="text-gray-400 hover:text-white hover:bg-transparent bg-transparent px-2 min-w-fit"
                                        variant="flat" size="lg">
                                    Pricing
                                </Button>
                            </NavbarItem>
                        </>
                    )}
                    {user ? (
                        <>
                            <NavbarItem className="flex">
                                <Button as={Link} color="default"
                                        className="text-gray-400 hover:text-white hover:bg-transparent bg-transparent px-2 min-w-fit"
                                        variant="flat" size="lg"
                                        onClick={() => signOut()}>
                                    Logout
                                </Button>
                            </NavbarItem>
                            {scene === SceneKey.Home ? (
                                <>
                                    <NavbarItem className="hidden sm:flex">
                                        <Button as={A} href={urls.dashboards()} color="primary" size="lg" radius="sm"
                                                className="h-10 px-4 font-medium min-w-fit">
                                            Go to Dashboard
                                        </Button>
                                    </NavbarItem>
                                    <NavbarItem className="flex sm:hidden">
                                        <Button as={A} href={urls.dashboards()} color="primary" size="lg" radius="sm"
                                                className="h-10 px-4 font-medium min-w-fit">
                                            Dashboard
                                        </Button>
                                    </NavbarItem>
                                </>
                            ) : (
                                <NavbarItem>
                                    <UserCircle/>
                                </NavbarItem>
                            )}
                        </>
                    ) : ![SceneKey.SignIn, SceneKey.SignUp, SceneKey.ForgotPassword, SceneKey.ResetPassword].includes(scene) && (
                        <>
                            <NavbarItem className="hidden sm:flex">
                                <Button as={A} href={urls.sign_in()} color="primary" size="lg" radius="sm"
                                        className="font-medium h-10 px-4"
                                        endContent={<FiPlus className="text-xl"/>}
                                >
                                    Make a dashboard
                                </Button>
                            </NavbarItem>
                            <NavbarItem className="flex sm:hidden">
                                <Button as={A} href={urls.sign_in()} color="primary" size="lg" radius="sm"
                                        endContent={<FiPlus className="text-xl"/>} className="h-10 px-4 font-medium">
                                    Dashboard
                                </Button>
                            </NavbarItem>
                        </>
                    )}
                </NavbarContent>
            </Navbar>
        </>
    )
}
