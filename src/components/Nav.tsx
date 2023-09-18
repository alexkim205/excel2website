import {Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import {BsFillFileSpreadsheetFill} from "react-icons/bs";
import {ImOnedrive} from "react-icons/im";
import {useActions, useValues} from "kea";
import {SignInModal} from "./SignInModal";
import {userLogic} from "../logics/userLogic";

export function Nav() {
    const {user} = useValues(userLogic)
    const {signInWithMicrosoft} = useActions(userLogic)

    console.log("USER", user)

    return (
<>
    <Navbar position="static">
        <NavbarBrand className="flex gap-4 items-center">
            <BsFillFileSpreadsheetFill className="text-2xl"/>
            <p className="font-bold text-inherit">Excel 2 Website</p>
        </NavbarBrand>
        <NavbarContent justify="end">
            <NavbarItem className="hidden sm:flex">
                <Button as={Link} color="primary" size="lg" startContent={<ImOnedrive className="text-2xl"/>} onPress={() => signInWithMicrosoft()}>
                    Link with Microsoft OneDrive
                </Button>
            </NavbarItem>
            <NavbarItem className="flex sm:hidden">
                <Button isIconOnly color="primary" size="lg" onPress={() => signInWithMicrosoft()}>
                    <ImOnedrive className="text-2xl"/>
                </Button>
            </NavbarItem>
        </NavbarContent>
    </Navbar>
    <SignInModal/>
</>
    )
}
