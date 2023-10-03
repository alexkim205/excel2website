import {Badge, Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import {ImOnedrive} from "react-icons/im";
import {useActions, useValues} from "kea";
import {userLogic} from "../logics/userLogic";
import {A, router} from "kea-router";
import {SceneKey, urls} from "../utils/routes";
import {BsFillFileEarmarkSpreadsheetFill} from "react-icons/bs";
import {UserCircle} from "./Modal/UserCircle";
import {sceneLogic} from "../logics/sceneLogic";

export function Nav() {
    const {scene} = useValues(sceneLogic)
    const {user} = useValues(userLogic)
    const {signInWithMicrosoft, signOut} = useActions(userLogic)

    return (
        <>
            <Navbar position="static" className="bg-gray-950 text-gray-100">
                <NavbarBrand className="flex gap-3 items-center cursor-pointer"
                             onClick={() => router.actions.push(urls.home())}>
                    <BsFillFileEarmarkSpreadsheetFill className="text-3xl"/>
                    <Badge content="Beta!" disableOutline size="lg" color="primary" placement="top-right"
                           classNames={{badge: "sm:block hidden top-1.5 -right-3 rotate-[20deg]"}}>
                        <p className="sm:block hidden font-bold text-3xl text-inherit">Sheets to Dashboard</p>
                        <p className="sm:hidden block font-bold text-3xl text-inherit">S2D</p>
                    </Badge>
                </NavbarBrand>
                <NavbarContent justify="end">
                    {user ? (
                        <>
                            <NavbarItem className="flex">
                                <Button as={Link} color="default"
                                        className="text-gray-400 hover:text-white hover:bg-transparent bg-transparent"
                                        variant="flat" size="lg"
                                        onClick={() => signOut()}>
                                    Logout
                                </Button>
                            </NavbarItem>
                            {scene === SceneKey.Home ? (
                                <>
                                    <NavbarItem className="hidden sm:flex">
                                        <Button as={A} href={urls.dashboards()} color="primary" size="lg" radius="sm"
                                                className="h-10 px-4 font-medium">
                                            Go to Dashboard
                                        </Button>
                                    </NavbarItem>
                                    <NavbarItem className="flex sm:hidden">
                                        <Button as={A} href={urls.dashboards()} color="primary" size="lg" radius="sm"
                                                className="h-10 px-4 font-medium">
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
                    ) : (
                        <>
                            <NavbarItem className="flex">
                                <Button as={A} href={urls.pricing()} color="default"
                                        className="text-gray-400 hover:text-white hover:bg-transparent bg-transparent"
                                        variant="flat" size="lg">
                                    Pricing
                                </Button>
                            </NavbarItem>
                            <NavbarItem className="hidden sm:flex">
                                <Button as={Link} color="primary" size="lg" radius="sm"
                                        className="font-medium h-10 px-4"
                                        startContent={<ImOnedrive className="text-2xl"/>}
                                        onPress={() => signInWithMicrosoft()}
                                >
                                    Continue with Microsoft
                                </Button>
                            </NavbarItem>
                            <NavbarItem className="flex sm:hidden">
                                <Button color="primary" size="lg" radius="sm" onPress={() => signInWithMicrosoft()}
                                        startContent={<ImOnedrive className="text-2xl"/>} className="h-10 px-4">
                                    Sign in
                                </Button>
                            </NavbarItem>
                        </>
                    )}
                </NavbarContent>
            </Navbar>
        </>
    )
}
