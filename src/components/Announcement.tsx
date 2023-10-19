import {Link} from "@nextui-org/react";
import {urls} from "../utils/routes";

export function LifetimeDealAnnouncment() {
    return (
        <div className="bg-warning font-medium text-lg px-6 w-full text-center py-5 flex justify-center items-center">
            <div className="max-w-[800px] text-center">
                🔥 Lock in a lifetime deal before pricing changes! $20 for unlimited public dashboards on custom domains for life. <Link
                href={urls.pricing()}
                underline="always"
                className="ml-1 text-lg text-primary-600"
                color="primary"
            >
                Get started today
            </Link>
            </div>
        </div>
    )
}

export function DemoAnnouncement() {
    return (
        <div className="bg-primary font-medium text-lg text-white px-6 w-full py-4 text-center flex justify-center items-center">
            Demo (Changes will not be saved)
        </div>
    )
}