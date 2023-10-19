import {
    Avatar, AvatarGroup,
    Button,
    Card,
    CardBody,
} from "@nextui-org/react";
import {A} from "kea-router";
import {urls} from "../utils/routes";
import {useValues} from "kea";
import {userLogic} from "../logics/userLogic";
import {FiPlus} from "react-icons/fi";
import HeroImage from '../assets/hero.png?w=600;1200;1600;&position=top&format=webp&as=source&imagetools'
import {Features} from "../components/Home/Features";
import {Section} from "../components/Home/Section";
import {homeLogic} from "../logics/homeLogic";
import {Footer} from "../components/Footer";
import {ResponsiveImage} from "../components/ResponsiveImage";

function Home() {
    const {gravatarIds} = useValues(homeLogic)
    const {user} = useValues(userLogic)

    return (
        <div className="flex flex-col w-full max-w-[1024px] mt-12 px-6 sm:gap-12 gap-8">
            <div className="flex flex-col justify-center items-center gap-5 my-8">
                <h1 className="sm:text-7xl text-6xl font-bold sm:!leading-[5rem] !leading-[4rem] text-center max-w-full">Publish
                    your spreadsheets as beautiful dashboards.</h1>
                <p className="sm:text-xl text-center text-lg max-w-3xl sm:!leading-[1.8rem]">Sheets to Dashboard helps you build dashboards
                    from your spreadsheets and share them as links. Integrates with Google Sheets and Microsoft Excel.</p>
                <div className="flex flex-row gap-3">
                    {user ? (
                        <>
                            <Button as={A} href={urls.dashboards()} color="primary" size="lg" radius="sm"
                                    className="h-10 px-4 font-medium">
                                Go to Dashboard
                            </Button>
                            <Button as={A} href={urls.demo_dashboard()} color="default" size="lg" radius="sm"
                                    className="h-10 px-4 font-medium bg-black text-white">
                                Live demo
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button as={A} href={urls.sign_up()} color="primary" size="lg" radius="sm"
                                    className="h-10 px-4 font-medium"
                                    endContent={<FiPlus className="text-xl"/>}>
                                Make a dashboard
                            </Button>
                            <Button as={A} href={urls.demo_dashboard()} color="default" size="lg" radius="sm"
                                    className="h-10 px-4 font-medium bg-black text-white">
                                Live demo
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <Card fullWidth shadow="md" className="sm:text-2xl max-w-[900px] aspect-[4/3] mx-auto text-xl border-none"
                  classNames={{body: "p-0 overflow-hidden"}}>
                <CardBody>
                    <ResponsiveImage
                        srcSet={HeroImage}
                        alt="Hero image"
                    />
                </CardBody>
            </Card>
            <Section
                title={<><span className="underline underline-offset-4">100+ and counting</span> people use
                    Sheets to Dashboard today.</>}
                subtitle="Powering business owners, students, developers, product managers, and everything in between.">
                <AvatarGroup
                    isBordered
                    max={23}
                    total={100}
                    className="flex flex-wrap max-w-2xl mx-auto"
                    renderCount={() => (
                        <div className="flex flex-row items-center gap-2 ml-3 text-2xl"> + <span
                            className="text-3xl">🫵</span></div>
                    )}
                >
                    {gravatarIds.map(({hash, initials}, index) => (
                        <Avatar color="primary" classNames={{base: "shrink-0", name: "font-medium text-xl"}}
                                src={`https://www.gravatar.com/avatar/${hash}?d=identicon`}
                                name={initials.toUpperCase()} key={index} size="lg"/>
                    ))}
                </AvatarGroup>
            </Section>
            <Features/>
            <Section title="Create your first dashboard and share in minutes">
                <div className="w-full flex justify-center">
                    <Button as={A} href={user ? urls.dashboards() : urls.sign_in()} color="primary" size="lg" radius="sm"
                            className="h-10 px-4 font-medium"
                            endContent={<FiPlus className="text-xl"/>}>
                        Make a dashboard
                    </Button>
                </div>
            </Section>
            <Footer/>
        </div>
    )
}

export default Home