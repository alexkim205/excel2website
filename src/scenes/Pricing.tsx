import {Footer} from "../components/Footer";
import {PaywallBlurb, PaywallTiers} from "../components/Modal/PublishModal";

function Pricing() {
    return (
        <div id={`pricing-wrapper`} className="flex  min-h-[calc(100vh-64px)] pt-20 flex-col justify-center w-full gap-4 max-w-[1024px] px-6">
            <div className="flex flex-col gap-2">
                <h2 className="sm:text-6xl text-5xl font-bold sm:!leading-[4rem] !leading-[3.3rem] max-w-full break-words">
                    Dashboards for your spreadsheets.
                </h2>
                <h2 className="sm:text-6xl text-5xl font-bold sm:!leading-[4rem] !leading-[3.3rem] max-w-full break-words">
                    <span className="underline underline-offset-4">Unlimited free tier</span> for private use.
                </h2>
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