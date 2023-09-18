import {Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import {BsFillFileSpreadsheetFill} from "react-icons/bs";
import {ImOnedrive} from "react-icons/im";
import {useActions} from "kea";
import {dataLogic} from "../logics/dataLogic";
import {SignInModal} from "./SignInModal";
import {userLogic} from "../logics/userLogic";

export function Nav() {
    const {setOpen} = useActions(dataLogic)
    const {signInWithMicrosoft} = useActions(userLogic)
    return (
<>
    <Navbar position="static">
        <NavbarBrand className="flex gap-4 items-center">
            <BsFillFileSpreadsheetFill className="text-2xl"/>
            <p className="font-bold text-inherit">EXCEL 2 WEBSITE</p>
        </NavbarBrand>
        <NavbarContent justify="end">
            <NavbarItem className="hidden sm:flex">
                <Button as={Link} color="primary" size="lg" startContent={<ImOnedrive className="text-2xl"/>} onPress={() => setOpen(true)}>
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
