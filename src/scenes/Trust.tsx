import {Footer} from "../components/Footer";
import {A} from "kea-router";

function Trust() {
    return (
        <div id={`trust-wrapper`}
             className="flex  min-h-[calc(100vh-64px)] pt-20 flex-col w-full justify-between max-w-[1024px] px-6"
        >
            <div className="flex flex-col justify-between gap-8">
                <div className="flex flex-col gap-3">
                    <h2 className="sm:text-6xl text-5xl font-bold sm:!leading-[4rem] !leading-[3.3rem] max-w-full break-words">
                        Trust & Security
                    </h2>
                    <p className="sm:text-2xl text-xl font-medium">
                        We care deeply about security and privacy at SheetsToDashboard
                    </p>
                </div>
                <div className="flex flex-col gap-5 leading-relaxed">
                    <p>
                        We are committed to building the most secure dashboard app out there to give you the peace of
                        mind
                        to do your best work. This page below will serve as an up-to-date source to keep up with our
                        security practices.
                    </p>
                    <h3 className="sm:text-3xl text-2xl font-bold max-w-lg">
                        No data stored
                    </h3>
                    <p>
                        No data is ever held by SheetsToDashboard, and will never. Unless you choose to create a
                        dashboard
                        with raw data that must be persisted, no data lives in our servers. When you link either Google
                        or
                        Microsoft
                        accounts to your account, we use <A className="underline font-medium"
                                                            href="https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics"
                                                            target="_blank">best
                        security practices</A> to store the access tokens associated with your account, making sure to
                        refresh and cycle out access and refresh tokens that are granted to us by the third party
                        providers.
                        Data is fetched using these tokens directly from Google Drive or Microsoft Onedrive, so there is
                        no
                        point where this data is persisted and potentially leaked.
                    </p>
                    <p>
                        The only data we collect is standard profile information like email and profile picture provided
                        by
                        Gravatar.
                    </p>
                    <h3 className="sm:text-3xl text-2xl font-bold max-w-lg">
                        Data Encryption
                    </h3>
                    <p>
                        SheetsToDashboard uses <A className="underline font-medium" href="https://supabase.com/"
                                                  target="_blank">Supabase</A> under the hood, which automatically
                        encrypts at REST with AES-256
                        and in transit via TLS. Sensitive information like access tokens and keys are encrypted at the
                        application level before they are stored in the database.
                    </p>
                    <h3 className="sm:text-3xl text-2xl font-bold max-w-lg">
                        Payment Processing
                    </h3>
                    <p>
                        SheetsToDashboard uses <A className="underline font-medium" href="https://stripe.com/"
                                                  target="_blank">Stripe</A> to process payments
                        and does not store personal credit card information for any of our customers.

                        Stripe is a certified PCI Service Provider Level 1, which is the highest level of certification
                        in
                        the payments industry.
                    </p>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Trust