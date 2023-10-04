import {Footer} from "../components/Footer";
import {PaywallBlurb, PaywallTiers} from "../components/Modal/PublishModal";

function Pricing() {
    return (
        <div id={`admin-wrapper`} className="flex flex-col justify-center w-full gap-4 max-w-[1024px] px-6 my-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl sm:text-5xl !leading-[2.5rem] sm:!leading-[3.25rem] font-bold">Dashboards for your spreadsheets.</h2>
                <h2 className="text-4xl sm:text-5xl !leading-[2.5rem] sm:!leading-[3.25rem] font-bold">Unlimited free tier for private use.</h2>
            </div>
            <div className="flex flex-col gap-12 my-8">
                <div className="flex flex-col gap-4">
                    <PaywallBlurb/>
                </div>
                <PaywallTiers/>
            </div>
            <Footer/>
        </div>
    )
}

export default Pricing