import {Footer} from "../components/Footer";
import {Tab, Tabs} from "@nextui-org/react";

function TermsAndPrivacy() {
    return (
        <div id={`terms_and_privacy-wrapper`}
             className="flex flex-col justify-center w-full gap-4 max-w-[1024px] px-6">
            <Tabs aria-label="Terms and Privacy" size="lg" classNames={{tab: "font-bold"}}>
                <Tab key="terms" title="Terms">
                    <iframe className="min-h-screen w-full h-fit" src="../../public/terms.html"/>
                </Tab>
                <Tab key="privacy" title="Privacy">
                    <iframe className="min-h-screen w-full h-fit" src="../../public/privacy.html"/>
                </Tab>
            </Tabs>
            <Footer/>
        </div>
    )
}

export default TermsAndPrivacy