import {
    Button,
    Card,
    CardBody, Link,
} from "@nextui-org/react";
import {A} from "kea-router";
import {urls} from "../utils/routes";
import {useActions, useValues} from "kea";
import {userLogic} from "../logics/userLogic";
import {ImOnedrive} from "react-icons/im";
import {FiArrowRight} from "react-icons/fi";
import HeroImage from './hero.png?webp&imagetools'


export function Home() {
    const {user} = useValues(userLogic)
    const {signInWithMicrosoft} = useActions(userLogic)

    return (
        <div className="flex flex-col w-full max-w-[1024px] px-6 sm:gap-8 gap-6">
            <div className="flex flex-col justify-center items-center gap-5 my-8">
                <h1 className="sm:text-7xl text-6xl font-bold sm:!leading-[5rem] !leading-[4rem] text-center max-w-full break-words">Publish
                    your spreadsheets as beautiful dashboards.</h1>
                <p className="sm:text-2xl text-center text-lg max-w-4xl">Sheets to Dashboard helps you build dashboards
                    from your Excel spreadsheets and share them as links.</p>
                {user ? (
                    <Button as={A} href={urls.dashboards()} color="default" size="lg" radius="sm"
                            className="h-10 px-4 font-medium bg-black text-white">
                        Go to Dashboard
                    </Button>
                ) : (
                    <Button as={Link} onPress={() => signInWithMicrosoft()} color="default" size="lg" radius="sm"
                            className="h-10 px-4 font-medium bg-black text-white"
                            startContent={<ImOnedrive className="text-2xl"/>} endContent={<FiArrowRight className="text-xl"/>}>
                        Continue with Microsoft
                    </Button>
                )}
            </div>
            <Card fullWidth className="sm:text-2xl max-w-[900px] mx-auto text-xl border-none" classNames={{body: "p-0"}}>
                <CardBody>
                    <img srcSet={HeroImage} alt="Hero image"/>
                </CardBody>
            </Card>
        </div>
    )
}