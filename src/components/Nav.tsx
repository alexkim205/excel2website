import {
    Badge,
    Button,
    Link,
    LinkProps,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    useDisclosure
} from "@nextui-org/react";
import {useActions, useValues} from "kea";
import {userLogic} from "../logics/userLogic";
import {A, router} from "kea-router";
import {SceneKey, urls} from "../utils/routes";
import {BsFillFileEarmarkSpreadsheetFill} from "react-icons/bs";
import {UserCircle} from "./Modal/UserCircle";
import {sceneLogic} from "../logics/sceneLogic";
import {useState} from "react";
import clsx from "clsx";
import {LinkedAccountsModal} from "./Modal/LinkedAccountsModal";
import {LuPlus} from "react-icons/lu";

export function Nav() {
    const {scene} = useValues(sceneLogic)
    const {user} = useValues(userLogic)
    const {signOut} = useActions(userLogic)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const linkedAccountsModalDisclosureProps = useDisclosure()
    const isAuthPage = [SceneKey.SignIn, SceneKey.SignUp, SceneKey.ForgotPassword, SceneKey.ResetPassword].includes(scene)
    const isPrivatePage = [SceneKey.Dashboard, SceneKey.Dashboards].includes(scene)
    const menuItems = [
        {
            label: "Trust & Security",
            href: urls.trust(),
        },
        {
            label: "Pricing",
            href: urls.pricing(),
        },
        ...(user ? [
            {
                label: "Dashboard",
                href: urls.dashboards(),
                color: "warning"
            },
            {
                label: "Logout",
                onClick: () => signOut(),
                color: "danger"
            },
        ] : [
            {
                label: "Log in",
                href: urls.sign_in(),
            },
            {
                label: "Sign up",
                href: urls.sign_up(),
                color: "warning"
            },
        ])
    ] as ({ label: string } & LinkProps)[]

    return (
        <>
            <Navbar onMenuOpenChange={setIsMenuOpen} position="static"
                    classNames={{menu: "bg-gray-950", base: "bg-gray-950 text-gray-100"}}
                    maxWidth={isAuthPage ? "full" : undefined}>
                <NavbarContent justify="start">
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand className="flex gap-3 items-center cursor-pointer"
                                 onClick={() => router.actions.push(urls.home())}>
                        <BsFillFileEarmarkSpreadsheetFill className="text-3xl"/>
                        <Badge content="Beta" disableOutline size="lg" color="primary" placement="top-right"
                               classNames={{badge: "sm:block hidden top-2 px-2 py-1 tracking-wider font-semibold text-xs -right-3 rotate-[20deg]"}}>
                            <p className="sm:block hidden font-bold text-3xl text-inherit">Sheets to Dashboard</p>
                            <p className="sm:hidden block font-bold text-3xl text-inherit">S2D</p>
                        </Badge>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent justify="end">
                    {(scene === SceneKey.Home || scene === SceneKey.Pricing || scene === SceneKey.Trust) && (
                        <>
                            <NavbarItem className="sm:flex hidden">
                                <Button as={A} href={urls.trust()} color="default"
                                        className="text-gray-400 hover:text-white hover:bg-transparent bg-transparent px-2 min-w-fit"
                                        variant="flat" size="lg">
                                    Trust & Security
                                </Button>
                            </NavbarItem>
                            <NavbarItem className="sm:flex hidden">
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
                            ) : isPrivatePage ? (
                                <>
                                    <NavbarItem className="sm:flex hidden">
                                        <Button as={Link} color="default"
                                                className="text-gray-400 hover:text-white hover:bg-transparent bg-transparent px-2 min-w-fit"
                                                variant="flat" size="lg"
                                                onClick={() => signOut()}>
                                            Logout
                                        </Button>
                                    </NavbarItem>
                                    <NavbarItem className="sm:flex hidden">
                                        <Button as={Link} onPress={() => linkedAccountsModalDisclosureProps.onOpen()}
                                                color="primary" size="lg" radius="sm"
                                                className="h-10 px-4 font-medium min-w-fit"
                                                endContent={<LuPlus className="text-xl"/>}
                                        >
                                            Add Data
                                        </Button>
                                    </NavbarItem>
                                    <NavbarItem>
                                        <UserCircle/>
                                    </NavbarItem>
                                </>
                            ) : <>
                                <NavbarItem className="hidden sm:flex">
                                    <Button as={A} href={urls.dashboards()} color="primary" size="lg" radius="sm"
                                            className="h-10 px-4 font-medium min-w-fit">
                                        Go to Dashboard
                                    </Button>
                                </NavbarItem>
                            </>}
                        </>
                    ) : !isAuthPage && (
                        <>
                            <NavbarItem className="hidden sm:flex">
                                <Button as={A} href={urls.sign_in()} color="primary" size="lg" radius="sm"
                                        className="font-medium h-10 px-4"
                                >
                                    Get Started
                                </Button>
                            </NavbarItem>
                            <NavbarItem className="flex sm:hidden">
                                <Button as={A} href={urls.sign_in()} color="primary" size="lg" radius="sm"
                                        className="h-10 px-4 font-medium">
                                    Get Started
                                </Button>
                            </NavbarItem>
                        </>
                    )}
                </NavbarContent>
                <NavbarMenu className="py-4">
                    {menuItems.map(({label, ...linkProps}, index) => (
                        <NavbarMenuItem key={`${label}-${index}`}>
                            <Link
                                className={clsx("w-full", !linkProps.color && "text-gray-200")}
                                size="lg"
                                {...linkProps}
                            >
                                {label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>
            <LinkedAccountsModal {...linkedAccountsModalDisclosureProps}/>
        </>
    )
}
