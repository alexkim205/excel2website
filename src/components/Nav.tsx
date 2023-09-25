import {Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import {ImOnedrive} from "react-icons/im";
import {useActions, useValues} from "kea";
import {userLogic} from "../logics/userLogic";
import {router} from "kea-router";
import {urls} from "../utils/routes";
import {BsFillFileEarmarkSpreadsheetFill} from "react-icons/bs";

export function Nav() {
    const {user} = useValues(userLogic)
    const {signInWithMicrosoft, signOut} = useActions(userLogic)

    return (
        <>
            <Navbar position="static" className="bg-gray-950 text-gray-100">
                <NavbarBrand className="flex gap-3 items-center cursor-pointer" onClick={() => router.actions.push(urls.home())}>
                    <BsFillFileEarmarkSpreadsheetFill className="text-3xl"/>
                    <p className="sm:block hidden font-bold text-3xl text-inherit">Sheets to Dashboard</p>
                </NavbarBrand>
                <NavbarContent justify="end">
                    {user ? (
                        <>
                            <NavbarItem className="flex">
                                <Button as={Link} color="default" className="text-gray-400 hover:text-white hover:bg-transparent bg-transparent" variant="flat" size="md"
                                        onClick={() => signOut()}>
                                    Logout
                                </Button>
                            </NavbarItem>
                        </>
                        ) : (
                        <>
                            <NavbarItem className="hidden sm:flex">
                                <Button as={Link} color="primary" size="lg" startContent={<ImOnedrive className="text-2xl"/>}
                                        onPress={() => signInWithMicrosoft()}>
                                    Sign in with Microsoft
                                </Button>
                            </NavbarItem>
                            <NavbarItem className="flex sm:hidden">
                                <Button color="primary" size="lg" onPress={() => signInWithMicrosoft()} startContent={<ImOnedrive className="text-2xl"/>}>
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
