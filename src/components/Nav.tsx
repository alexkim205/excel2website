import {Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import {BsFillFileSpreadsheetFill} from "react-icons/bs";
import {ImOnedrive} from "react-icons/im";
import {useActions, useValues} from "kea";
import {userLogic} from "../logics/userLogic";
import {router} from "kea-router";
import {urls} from "../utils/routes";

export function Nav() {
    const {user} = useValues(userLogic)
    const {signInWithMicrosoft, signOut} = useActions(userLogic)

    return (
        <>
            <Navbar position="static">
                <NavbarBrand className="flex gap-4 items-center cursor-pointer" onClick={() => router.actions.push(urls.home())}>
                    <BsFillFileSpreadsheetFill className="text-2xl"/>
                    <p className="font-bold text-2xl text-inherit">Excel 2 Dashboard</p>
                </NavbarBrand>
                <NavbarContent justify="end">
                    {user ? (
                        <>
                            <NavbarItem className="flex">
                                <Button as={Link} color="default" variant="light" size="md"
                                        onClick={() => signOut()}>
                                    Logout
                                </Button>
                            </NavbarItem>
                        </>
                        ) : (
                        <>
                            <NavbarItem className="hidden sm:flex">
                                <Button as={Link} color="primary" variant="flat" size="md" startContent={<ImOnedrive className="text-2xl"/>}
                                        onPress={() => signInWithMicrosoft()}>
                                    Link with Microsoft OneDrive
                                </Button>
                            </NavbarItem>
                            <NavbarItem className="flex sm:hidden">
                                <Button isIconOnly color="primary" variant="flat" size="lg" onPress={() => signInWithMicrosoft()}>
                                    <ImOnedrive className="text-2xl"/>
                                </Button>
                            </NavbarItem>
                        </>
                    )}
                </NavbarContent>
            </Navbar>
        </>
    )
}
